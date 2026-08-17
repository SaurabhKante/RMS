"""
bill_generator.py - PDF bill generation using ReportLab.
Generates a professional restaurant receipt for a completed, fully-paid order.
"""

import os
from decimal import Decimal
from datetime import datetime
from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.pagesizes import A5
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table,
    TableStyle, HRFlowable,
)
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT

# ─────────────────────────────────────────────────────────────
# Restaurant Branding (read from environment)
# ─────────────────────────────────────────────────────────────
RESTAURANT_NAME = os.getenv("RESTAURANT_NAME", "Hotelix-RMS")
RESTAURANT_ADDRESS = os.getenv(
    "RESTAURANT_ADDRESS",
    "123, MG Road, Pune - 411001, Maharashtra, India"
)
RESTAURANT_PHONE = os.getenv("RESTAURANT_PHONE", "+91 98765 43210")
RESTAURANT_GST = os.getenv("RESTAURANT_GST", "27AABCU9603R1ZX")  # Dummy GST

# ─────────────────────────────────────────────────────────────
# Color Palette
# ─────────────────────────────────────────────────────────────
TEAL_DARK = colors.HexColor("#0F4C4C")
TEAL_MED = colors.HexColor("#0D7377")
TEAL_LIGHT = colors.HexColor("#E8F5F5")
GRAY_TEXT = colors.HexColor("#555555")
GRAY_LIGHT = colors.HexColor("#F5F5F5")
BLACK = colors.black
WHITE = colors.white
RED_DUE = colors.HexColor("#CC3333")


def _fmt_currency(value) -> str:
    """Format a Decimal/float as Indian Rupee string."""
    try:
        num = float(value or 0)
    except (TypeError, ValueError):
        num = 0.0
    return f"\u20B9 {num:,.2f}"


def _fmt_date(dt: datetime | None) -> str:
    """Format datetime to readable string."""
    if not dt:
        return "—"
    return dt.strftime("%d %b %Y, %I:%M %p")


def generate_bill_pdf(order_data: dict) -> bytes:
    """
    Generate a PDF bill for the given order data and return as bytes.

    Args:
        order_data: Dictionary containing all order details fetched from DB.

    Returns:
        PDF content as bytes.
    """
    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A5,
        rightMargin=12 * mm,
        leftMargin=12 * mm,
        topMargin=10 * mm,
        bottomMargin=10 * mm,
        title=f"Bill - Order #{order_data['order_id']}",
        author=RESTAURANT_NAME,
    )

    styles = getSampleStyleSheet()
    story = []

    # ─── Custom Styles ─────────────────────────────────────
    restaurant_name_style = ParagraphStyle(
        "RestaurantName",
        parent=styles["Normal"],
        fontSize=20,
        leading=26,
        fontName="Helvetica-Bold",
        textColor=TEAL_DARK,
        alignment=TA_CENTER,
        spaceAfter=6,
    )
    subtitle_style = ParagraphStyle(
        "Subtitle",
        parent=styles["Normal"],
        fontSize=8,
        fontName="Helvetica",
        textColor=GRAY_TEXT,
        alignment=TA_CENTER,
        spaceAfter=1,
    )
    section_header_style = ParagraphStyle(
        "SectionHeader",
        parent=styles["Normal"],
        fontSize=9,
        fontName="Helvetica-Bold",
        textColor=TEAL_DARK,
        spaceAfter=4,
        spaceBefore=6,
    )
    meta_label_style = ParagraphStyle(
        "MetaLabel",
        parent=styles["Normal"],
        fontSize=7.5,
        fontName="Helvetica",
        textColor=GRAY_TEXT,
    )
    meta_value_style = ParagraphStyle(
        "MetaValue",
        parent=styles["Normal"],
        fontSize=7.5,
        fontName="Helvetica-Bold",
        textColor=BLACK,
        alignment=TA_RIGHT,
    )
    footer_style = ParagraphStyle(
        "Footer",
        parent=styles["Normal"],
        fontSize=8,
        fontName="Helvetica-Oblique",
        textColor=GRAY_TEXT,
        alignment=TA_CENTER,
        spaceBefore=6,
    )
    gst_style = ParagraphStyle(
        "Gst",
        parent=styles["Normal"],
        fontSize=7,
        fontName="Helvetica",
        textColor=GRAY_TEXT,
        alignment=TA_CENTER,
    )

    # ─── HEADER: Restaurant Branding ────────────────────────
    story.append(Paragraph(RESTAURANT_NAME, restaurant_name_style))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(RESTAURANT_ADDRESS, subtitle_style))
    story.append(Paragraph(f"Phone: {RESTAURANT_PHONE}", subtitle_style))
    story.append(Paragraph(f"GSTIN: {RESTAURANT_GST}", gst_style))
    story.append(Spacer(1, 3 * mm))
    story.append(HRFlowable(width="100%", thickness=1.5, color=TEAL_DARK))
    story.append(Spacer(1, 2 * mm))

    # ─── TAX INVOICE Label ──────────────────────────────────
    invoice_label = ParagraphStyle(
        "InvoiceLabel",
        parent=styles["Normal"],
        fontSize=11,
        fontName="Helvetica-Bold",
        textColor=WHITE,
        alignment=TA_CENTER,
        backColor=TEAL_DARK,
        borderPad=4,
        spaceAfter=4,
    )
    story.append(Paragraph("&nbsp;&nbsp; TAX INVOICE &nbsp;&nbsp;", invoice_label))
    story.append(Spacer(1, 3 * mm))

    # ─── ORDER META INFO ────────────────────────────────────
    table_name = order_data.get("table_name", "—")
    order_id = order_data.get("order_id", "—")
    created_at = order_data.get("created_at")

    meta_data = [
        ["Order #", str(order_id)],
        ["Table", table_name],
        ["Date & Time", _fmt_date(created_at)],
    ]

    # Due info if present
    due = order_data.get("customer_due")
    if due and due.get("customer_name"):
        meta_data.append(["Customer", due["customer_name"]])
        if due.get("mobile_number"):
            meta_data.append(["Mobile", due["mobile_number"]])

    meta_table = Table(
        meta_data,
        colWidths=["45%", "55%"],
        hAlign="LEFT",
    )
    meta_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), "Helvetica"),
        ("FONTNAME", (1, 0), (1, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("TEXTCOLOR", (0, 0), (0, -1), GRAY_TEXT),
        ("TEXTCOLOR", (1, 0), (1, -1), BLACK),
        ("ALIGN", (1, 0), (1, -1), "RIGHT"),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 3 * mm))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CCCCCC")))

    # ─── ORDER ITEMS TABLE ──────────────────────────────────
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph("Order Items", section_header_style))

    items = order_data.get("order_items", [])
    item_header = [
        Paragraph("<b>Item</b>", ParagraphStyle("th", fontSize=8, fontName="Helvetica-Bold", textColor=WHITE)),
        Paragraph("<b>Qty</b>", ParagraphStyle("th", fontSize=8, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER)),
        Paragraph("<b>Price</b>", ParagraphStyle("th", fontSize=8, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_RIGHT)),
        Paragraph("<b>Total</b>", ParagraphStyle("th", fontSize=8, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_RIGHT)),
    ]

    item_rows = [item_header]
    for item in items:
        row = [
            Paragraph(item.get("dish_name", "—"), ParagraphStyle("td", fontSize=8, fontName="Helvetica")),
            Paragraph(str(item.get("quantity", 0)), ParagraphStyle("td", fontSize=8, fontName="Helvetica", alignment=TA_CENTER)),
            Paragraph(_fmt_currency(item.get("price", 0)), ParagraphStyle("td", fontSize=8, fontName="Helvetica", alignment=TA_RIGHT)),
            Paragraph(_fmt_currency(item.get("total_price", 0)), ParagraphStyle("td", fontSize=8, fontName="Helvetica-Bold", alignment=TA_RIGHT)),
        ]
        item_rows.append(row)

    items_table = Table(
        item_rows,
        colWidths=["45%", "13%", "20%", "22%"],
        hAlign="LEFT",
        repeatRows=1,
    )
    items_table.setStyle(TableStyle([
        # Header row
        ("BACKGROUND", (0, 0), (-1, 0), TEAL_MED),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),

        # Alternating rows
        ("BACKGROUND", (0, 1), (-1, -1), WHITE),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, GRAY_LIGHT]),

        # Grid
        ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#DDDDDD")),
        ("LINEBELOW", (0, 0), (-1, 0), 1, TEAL_DARK),

        # Padding
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(items_table)
    story.append(Spacer(1, 3 * mm))

    # ─── AMOUNT SUMMARY ─────────────────────────────────────
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CCCCCC")))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph("Amount Summary", section_header_style))

    total_amount = order_data.get("total_amount", Decimal("0"))
    discount = order_data.get("discount", Decimal("0"))
    final_amount = order_data.get("final_amount", Decimal("0"))

    summary_rows = [
        ["Subtotal", _fmt_currency(total_amount)],
        [f"Discount", f"- {_fmt_currency(discount)}"],
        ["", ""],  # Spacer row
        ["TOTAL PAYABLE", _fmt_currency(final_amount)],
    ]

    summary_table = Table(
        summary_rows,
        colWidths=["60%", "40%"],
        hAlign="RIGHT",
    )
    summary_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, -2), "Helvetica"),
        ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -2), 8),
        ("FONTSIZE", (0, -1), (-1, -1), 10),
        ("TEXTCOLOR", (0, 0), (0, -2), GRAY_TEXT),
        ("TEXTCOLOR", (0, -1), (-1, -1), TEAL_DARK),
        ("ALIGN", (1, 0), (1, -1), "RIGHT"),
        ("ALIGN", (0, 0), (0, -1), "LEFT"),
        ("LINEABOVE", (0, -1), (-1, -1), 1, TEAL_DARK),
        ("TOPPADDING", (0, -1), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
        ("TOPPADDING", (0, 0), (-1, -2), 2),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 3 * mm))

    # ─── PAYMENT BREAKDOWN ──────────────────────────────────
    payments = [p for p in order_data.get("payments", []) if p.get("payment_method") != "DUE"]

    if payments:
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CCCCCC")))
        story.append(Spacer(1, 2 * mm))
        story.append(Paragraph("Payment Breakdown", section_header_style))

        for pmt in payments:
            method = pmt.get("payment_method", "—")
            amount = _fmt_currency(pmt.get("amount_paid", 0))
            txn = pmt.get("transaction_id")

            pmt_data = [[method, amount]]
            pmt_table = Table(pmt_data, colWidths=["60%", "40%"])
            pmt_table.setStyle(TableStyle([
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("TEXTCOLOR", (0, 0), (0, -1), GRAY_TEXT),
                ("TEXTCOLOR", (1, 0), (1, -1), BLACK),
                ("ALIGN", (1, 0), (1, -1), "RIGHT"),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
                ("TOPPADDING", (0, 0), (-1, -1), 2),
            ]))
            story.append(pmt_table)

            if txn:
                story.append(
                    Paragraph(
                        f"&nbsp;&nbsp;&nbsp;&nbsp;Txn ID: {txn}",
                        ParagraphStyle("txn", fontSize=6.5, textColor=GRAY_TEXT, fontName="Helvetica-Oblique"),
                    )
                )

    # ─── DUE INFO (if any) ─────────────────────────────────
    if due and due.get("due_amount") and float(due.get("due_amount", 0)) > 0:
        story.append(Spacer(1, 2 * mm))
        due_info = Paragraph(
            f"⚠ Due Amount: {_fmt_currency(due['due_amount'])} "
            f"(Customer: {due.get('customer_name', '—')})",
            ParagraphStyle(
                "DueWarning", fontSize=8, fontName="Helvetica-Bold",
                textColor=RED_DUE, alignment=TA_CENTER,
            ),
        )
        story.append(due_info)

    # ─── FOOTER ─────────────────────────────────────────────
    story.append(Spacer(1, 4 * mm))
    story.append(HRFlowable(width="100%", thickness=1, color=TEAL_DARK))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph("Thank you for dining with us!", footer_style))
    story.append(Paragraph(
        f"Generated on {datetime.now().strftime('%d %b %Y, %I:%M %p')}",
        ParagraphStyle("gentime", fontSize=6.5, textColor=GRAY_TEXT, alignment=TA_CENTER),
    ))

    # ─── BUILD PDF ──────────────────────────────────────────
    doc.build(story)
    return buffer.getvalue()
