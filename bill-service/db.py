"""
db.py - SQLAlchemy database connection for the RMS Bill Service.
Connects to the shared MySQL database used by the Spring Boot backend.
Read-only access — this service never writes to the DB.
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# Load .env file for local development.
# In Docker, env vars are injected via compose.yaml and this is a no-op.
load_dotenv()

MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "rms")
MYSQL_USERNAME = os.getenv("MYSQL_USERNAME", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_ROOT_PASSWORD", "123456")

DATABASE_URL = (
    f"mysql+pymysql://{MYSQL_USERNAME}:{MYSQL_PASSWORD}"
    f"@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"
    f"?charset=utf8mb4"
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,       # Detect stale connections
    pool_recycle=300,         # Recycle connections every 5 minutes
    echo=False,               # Set to True for SQL query logging
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


class Base(DeclarativeBase):
    pass


def get_db():
    """FastAPI dependency that provides a DB session and ensures cleanup."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
