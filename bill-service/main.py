"""
main.py - FastAPI application for the RMS Bill Printing Microservice.

Endpoints:
  GET /bill/v1/generate/{order_id}  - Generate and return a PDF bill for a completed order
  GET /bill/v1/health               - Health check

Rules:
  - Only COMPLETED orders can have a bill generated.
  - An order with a PENDING CustomerDue cannot be billed (bill only after fully paid).
  - This service is internal-network-only (no JWT auth required by design).
  - This service is read-only; it never writes to the database.
"""

import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from sqlalchemy.orm import Session

from db import get_db
from models import Order, OrderItem, Payment, CustomerDue, RestaurantTable
from bill_generator import generate_bill_pdf


# ─────────────────────────────────────────────────────────────
# App Setup
# ─────────────────────────────────────────────────────────────

app = FastAPI(
    title="RMS Bill Service",
    description="Microservice for generating PDF bills for completed restaurant orders.",
    version="1.0.0",
)

# Allow CORS from the frontend domain.
# Since auth is internal-network-only, we allow the frontend origin.
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost,http://localhost:80,http://localhost:3000,http://localhost:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────────────────────

@app.get("/bill/v1/health", tags=["Health"])
def health_check():
    """Health check endpoint for Docker and monitoring."""
    return {"status": "ok", "service": "rms-bill-service"}


@app.get(
    "/bill/v1/generate/{order_id}",
    tags=["Bill"],
    response_class=Response,
    responses={
        200: {
            "content": {"application/pdf": {}},
            "description": "PDF bill generated successfully.",
        },
        403: {"description": "Order is not fully paid or not completed."},
        404: {"description": "Order not found."},
    },
)
def generate_bill(
    order_id: int,
    db: Session = Depends(get_db),
):
    """
    Generate and return a PDF bill for a given order.

    - Returns 404 if the order does not exist.
    - Returns 403 if the order is not COMPLETED.
    - Returns 403 if the order has a PENDING CustomerDue (not fully paid).
    - Returns 200 with application/pdf content on success.
    """

    # ── Fetch the order ──────────────────────────────────────
    order: Order | None = db.query(Order).filter(
        Order.order_id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail=f"Order #{order_id} not found.",
        )

    # ── Guard: must be COMPLETED ─────────────────────────────
    if order.order_status != "COMPLETED":
        raise HTTPException(
            status_code=403,
            detail=(
                f"Bill can only be generated for COMPLETED orders. "
                f"Current status: {order.order_status}."
            ),
        )

    # ── Guard: no PENDING dues ───────────────────────────────
    due: CustomerDue | None = db.query(CustomerDue).filter(
        CustomerDue.order_id == order_id
    ).first()

    if due and due.due_status == "PENDING":
        raise HTTPException(
            status_code=403,
            detail=(
                f"Bill cannot be printed. A due of "
                f"\u20B9{due.due_amount} is still pending for "
                f"customer '{due.customer_name}'."
            ),
        )

    # ── Fetch related data ───────────────────────────────────
    table: RestaurantTable | None = db.query(RestaurantTable).filter(
        RestaurantTable.table_id == order.table_id
    ).first()

    order_items = db.query(OrderItem).filter(
        OrderItem.order_id == order_id
    ).all()

    payments = db.query(Payment).filter(
        Payment.order_id == order_id
    ).all()

    # ── Build order_data dict for bill generator ─────────────
    order_data = {
        "order_id": order.order_id,
        "table_name": table.table_name if table else f"Table {order.table_id}",
        "created_at": order.created_at,
        "total_amount": order.total_amount,
        "discount": order.discount,
        "final_amount": order.final_amount,
        "order_items": [
            {
                "dish_name": (
                    item.dish.dish_name if item.dish else f"Dish #{item.dish_id}"
                ),
                "quantity": item.quantity,
                "price": item.price,
                "total_price": item.total_price,
            }
            for item in order_items
        ],
        "payments": [
            {
                "payment_method": pmt.payment_method,
                "amount_paid": pmt.amount_paid,
                "transaction_id": pmt.transaction_id,
            }
            for pmt in payments
        ],
        "customer_due": (
            {
                "customer_name": due.customer_name,
                "mobile_number": due.mobile_number,
                "total_amount": due.total_amount,
                "paid_amount": due.paid_amount,
                "due_amount": due.due_amount,
                "due_status": due.due_status,
            }
            if due
            else None
        ),
    }

    # ── Generate PDF ─────────────────────────────────────────
    pdf_bytes = generate_bill_pdf(order_data)

    filename = f"bill_order_{order_id}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(pdf_bytes)),
        },
    )
