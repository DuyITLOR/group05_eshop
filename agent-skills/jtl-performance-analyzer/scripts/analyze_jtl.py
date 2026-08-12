#!/usr/bin/env python3
"""Deterministic, read-only aggregation for JMeter CSV or XML JTL files."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import sys
import xml.etree.ElementTree as element_tree
from array import array
from collections import Counter
from pathlib import Path
from typing import Any, Iterable


class JtlInputError(Exception):
    """Raised when a JTL cannot provide required deterministic evidence."""


ALIASES = {
    "timestamp": ("timestamp", "ts"),
    "elapsed": ("elapsed", "t"),
    "label": ("label", "lb"),
    "success": ("success", "s"),
    "response_code": ("responsecode", "rc"),
    "response_message": ("responsemessage", "rm"),
    "failure_message": ("failuremessage",),
}


def normalize_key(value: str) -> str:
    return "".join(character for character in value.lower() if character.isalnum())


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def parse_number(value: Any) -> float | None:
    if value is None:
        return None
    try:
        parsed = float(str(value).strip())
    except ValueError:
        return None
    return parsed if math.isfinite(parsed) else None


def parse_boolean(value: Any) -> bool | None:
    if value is None:
        return None
    normalized = str(value).strip().lower()
    if normalized in {"true", "1", "yes"}:
        return True
    if normalized in {"false", "0", "no"}:
        return False
    return None


def scalar(value: float | int | None) -> float | int | None:
    if value is None:
        return None
    return int(value) if float(value).is_integer() else round(float(value), 6)


def value_from(record: dict[str, Any], key: str) -> Any:
    for alias in ALIASES[key]:
        if alias in record:
            return record[alias]
    return None


class Aggregate:
    def __init__(self) -> None:
        self.samples = 0
        self.elapsed_ms = array("d")
        self.timestamps = array("d")
        self.successful = 0
        self.failed = 0
        self.unknown_success = 0
        self.response_codes: Counter[str] = Counter()
        self.error_types: Counter[str] = Counter()
        self.invalid_elapsed = 0
        self.invalid_timestamp = 0

    def add(self, record: dict[str, Any]) -> None:
        self.samples += 1
        elapsed = parse_number(value_from(record, "elapsed"))
        if elapsed is None or elapsed < 0:
            self.invalid_elapsed += 1
        else:
            self.elapsed_ms.append(elapsed)

        timestamp = parse_number(value_from(record, "timestamp"))
        if timestamp is None:
            self.invalid_timestamp += 1
        else:
            self.timestamps.append(timestamp)

        success = parse_boolean(value_from(record, "success"))
        response_code = value_from(record, "response_code")
        if response_code not in (None, ""):
            self.response_codes[str(response_code)] += 1
        if success is True:
            self.successful += 1
        elif success is False:
            self.failed += 1
            error = value_from(record, "failure_message") or value_from(record, "response_message")
            if error not in (None, ""):
                self.error_types[str(error)] += 1
            elif response_code not in (None, ""):
                self.error_types[f"HTTP {response_code}"] += 1
            else:
                self.error_types["Failure without message"] += 1
        else:
            self.unknown_success += 1

    @staticmethod
    def percentile(values: array, percentile: int) -> float | None:
        if not values:
            return None
        ordered = sorted(values)
        # Nearest-rank: rank = ceil(percentile / 100 * n), one-based.
        index = max(0, math.ceil(percentile / 100 * len(ordered)) - 1)
        return ordered[index]

    @staticmethod
    def median(values: array) -> float | None:
        if not values:
            return None
        ordered = sorted(values)
        middle = len(ordered) // 2
        if len(ordered) % 2:
            return ordered[middle]
        return (ordered[middle - 1] + ordered[middle]) / 2

    def as_dict(self, observation_duration_seconds: float | None = None) -> dict[str, Any]:
        response_count = len(self.elapsed_ms)
        timestamp_count = len(self.timestamps)
        elapsed_mean = sum(self.elapsed_ms) / response_count if response_count else None
        elapsed_min = min(self.elapsed_ms) if response_count else None
        elapsed_max = max(self.elapsed_ms) if response_count else None
        duration_seconds = observation_duration_seconds
        throughput = None
        if duration_seconds is None and timestamp_count == self.samples and timestamp_count >= 2:
            duration_seconds = (max(self.timestamps) - min(self.timestamps)) / 1000
        if duration_seconds is not None and duration_seconds > 0:
            throughput = self.samples / duration_seconds

        success_known = self.successful + self.failed
        success_classification_complete = success_known == self.samples
        error_rate = None
        if success_classification_complete and self.samples > 0:
            error_rate = self.failed * 100 / self.samples

        return {
            "samples": self.samples,
            "response_time_samples": response_count,
            "response_time_coverage_percent": scalar(response_count * 100 / self.samples) if self.samples else None,
            "observed_successful_samples": self.successful,
            "observed_failed_samples": self.failed,
            "successful_samples": self.successful if success_classification_complete else "NOT_COMPUTABLE",
            "failed_samples": self.failed if success_classification_complete else "NOT_COMPUTABLE",
            "unknown_success_samples": self.unknown_success,
            "error_rate_percent": scalar(error_rate) if error_rate is not None else "NOT_COMPUTABLE",
            "response_time_ms": {
                "min": scalar(elapsed_min),
                "max": scalar(elapsed_max),
                "mean": scalar(elapsed_mean),
                "median": scalar(self.median(self.elapsed_ms)),
                "p50_nearest_rank": scalar(self.percentile(self.elapsed_ms, 50)),
                "p90": scalar(self.percentile(self.elapsed_ms, 90)),
                "p95": scalar(self.percentile(self.elapsed_ms, 95)),
                "p99": scalar(self.percentile(self.elapsed_ms, 99)),
            },
            "throughput_rps": scalar(throughput) if throughput is not None else "NOT_COMPUTABLE",
            "throughput_observation_duration_seconds": scalar(duration_seconds),
            "time_span_seconds": scalar(duration_seconds),
            "response_codes": dict(sorted(self.response_codes.items())),
            "error_types": dict(self.error_types.most_common()),
            "integrity_notes": {
                "invalid_elapsed_samples": self.invalid_elapsed,
                "invalid_timestamp_samples": self.invalid_timestamp,
                "success_classification_complete": success_classification_complete,
                "throughput_computable": throughput is not None,
            },
        }


def detect_format(path: Path) -> str:
    with path.open("rb") as source:
        prefix = source.read(4096).lstrip(b"\xef\xbb\xbf \t\r\n")
    if not prefix:
        raise JtlInputError("JTL is empty")
    return "xml" if prefix.startswith(b"<") else "csv"


def normalized_record(record: dict[str, Any]) -> dict[str, Any]:
    return {normalize_key(str(key)): value for key, value in record.items() if key is not None}


def csv_records(path: Path) -> Iterable[dict[str, Any]]:
    with path.open("r", encoding="utf-8-sig", newline="") as source:
        sample = source.read(8192)
        source.seek(0)
        try:
            dialect = csv.Sniffer().sniff(sample, delimiters=",;\t")
        except csv.Error:
            dialect = csv.excel
        reader = csv.DictReader(source, dialect=dialect)
        if not reader.fieldnames:
            raise JtlInputError("CSV JTL has no header")
        headers = {normalize_key(header) for header in reader.fieldnames if header}
        if not any(alias in headers for alias in ALIASES["elapsed"]):
            raise JtlInputError("CSV JTL has no elapsed/response-time column")
        for row in reader:
            yield normalized_record(row)


def xml_records(path: Path) -> Iterable[dict[str, Any]]:
    try:
        for _, element in element_tree.iterparse(path, events=("end",)):
            tag = element.tag.rsplit("}", 1)[-1]
            if tag in {"sample", "httpSample"}:
                yield normalized_record(element.attrib)
                element.clear()
    except element_tree.ParseError as error:
        raise JtlInputError(f"XML JTL is not well-formed: {error}") from error


def load_stage_map(path: Path | None) -> list[dict[str, Any]]:
    if path is None:
        return []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise JtlInputError(f"Invalid stage map: {error}") from error
    if not isinstance(data, list):
        raise JtlInputError("Stage map must be a JSON array")
    stages = []
    names: set[str] = set()
    for entry in data:
        if not isinstance(entry, dict) or not {"name", "start_ms", "end_ms"} <= entry.keys():
            raise JtlInputError("Each stage requires name, start_ms and end_ms")
        name = str(entry["name"]).strip()
        if not name:
            raise JtlInputError("EMPTY_STAGE_NAME")
        if name in names:
            raise JtlInputError("DUPLICATE_STAGE_NAME")
        start, end = parse_number(entry["start_ms"]), parse_number(entry["end_ms"])
        if start is None or end is None or end <= start:
            raise JtlInputError("Stage timestamps must be numeric with end_ms > start_ms")
        names.add(name)
        stages.append({"name": name, "start_ms": start, "end_ms": end})
    stages.sort(key=lambda stage: (stage["start_ms"], stage["end_ms"], stage["name"]))
    for previous, current in zip(stages, stages[1:]):
        if current["start_ms"] < previous["end_ms"]:
            raise JtlInputError("STAGE_MAP_OVERLAP")
    return stages


def analyze(path: Path, window_seconds: int | None, stage_map: list[dict[str, Any]]) -> dict[str, Any]:
    if not path.is_file():
        raise JtlInputError("RAW_JTL_NOT_FOUND")
    before_hash = sha256(path)
    file_format = detect_format(path)
    records = xml_records(path) if file_format == "xml" else csv_records(path)
    overall = Aggregate()
    per_label: dict[str, Aggregate] = {}
    per_stage: dict[str, Aggregate] = {stage["name"]: Aggregate() for stage in stage_map}
    timestamped_samples = 0
    mapped_samples = 0

    for record in records:
        overall.add(record)
        label = str(value_from(record, "label") or "UNLABELLED")
        per_label.setdefault(label, Aggregate()).add(record)
        timestamp = parse_number(value_from(record, "timestamp"))
        if timestamp is not None:
            timestamped_samples += 1
            for stage in stage_map:
                if stage["start_ms"] <= timestamp < stage["end_ms"]:
                    per_stage[stage["name"]].add(record)
                    mapped_samples += 1
                    break

    if overall.samples == 0:
        raise JtlInputError("JTL has zero samples")
    if not overall.elapsed_ms:
        raise JtlInputError("JTL has no parseable elapsed/response-time samples")

    after_hash = sha256(path)
    run_start_ms = min(overall.timestamps) if overall.timestamps else None
    run_end_ms = max(overall.timestamps) if overall.timestamps else None
    stage_mapping = {
        "status": "NOT_APPLICABLE",
        "timestamped_samples": timestamped_samples,
        "mapped_samples": 0,
        "unmapped_samples": 0,
        "mapping_coverage_percent": "NOT_COMPUTABLE",
    }
    if stage_map:
        unmapped_samples = timestamped_samples - mapped_samples
        stage_mapping = {
            "status": "COMPLETE" if timestamped_samples and not unmapped_samples else "PARTIAL",
            "timestamped_samples": timestamped_samples,
            "mapped_samples": mapped_samples,
            "unmapped_samples": unmapped_samples,
            "mapping_coverage_percent": scalar(mapped_samples * 100 / timestamped_samples)
            if timestamped_samples
            else "NOT_COMPUTABLE",
        }
    result = {
        "analysis_status": "COMPLETE",
        "source": {
            "jtl": str(path),
            "format": file_format,
            "raw_sha256_before": before_hash,
            "raw_sha256_after": after_hash,
            "raw_unchanged": before_hash == after_hash,
        },
        "calculation_notes": {
            "response_time_field": "elapsed (CSV) / t (XML), milliseconds",
            "median_method": "statistical median; even n is the arithmetic mean of the two middle values",
            "percentile_method": "p50_nearest_rank/p90/p95/p99: ceil(p / 100 * n), no interpolation",
            "overall_throughput_method": "total samples divided by full run observation duration from min to max timestamp",
            "window_throughput_method": "samples divided by configured window duration; final partial window uses observed run intersection",
            "stage_throughput_method": "stage samples divided by explicit stage end_ms-start_ms duration",
            "filtering": "none; all parseable samples are included",
            "warmup_handling": "none unless a separate, explicit filter is supplied outside this script",
            "application_success": "NOT_AVAILABLE from standard JTL fields unless separately evidenced",
        },
        "overall_metrics": overall.as_dict(),
        "per_label_metrics": {label: aggregate.as_dict() for label, aggregate in sorted(per_label.items())},
        "per_window_metrics": {},
        "per_stage_metrics": {
            stage["name"]: per_stage[stage["name"]].as_dict(
                (stage["end_ms"] - stage["start_ms"]) / 1000
            )
            for stage in stage_map
        },
        "stage_mapping": stage_mapping,
    }
    if overall.invalid_timestamp or overall.unknown_success or overall.invalid_elapsed:
        result["analysis_status"] = "PARTIAL"
    if stage_map and stage_mapping["status"] != "COMPLETE":
        result["analysis_status"] = "PARTIAL"
    if window_seconds:
        result["time_window_seconds"] = window_seconds
        if run_start_ms is None or run_end_ms is None:
            result["per_window_metrics"] = "NOT_COMPUTABLE"
        else:
            per_window: dict[int, Aggregate] = {}
            window_records = xml_records(path) if file_format == "xml" else csv_records(path)
            window_ms = window_seconds * 1000
            for record in window_records:
                timestamp = parse_number(value_from(record, "timestamp"))
                if timestamp is not None:
                    bucket = int((timestamp - run_start_ms) // window_ms)
                    per_window.setdefault(bucket, Aggregate()).add(record)
            run_duration_ms = max(0, run_end_ms - run_start_ms)
            result["per_window_metrics"] = {
                f"{bucket * window_seconds}-{(bucket + 1) * window_seconds}s": {
                    "relative_start_seconds": bucket * window_seconds,
                    "relative_end_seconds": (bucket + 1) * window_seconds,
                    "absolute_start_ms": scalar(run_start_ms + bucket * window_ms),
                    "absolute_end_ms": scalar(run_start_ms + (bucket + 1) * window_ms),
                    "metrics": aggregate.as_dict(
                        window_seconds
                        if (bucket + 1) * window_ms <= run_duration_ms
                        else max(0, run_duration_ms - bucket * window_ms) / 1000
                    ),
                }
                for bucket, aggregate in sorted(per_window.items())
            }
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Read-only deterministic JTL metrics calculator")
    parser.add_argument("jtl", type=Path, help="Raw CSV or XML JTL path")
    parser.add_argument("--output", type=Path, help="Optional derived JSON output path")
    parser.add_argument("--window-seconds", type=int, help="Optional positive epoch-aligned window size")
    parser.add_argument("--stage-map", type=Path, help="Optional JSON array with name/start_ms/end_ms")
    arguments = parser.parse_args()
    if arguments.window_seconds is not None and arguments.window_seconds <= 0:
        parser.error("--window-seconds must be positive")
    if arguments.output and arguments.output.resolve() == arguments.jtl.resolve():
        parser.error("--output must not overwrite the raw JTL")
    try:
        result = analyze(arguments.jtl, arguments.window_seconds, load_stage_map(arguments.stage_map))
    except JtlInputError as error:
        result = {"analysis_status": "BLOCKED", "reason": str(error), "source": {"jtl": str(arguments.jtl)}}
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 2
    rendered = json.dumps(result, ensure_ascii=False, indent=2)
    if arguments.output:
        arguments.output.parent.mkdir(parents=True, exist_ok=True)
        arguments.output.write_text(rendered + "\n", encoding="utf-8")
    print(rendered)
    return 0


if __name__ == "__main__":
    sys.exit(main())
