"""
models.py - Read-only SQLAlchemy ORM models mirroring the Spring Boot JPA entities.
These models map to the existing tables in the shared RMS MySQL database.
This service NEVER writes to the database.
"""

from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from sqlalchemy import (
    Column, Integer, String, Numeric, Enum,
    ForeignKey, DateTime, Text,
)
from sqlalchemy.orm import relationship, Mapped, mapped_column

from db import Base


class RestaurantTable(Base):
    __tablename__ = "restaurant_tables"

    table_id: Mapped[int] = mapped_column(
        "table_id", Integer, primary_key=True
    )
    table_name: Mapped[str] = mapped_column("table_name", String(100))
    seat_capacity: Mapped[int] = mapped_column("seat_capacity", Integer)

    orders: Mapped[List["Order"]] = relationship(
        "Order", back_populates="restaurant_table", lazy="select"
    )


class Dish(Base):
    __tablename__ = "dishes"

    dish_id: Mapped[int] = mapped_column(
        "dish_id", Integer, primary_key=True
    )
    dish_name: Mapped[str] = mapped_column("dish_name", String(200))
    price: Mapped[Optional[Decimal]] = mapped_column(
        "price", Numeric(10, 2), nullable=True
    )
    description: Mapped[Optional[str]] = mapped_column(
        "description", Text, nullable=True
    )

    order_items: Mapped[List["OrderItem"]] = relationship(
        "OrderItem", back_populates="dish", lazy="select"
    )


class Order(Base):
    __tablename__ = "orders"

    order_id: Mapped[int] = mapped_column(
        "order_id", Integer, primary_key=True
    )
    table_id: Mapped[int] = mapped_column(
        "table_id", Integer, ForeignKey("restaurant_tables.table_id"), nullable=False
    )
    user_id: Mapped[int] = mapped_column(
        "user_id", Integer, ForeignKey("users.user_id"), nullable=False
    )
    total_amount: Mapped[Decimal] = mapped_column(
        "total_amount", Numeric(10, 2), nullable=False
    )
    discount: Mapped[Optional[Decimal]] = mapped_column(
        "discount", Numeric(10, 2), nullable=True, default=Decimal("0.00")
    )
    final_amount: Mapped[Decimal] = mapped_column(
        "final_amount", Numeric(10, 2), nullable=False
    )
    order_status: Mapped[str] = mapped_column(
        "order_status", String(20), nullable=False
    )
    instruction: Mapped[Optional[str]] = mapped_column(
        "instruction", Text, nullable=True
    )
    created_at: Mapped[Optional[datetime]] = mapped_column(
        "created_at", DateTime, nullable=True
    )

    # Relationships
    restaurant_table: Mapped["RestaurantTable"] = relationship(
        "RestaurantTable", back_populates="orders", lazy="select"
    )
    order_items: Mapped[List["OrderItem"]] = relationship(
        "OrderItem", back_populates="order", lazy="select"
    )
    payments: Mapped[List["Payment"]] = relationship(
        "Payment", back_populates="order", lazy="select"
    )
    customer_due: Mapped[Optional["CustomerDue"]] = relationship(
        "CustomerDue", back_populates="order", uselist=False, lazy="select"
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    order_item_id: Mapped[int] = mapped_column(
        "order_item_id", Integer, primary_key=True
    )
    order_id: Mapped[int] = mapped_column(
        "order_id", Integer, ForeignKey("orders.order_id"), nullable=False
    )
    dish_id: Mapped[int] = mapped_column(
        "dish_id", Integer, ForeignKey("dishes.dish_id"), nullable=False
    )
    quantity: Mapped[int] = mapped_column("quantity", Integer, nullable=False)
    price: Mapped[Decimal] = mapped_column(
        "price", Numeric(10, 2), nullable=False
    )
    total_price: Mapped[Decimal] = mapped_column(
        "total_price", Numeric(10, 2), nullable=False
    )

    order: Mapped["Order"] = relationship(
        "Order", back_populates="order_items", lazy="select"
    )
    dish: Mapped["Dish"] = relationship(
        "Dish", back_populates="order_items", lazy="select"
    )


class Payment(Base):
    __tablename__ = "payments"

    payment_id: Mapped[int] = mapped_column(
        "payment_id", Integer, primary_key=True
    )
    order_id: Mapped[int] = mapped_column(
        "order_id", Integer, ForeignKey("orders.order_id"), nullable=False
    )
    payment_method: Mapped[str] = mapped_column(
        "payment_method", String(50), nullable=False
    )
    amount_paid: Mapped[Decimal] = mapped_column(
        "amount_paid", Numeric(10, 2), nullable=False
    )
    transaction_id: Mapped[Optional[str]] = mapped_column(
        "transaction_id", String(255), nullable=True
    )

    order: Mapped["Order"] = relationship(
        "Order", back_populates="payments", lazy="select"
    )


class CustomerDue(Base):
    __tablename__ = "customer_dues"

    due_id: Mapped[int] = mapped_column(
        "due_id", Integer, primary_key=True
    )
    order_id: Mapped[int] = mapped_column(
        "order_id", Integer, ForeignKey("orders.order_id"), nullable=False
    )
    customer_name: Mapped[str] = mapped_column(
        "customer_name", String(255), nullable=False
    )
    mobile_number: Mapped[str] = mapped_column(
        "mobile_number", String(15), nullable=False
    )
    total_amount: Mapped[Decimal] = mapped_column(
        "total_amount", Numeric(10, 2), nullable=False
    )
    paid_amount: Mapped[Optional[Decimal]] = mapped_column(
        "paid_amount", Numeric(10, 2), nullable=True, default=Decimal("0.00")
    )
    due_amount: Mapped[Optional[Decimal]] = mapped_column(
        "due_amount", Numeric(10, 2), nullable=True
    )
    due_status: Mapped[str] = mapped_column(
        "due_status", String(20), nullable=False
    )

    order: Mapped["Order"] = relationship(
        "Order", back_populates="customer_due", lazy="select"
    )


class User(Base):
    """Minimal mapping - needed for FK reference in Order only."""
    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(
        "user_id", Integer, primary_key=True
    )
    full_name: Mapped[str] = mapped_column("full_name", String(255))
