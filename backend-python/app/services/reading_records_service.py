import uuid
import os
from datetime import datetime, timezone

from werkzeug.utils import secure_filename
from flask import request, jsonify
from app.models.readingHistroy import ReadingHistory
from app.models.book import Book
from app.extensions import db
import logging
import ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup

from app.models.user import User
from app.utils.payparms import serverUrl
logging.basicConfig(level=logging.DEBUG)


UPLOAD_FOLDER = 'uploads/books'

#添加阅读记录
def add_reading_history():
    data = request.get_json()
    user_id = data.get('userId')
    books = data.get('books')  # 获取书籍及其阅读页数的字典
    reading_device = data.get('readingDevice')
    if not user_id or not books or not reading_device:
        return jsonify({"error": "User ID, Books and Reading Device are required."}), 400
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    user.updated_at = datetime.now(timezone.utc)
    # 处理批量添加阅读历史记录

    for book_id, last_read_page in books.items():
        try:
            book_id = int(book_id)
            last_read_page = int(last_read_page)
        except ValueError:
            return jsonify({"error": f"Invalid book ID or last read page for book {book_id}"}), 400

        # 检查书籍是否存在
        book = Book.query.get(book_id)
        if not book:
            return jsonify({"error": f"Book with ID {book_id} not found"}), 404

        # 创建阅读历史记录
        new_record = ReadingHistory(
            user_id=user_id,
            book_id=book_id,
            reading_device=reading_device,
            last_read_page=last_read_page,
            progress=round((last_read_page / book.total_number), 2) if book.total_number > 0 else 0  # 假设 Book 模型有 total_pages 字段
        )

        db.session.add(new_record)

    db.session.commit()

    # 返回成功消息
    return jsonify({
        "message": "Reading history added successfully.",
        "addedRecords": [
            {
                "userId": user_id,
                "bookId": book_id,
                "readingDevice": reading_device,
                "lastReadPage": last_read_page
            } for book_id, last_read_page in books.items()
        ]
    }), 201

def delete_reading_history():
    user_id = request.json.get('userId')
    book_id = request.json.get('bookId')

    if not user_id or not book_id:
        return jsonify({"error": "User ID and Book ID are required."}), 400

    # Find the record to delete
    record = ReadingHistory.query.filter_by(user_id=user_id, book_id=book_id).first()
    if not record:
        return jsonify({"error": "Reading record not found."}), 404

    # Delete the record
    db.session.delete(record)
    db.session.commit()

    return jsonify({"message": "Reading history deleted successfully."}), 200

def get_reading_history():
    user_id = request.get_json().get('userId')
    print(f"get readinghistory {user_id}")
    if not user_id:
        return jsonify({"error": "User ID is required."}), 400

        # 查询该用户的阅读历史记录，并按 book_id 分组，每组按创建时间降序排序
        # 使用子查询获取每本书的最新记录
    subquery = (
        db.session.query(
            ReadingHistory.book_id,
            db.func.max(ReadingHistory.created_at).label("created_at")
        )
        .filter_by(user_id=user_id)
        .group_by(ReadingHistory.book_id)
        .subquery()
    )

    # 查询最新的记录
    history_records = (
        db.session.query(ReadingHistory)
        .join(subquery,
              (ReadingHistory.book_id == subquery.c.book_id) &
              (ReadingHistory.created_at == subquery.c.created_at))
        .all()
    )

    # 构造返回的阅读历史信息
    reading_history = []
    for record in history_records:
        book = Book.query.get(record.book_id)
        if not book:
            continue  # 如果书籍不存在，跳过该记录

        reading_history.append({
            "id": book.book_id,
            "name": book.title,
            "desc": book.description[:100] + "..." if book.description else "",
            "author": book.author,# Optional: truncate the description
            "url": serverUrl+"/static/"+book.cover_image,
            "category": book.category if book.category else "No category",
            "price": str(book.price) if book.is_paid else "Free",
            "total_pages": book.total_number,  # 总页数# Replace with actual image URL logic if needed
            "free_pages": book.free_pages,  # 免费页数
            # "number": f"{book.free_pages}字",  # Optional: Modify according to your design
            "label": book.is_paid,
            "read": record.last_read_page,  # 使用 last_read_page 作为 read 字段
        })

    return jsonify({"readingHistory": reading_history}), 200