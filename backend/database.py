import logging
import os
import pymysql
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from backend.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()

def ensure_mysql_database_exists():
    """Ensure the MySQL database specified in settings exists on the server."""
    try:
        conn = pymysql.connect(
            host=settings.MYSQL_HOST,
            port=settings.MYSQL_PORT,
            user=settings.MYSQL_USER,
            password=settings.MYSQL_PASSWORD,
            autocommit=True
        )
        with conn.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{settings.MYSQL_DB}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        conn.close()
        logger.info(f"Verified MySQL database `{settings.MYSQL_DB}` exists.")
    except Exception as e:
        logger.error(f"Error ensuring MySQL database exists: {e}")

def get_mysql_engine(user=settings.MYSQL_USER, password=settings.MYSQL_PASSWORD, host=settings.MYSQL_HOST, port=settings.MYSQL_PORT, db=settings.MYSQL_DB):
    ensure_mysql_database_exists()
    
    if password:
        mysql_url = f"mysql+pymysql://{user}:{password}@{host}:{port}/{db}?charset=utf8mb4"
    else:
        mysql_url = f"mysql+pymysql://{user}@{host}:{port}/{db}?charset=utf8mb4"
        
    engine = create_engine(mysql_url, pool_pre_ping=True, pool_recycle=3600)
    return engine

engine = get_mysql_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
