#!/usr/bin/env python3
"""Đọc JTL dạng CSV và xuất metric theo label có thể tái tính."""

from __future__ import annotations

import argparse
import csv
import json
import math
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


def percentile_nearest_rank(values: list[int], percentile: float) -> int | None:
    if not values:
        return None
    ordered = sorted(values)
    rank = max(1, math.ceil(percentile / 100.0 * len(ordered)))
    return ordered[rank - 1]


def parse_int(value: str | None, default: int = 0) -> int:
    try:
        return int(value or default)
    except (TypeError, ValueError):
        return default


def segment_rows(rows: list[dict[str, str]], gap_ms: int) -> list[list[dict[str, str]]]:
    if not rows:
        return []
    # Subresult có thể được ghi sau sample cha dù timestamp bắt đầu sớm hơn.
    # Sắp xếp trước khi phát hiện khoảng trống để không nhầm sample đồng thời
    # hoặc lồng nhau với nhiều test run được nối vào cùng file.
    ordered_rows = sorted(rows, key=lambda row: parse_int(row.get("timeStamp")))
    segments: list[list[dict[str, str]]] = [[ordered_rows[0]]]
    previous = parse_int(ordered_rows[0].get("timeStamp"))
    for row in ordered_rows[1:]:
        current = parse_int(row.get("timeStamp"))
        if current - previous > gap_ms:
            segments.append([])
        segments[-1].append(row)
        previous = current
    return segments


def summarize(rows: list[dict[str, str]]) -> dict[str, Any]:
    by_label: dict[str, list[dict[str, str]]] = defaultdict(list)
    failures: Counter[tuple[str, str, str]] = Counter()
    threads: set[str] = set()

    for row in rows:
        label = row.get("label", "") or "<empty>"
        by_label[label].append(row)
        threads.add(row.get("threadName", ""))
        if row.get("success", "").lower() != "true":
            failures[(label, row.get("responseCode", ""), row.get("failureMessage", ""))] += 1

    labels: dict[str, Any] = {}
    for label, samples in sorted(by_label.items()):
        elapsed = [parse_int(row.get("elapsed")) for row in samples]
        timestamps = [parse_int(row.get("timeStamp")) for row in samples]
        ends = [ts + duration for ts, duration in zip(timestamps, elapsed)]
        errors = sum(row.get("success", "").lower() != "true" for row in samples)
        duration_seconds = max(0.001, (max(ends) - min(timestamps)) / 1000.0)
        labels[label] = {
            "samples": len(samples),
            "errors": errors,
            "error_pct": round(errors / len(samples) * 100.0, 4),
            "avg_ms": round(sum(elapsed) / len(elapsed), 3),
            "min_ms": min(elapsed),
            "max_ms": max(elapsed),
            "p90_ms_nearest_rank": percentile_nearest_rank(elapsed, 90),
            "p95_ms_nearest_rank": percentile_nearest_rank(elapsed, 95),
            "p99_ms_nearest_rank": percentile_nearest_rank(elapsed, 99),
            "throughput_rps": round(len(samples) / duration_seconds, 6),
        }

    timestamps = [parse_int(row.get("timeStamp")) for row in rows]
    return {
        "sample_count": len(rows),
        "thread_count": len(threads - {""}),
        "start_ms": min(timestamps) if timestamps else None,
        "end_ms": max(timestamps) if timestamps else None,
        "labels": labels,
        "failures": [
            {"label": key[0], "response_code": key[1], "failure_message": key[2], "count": count}
            for key, count in failures.most_common()
        ],
        "percentile_method": "nearest-rank; JMeter HTML có thể dùng cách ước lượng khác",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("jtl", type=Path, help="File JTL JMeter dạng CSV")
    parser.add_argument("--json-output", type=Path, help="Ghi kết quả tổng hợp ra JSON")
    parser.add_argument("--start-ms", type=int, help="Chỉ lấy sample từ epoch millisecond này")
    parser.add_argument("--end-ms", type=int, help="Chỉ lấy sample đến epoch millisecond này")
    parser.add_argument("--segment-gap-seconds", type=int, default=120, help="Khoảng trống dùng để phát hiện các run có thể tách biệt")
    parser.add_argument("--latest-segment", action="store_true", help="Chỉ phân tích segment cuối được phát hiện")
    args = parser.parse_args()

    if not args.jtl.is_file():
        parser.error(f"Không tìm thấy file JTL: {args.jtl}")

    with args.jtl.open("r", encoding="utf-8-sig", newline="") as stream:
        reader = csv.DictReader(stream)
        required = {"timeStamp", "elapsed", "label", "success"}
        missing = required - set(reader.fieldnames or [])
        if missing:
            parser.error(f"JTL phải là CSV và có các cột: {', '.join(sorted(missing))}")
        rows = [
            row
            for row in reader
            if (args.start_ms is None or parse_int(row.get("timeStamp")) >= args.start_ms)
            and (args.end_ms is None or parse_int(row.get("timeStamp")) <= args.end_ms)
        ]

    segments = segment_rows(rows, args.segment_gap_seconds * 1000)
    selected = segments[-1] if args.latest_segment and segments else rows
    result = summarize(selected)
    result["source"] = str(args.jtl.resolve())
    result["detected_segments"] = [
        {
            "samples": len(segment),
            "start_ms": parse_int(segment[0].get("timeStamp")),
            "end_ms": parse_int(segment[-1].get("timeStamp")),
        }
        for segment in segments
    ]
    result["selected_latest_segment"] = args.latest_segment

    rendered = json.dumps(result, indent=2, ensure_ascii=False)
    print(rendered)
    if args.json_output:
        args.json_output.parent.mkdir(parents=True, exist_ok=True)
        args.json_output.write_text(rendered + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
