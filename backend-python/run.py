import json
from flask import jsonify,request
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from app import create_app
from app.extensions import db
# from app.utils.batchhandelepub import run  # 导入封装的批量处理函数
# 创建 Flask 应用
app = create_app()
# 确保在上下文中执行数据库操作
with app.app_context():
    db.create_all()  # 初始化数据库表

if __name__ == '__main__':
    # 确保 run() 在应用上下文中执行
    # with app.app_context():
    #     run()

    # 启动 Flask 应用
    app.run(debug=True, port=5000)
