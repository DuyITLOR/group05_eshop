"""Render the HW04 Markdown deliverables to readable A4 PDF files.

This renderer is intentionally dependency-light and uses ReportLab already
available in the coursework environment. It does not execute tests or alter
automation evidence.
"""

from __future__ import annotations

import html
import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable,
    LongTable,
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "pdf"

DOCUMENTS = (
    (
        ROOT / "docs" / "report" / "HW04_MAIN_REPORT.md",
        OUTPUT_DIR / "23127107_HW04_Main_Report.pdf",
        "HW04 Automation Testing - Main Report",
    ),
    (
        ROOT / "docs" / "ai-critique" / "AI_CRITIQUE.md",
        OUTPUT_DIR / "23127107_HW04_AI_Critique.pdf",
        "HW04 Automation Testing - AI Critique",
    ),
    (
        ROOT / "docs" / "ai-audit" / "AI_AUDIT_LOG.md",
        OUTPUT_DIR / "23127107_HW04_AI_Audit_Report.pdf",
        "HW04 Automation Testing - AI Audit Report",
    ),
)


def register_fonts() -> tuple[str, str, str]:
    fonts = Path("C:/Windows/Fonts")
    regular = fonts / "arial.ttf"
    bold = fonts / "arialbd.ttf"
    mono = fonts / "consola.ttf"
    if not (regular.exists() and bold.exists() and mono.exists()):
        raise FileNotFoundError("Required Unicode fonts were not found in C:/Windows/Fonts")
    pdfmetrics.registerFont(TTFont("HW04Sans", str(regular)))
    pdfmetrics.registerFont(TTFont("HW04Sans-Bold", str(bold)))
    pdfmetrics.registerFont(TTFont("HW04Mono", str(mono)))
    return "HW04Sans", "HW04Sans-Bold", "HW04Mono"


FONT, FONT_BOLD, FONT_MONO = register_fonts()


def sanitize(text: str) -> str:
    return (
        text.replace("\u2010", "-")
        .replace("\u2011", "-")
        .replace("\u2012", "-")
        .replace("\u2013", "-")
        .replace("\u2014", "-")
        .replace("\u2192", "->")
        .replace("\u00a0", " ")
    )


def inline_markup(text: str) -> str:
    escaped = html.escape(sanitize(text.strip()))
    escaped = re.sub(
        r"\[([^\]]+)\]\(([^)]+)\)",
        r'<link href="\2" color="#1557a0"><u>\1</u></link>',
        escaped,
    )
    escaped = re.sub(r"`([^`]+)`", rf'<font name="{FONT_MONO}">\1</font>', escaped)
    escaped = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", escaped)
    escaped = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", escaped)
    return escaped


def build_styles():
    styles = getSampleStyleSheet()
    body = ParagraphStyle(
        "HW04Body",
        parent=styles["BodyText"],
        fontName=FONT,
        fontSize=9.2,
        leading=13,
        spaceAfter=5,
        textColor=colors.HexColor("#202124"),
        allowWidows=0,
        allowOrphans=0,
    )
    return {
        "body": body,
        "h1": ParagraphStyle(
            "HW04H1",
            parent=body,
            fontName=FONT_BOLD,
            fontSize=19,
            leading=24,
            textColor=colors.HexColor("#153a5b"),
            alignment=TA_CENTER,
            spaceAfter=14,
            keepWithNext=True,
        ),
        "h2": ParagraphStyle(
            "HW04H2",
            parent=body,
            fontName=FONT_BOLD,
            fontSize=14,
            leading=18,
            textColor=colors.HexColor("#153a5b"),
            spaceBefore=10,
            spaceAfter=6,
            keepWithNext=True,
        ),
        "h3": ParagraphStyle(
            "HW04H3",
            parent=body,
            fontName=FONT_BOLD,
            fontSize=11.5,
            leading=15,
            textColor=colors.HexColor("#265f87"),
            spaceBefore=8,
            spaceAfter=4,
            keepWithNext=True,
        ),
        "h4": ParagraphStyle(
            "HW04H4",
            parent=body,
            fontName=FONT_BOLD,
            fontSize=10,
            leading=13,
            spaceBefore=6,
            spaceAfter=3,
            keepWithNext=True,
        ),
        "bullet": ParagraphStyle(
            "HW04Bullet",
            parent=body,
            leftIndent=12,
            firstLineIndent=-8,
            bulletIndent=2,
            spaceAfter=3,
        ),
        "quote": ParagraphStyle(
            "HW04Quote",
            parent=body,
            leftIndent=12,
            rightIndent=8,
            borderColor=colors.HexColor("#94a3b8"),
            borderWidth=0.7,
            borderPadding=6,
            backColor=colors.HexColor("#f8fafc"),
        ),
        "code": ParagraphStyle(
            "HW04Code",
            parent=body,
            fontName=FONT_MONO,
            fontSize=7.5,
            leading=10,
            leftIndent=6,
            rightIndent=6,
            borderColor=colors.HexColor("#cbd5e1"),
            borderWidth=0.5,
            borderPadding=6,
            backColor=colors.HexColor("#f8fafc"),
        ),
        "table_header": ParagraphStyle(
            "HW04TableHeader",
            parent=body,
            fontName=FONT_BOLD,
            fontSize=7.5,
            leading=9.5,
            textColor=colors.white,
        ),
        "table_cell": ParagraphStyle(
            "HW04TableCell",
            parent=body,
            fontSize=7.2,
            leading=9.2,
            spaceAfter=0,
        ),
    }


STYLES = build_styles()


def is_separator_row(cells: list[str]) -> bool:
    return bool(cells) and all(re.fullmatch(r":?-{3,}:?", cell.strip()) for cell in cells)


def parse_table(lines: list[str], available_width: float):
    rows: list[list[str]] = []
    for line in lines:
        stripped = line.strip().strip("|")
        rows.append([cell.strip() for cell in stripped.split("|")])
    rows = [row for row in rows if not is_separator_row(row)]
    if not rows:
        return Spacer(1, 1)

    column_count = max(len(row) for row in rows)
    normalized = [row + [""] * (column_count - len(row)) for row in rows]
    rendered = []
    for row_index, row in enumerate(normalized):
        style = STYLES["table_header"] if row_index == 0 else STYLES["table_cell"]
        rendered.append([Paragraph(inline_markup(cell), style) for cell in row])

    weights = []
    for column_index in range(column_count):
        max_length = max(len(row[column_index]) for row in normalized)
        weights.append(max(8, min(max_length, 42)))
    total_weight = sum(weights)
    widths = [available_width * weight / total_weight for weight in weights]

    table = LongTable(rendered, colWidths=widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#153a5b")),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#aeb8c2")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f7f9fb")]),
            ]
        )
    )
    return table


def markdown_to_story(markdown: str, available_width: float):
    lines = markdown.replace("\r\n", "\n").split("\n")
    story = []
    paragraph_buffer: list[str] = []
    code_buffer: list[str] = []
    in_code = False
    index = 0

    def flush_paragraph():
        if paragraph_buffer:
            text = " ".join(part.strip() for part in paragraph_buffer).strip()
            if text:
                story.append(Paragraph(inline_markup(text), STYLES["body"]))
            paragraph_buffer.clear()

    while index < len(lines):
        line = lines[index]
        stripped = line.strip()

        if stripped.startswith("```"):
            flush_paragraph()
            if in_code:
                story.append(Preformatted(sanitize("\n".join(code_buffer)), STYLES["code"]))
                code_buffer.clear()
                in_code = False
            else:
                in_code = True
            index += 1
            continue

        if in_code:
            code_buffer.append(line)
            index += 1
            continue

        if stripped.startswith("|") and stripped.endswith("|"):
            flush_paragraph()
            table_lines = []
            while index < len(lines):
                candidate = lines[index].strip()
                if not (candidate.startswith("|") and candidate.endswith("|")):
                    break
                table_lines.append(lines[index])
                index += 1
            story.append(parse_table(table_lines, available_width))
            story.append(Spacer(1, 6))
            continue

        heading = re.match(r"^(#{1,4})\s+(.+)$", stripped)
        if heading:
            flush_paragraph()
            level = len(heading.group(1))
            if level == 1 and story:
                story.append(PageBreak())
            story.append(Paragraph(inline_markup(heading.group(2)), STYLES[f"h{level}"]))
            index += 1
            continue

        if re.fullmatch(r"-{3,}", stripped):
            flush_paragraph()
            story.append(Spacer(1, 3))
            story.append(HRFlowable(width="100%", thickness=0.6, color=colors.HexColor("#94a3b8")))
            story.append(Spacer(1, 5))
            index += 1
            continue

        bullet = re.match(r"^[-*]\s+(.+)$", stripped)
        numbered = re.match(r"^(\d+)\.\s+(.+)$", stripped)
        if bullet or numbered:
            flush_paragraph()
            if bullet:
                prefix, text = "•", bullet.group(1)
            else:
                prefix, text = f"{numbered.group(1)}.", numbered.group(2)
            story.append(Paragraph(f"{prefix} {inline_markup(text)}", STYLES["bullet"]))
            index += 1
            continue

        if stripped.startswith(">"):
            flush_paragraph()
            story.append(Paragraph(inline_markup(stripped.lstrip("> ")), STYLES["quote"]))
            index += 1
            continue

        if not stripped:
            flush_paragraph()
            index += 1
            continue

        paragraph_buffer.append(stripped)
        index += 1

    flush_paragraph()
    if code_buffer:
        story.append(Preformatted(sanitize("\n".join(code_buffer)), STYLES["code"]))
    return story


def make_page_callback(title: str):
    def draw_page(canvas, doc):
        canvas.saveState()
        width, height = A4
        canvas.setFont(FONT, 7.5)
        canvas.setFillColor(colors.HexColor("#5f6b76"))
        canvas.drawString(doc.leftMargin, height - 11 * mm, sanitize(title))
        canvas.drawRightString(width - doc.rightMargin, 10 * mm, f"Page {doc.page}")
        canvas.setStrokeColor(colors.HexColor("#d6dce2"))
        canvas.setLineWidth(0.4)
        canvas.line(doc.leftMargin, height - 13 * mm, width - doc.rightMargin, height - 13 * mm)
        canvas.restoreState()

    return draw_page


def render(source: Path, destination: Path, title: str) -> None:
    if not source.exists():
        raise FileNotFoundError(source)
    destination.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(destination),
        pagesize=A4,
        rightMargin=16 * mm,
        leftMargin=16 * mm,
        topMargin=19 * mm,
        bottomMargin=16 * mm,
        title=title,
        author="Student 23127107 - AI-assisted draft pending student review",
        subject="HW04 Automation Testing submission artifact",
    )
    story = markdown_to_story(source.read_text(encoding="utf-8"), doc.width)
    callback = make_page_callback(title)
    doc.build(story, onFirstPage=callback, onLaterPages=callback)
    print(f"Rendered {source.relative_to(ROOT)} -> {destination.relative_to(ROOT)}")


def main() -> None:
    for source, destination, title in DOCUMENTS:
        render(source, destination, title)


if __name__ == "__main__":
    main()
