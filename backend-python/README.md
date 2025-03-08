# Backend-Python
## 使用方法
### 配置运行环境
首先配置局部变量环境
-- pip freeze > requirements.txt --

在根目录下执行：
pip3 install -r requirements.txt

(还没写完)
执行run.py
### 
## 接口文档
## 用户
#### 注册
* URL:```/auth/register```
* Method: ```POST```
* Body:
```
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```
* Return:
```
{
    "message": "User registered successfully"
}
```
### 登录
* URL:```/auth/login```
* Method: ```POST```
* Body:
```
{
  "email": "john@example.com",
  "password": "password123"
}
```
* Return:
```
{
  "access_token": " "
}
```

### 增加余额
* URL: /auth/add_balance
* Method: POST
* Body:
```
{
  "user_id": 1,
  "amount": 50.0
}
```
* Return:
```
{
  "message": "Balance increased by 50.0",
  "new_balance": "50.0"
}
```
Description: 为指定的用户账户增加余额。user_id 指定用户，amount 是增加的金额。返回用户增加后的新余额。
### 扣除余额
* URL: /auth/deduct_balance
* Method: POST
* Body:
```
{
  "user_id": 1,
  "amount": 30.0
}
```
* Return 
```
{
  "message": "Balance deducted by 30.0",
  "new_balance": "20.0"
}
```
### 余额查询
* URL: /auth/get_balance
* Method: GET
* Body:
```
{
  "user_id": 1
}
```
* Return 
```
{
    "balance": "5.00"
}
```

### 充值
* URL: /recharge/add
* Method: POST
* Body:
```
{
  "user_id": 1,
  "amount": 30.0
}
```
* Return 
```
{
    "message": "Order created successfully",
    "recharge_id": 6
}
```

### 查询充值订单
* URL: /recharge/get
* Method: GET
* Body:
```
none
```
* Return 
```
[
    {
        "amount": "10.00",
        "created_at": "2025-01-24T08:01:25.124306",
        "payment_method": "alipay",
        "payment_status": "pending",
        "recharge_id": 1,
        "recharge_time": "2025-01-24T08:01:25.105713",
        "updated_at": "2025-01-24T08:01:25.124313",
        "user_id": 1
    },
    {
        "amount": "10.00",
        "created_at": "2025-01-24T08:46:00.046049",
        "payment_method": "alipay",
        "payment_status": "pending",
        "recharge_id": 2,
        "recharge_time": "2025-01-24T08:46:00.046040",
        "updated_at": "2025-01-24T08:46:00.046051",
        "user_id": 1
    },
    {
        "amount": "10.00",
        "created_at": "2025-01-24T08:46:01.839618",
        "payment_method": "alipay",
        "payment_status": "pending",
        "recharge_id": 3,
        "recharge_time": "2025-01-24T08:46:01.839611",
        "updated_at": "2025-01-24T08:46:01.839620",
        "user_id": 1
    },
    {
        "amount": "10.00",
        "created_at": "2025-01-24T08:46:02.533274",
        "payment_method": "alipay",
        "payment_status": "pending",
        "recharge_id": 4,
        "recharge_time": "2025-01-24T08:46:02.533267",
        "updated_at": "2025-01-24T08:46:02.533276",
        "user_id": 1
    },
    {
        "amount": "10.00",
        "created_at": "2025-01-24T08:46:03.486512",
        "payment_method": "alipay",
        "payment_status": "pending",
        "recharge_id": 5,
        "recharge_time": "2025-01-24T08:46:03.486501",
        "updated_at": "2025-01-24T08:46:03.486515",
        "user_id": 1
    },
    {
        "amount": "17.00",
        "created_at": "2025-01-24T09:10:15.408852",
        "payment_method": "alipay",
        "payment_status": "pending",
        "recharge_id": 6,
        "recharge_time": "2025-01-24T09:10:15.408845",
        "updated_at": "2025-01-24T09:10:15.408854",
        "user_id": 1
    }
]
```


## 书籍相关
### 新增书籍
* URL:```/book/upload```
* Method: ```POST```
* 参考同级目录下的test中的upload.html

### 删除书籍
* URL:```/book/delete/<bookID>```
* Method: ```DELETE```
* Body:
```
（无）
```
* Return:
```
{
  "access_token": " "
}
``` 

### 获取书籍目录
* URL:```/book/contents/<bookID>```
* Method: ```GET```
* Body:
```
（无）
```
* Return:
```
{
  "contents": [
    {
      "title": "Introduction",
      "href": "text/chapter1.html"
    },
    {
      "title": "Chapter 1: The Beginning",
      "href": "text/chapter2.html"
    },
    {
      "title": "Chapter 2: Getting Started",
      "href": "text/chapter3.html"
    },
    {
      "title": "Chapter 3: Advanced Topics",
      "href": "text/chapter4.html"
    },
    {
      "title": "Conclusion",
      "href": "text/conclusion.html"
    }
  ]
}
``` 

### 获取书籍对应页数内容(写法一)
* URL:```/book/read/<bookID>/page/<pageNumber>```
* Method: ```GET```
* Body:
```
（无）
```
* Return:
```
{
    "page_content": "Algorithms\nFourth Edition\nPart I\n\nRobert SedgewickandKevin WaynePrinceton University\n\n\nUpper Saddle River, NJ • Boston • Indianapolis • San FranciscoNew York • Toronto • Montreal • London • Munich • Paris • MadridCapetown • Sydney • Tokyo • Singapore • Mexico City"
}
``` 

#### 购买书籍
* URL:```/book/purchase```
* Method: ```POST```
* Body:
- **请求参数**

|  参数名   | 类型  | 是否必填  |   说明   |
|:------:|:---:|:-----:|:------:|
| user_id | int  |   是   |   用户id   |
| book_id  | int |   是   | 书本id |


* Return（例）:
```
{
    "message": "Payment successful",
    "new_balance": "90.00"
}
```
#### 验证书籍是否已购买
* URL:```/book/books```
* Method: ```GET```
* Body:
- **请求参数**

|  参数名   | 类型  | 是否必填  |   说明   |
|:------:|:---:|:-----:|:------:|
| user_id | int  |   是   |   用户id   |
| book_id  | int |   是   | 书本id |

* Return（例）:
```
{
    "purchased": true
}
```
### 首页
#### 获取书籍列表
* URL:```/book/books```
* Method: ```GET```
* Body:
- **请求参数**

|  参数名   | 类型  | 是否必填  |   说明   |
|:------:|:---:|:-----:|:------:|
| cursor | 未定  |   否   |   游标   |
| count  | int |   是   | 请求书本数量 |
- **返回参数**

|  参数名   |  类型  | 是否必填 |     说明      |
|:------:|:----:|:----:|:-----------:|
| cursor |  未定  |  是   | 下一个count的游标 |
| books  | list |  是   |    书籍列表     |
| count  | int  |  是   |    返回数量     |

* Return（例）:
```
{
    "books": [
        {
            "author": "Y,W",
            "category": "No category",
            "cover_image_url": "uploads/books\\18644194-d0b8-4b37-8c98-72b5644365f8\\QQ20250120-213516.jpg",
            "created_at": "2025-01-22T17:10:17.605115",
            "desc": "人类简史的简介...",
            "free_pages": 10,
            "id": 2,
            "is_paid": false,
            "name": "人类简史",
            "price": "Free",
            "total_pages": 10,
            "updated_at": "2025-01-22T17:10:17.605115"
        },
        {
            "author": "Unknown",
            "category": "No category",
            "cover_image_url": "uploads/books\\4f71c496-d111-42dd-a33c-51439b23c2ac\\cover.jpg",
            "created_at": "2025-01-22T17:12:36.552782",
            "desc": "Algorithm的简介...",
            "free_pages": 0,
            "id": 3,
            "is_paid": false,
            "name": "Algorithm",
            "price": "Free",
            "total_pages": 5,
            "updated_at": "2025-01-22T17:12:36.552782"
        }
    ],
    "count": 2,
    "cursor": 2
}
``` 
### 阅读记录
#### 添加阅读记录
* URL:```/readingrecord/add```
* Method: ```POST```
* Body:
- **请求参数**

|  参数名   | 类型  | 是否必填  |   说明   |
|:------:|:---:|:-----:|:------:|
| userId | int  |   是   |   用户id   |
| bookId  | int |   是   | 所阅读的书本id |
| readingDevice  | string |   是   | 阅读所使用的设备 |
| lastReadPage  | int |   是   | 当前阅读页数 |
- **返回参数**



* Return（例）:
```
{
    "message": "Reading history added successfully.",
    "readingRecord": {
        "author": "me",
        "chapterId": 45,
        "desc": "一本书：人类简史",
        "id": 3,
        "label": false,
        "name": "人类简史",
        "number": "0字",
        "onshelf": false,
        "url": ""
    }
}
``` 

#### 删除阅读记录
* URL:```/readingrecord/delete```
* Method: ```DELETE```
* Body:
- **请求参数**

|  参数名   | 类型  | 是否必填  |   说明   |
|:------:|:---:|:-----:|:------:|
| userId | int  |   是   |   用户id   |
| bookId  | int |   是   | 所阅读的书本id |
- **返回参数**



* Return（例）:
```
{
    "message": "Reading history deleted successfully."
}
``` 

#### 查询阅读记录
* URL:```/readingrecord/get```
* Method: ```GET```
* Body:
- **请求参数**

|  参数名   | 类型  | 是否必填  |   说明   |
|:------:|:---:|:-----:|:------:|
| userId | int  |   是   |   用户id   |
- **返回参数**



* Return（例）:
```
{
    "readingHistory": [
        {
            "author": "me",
            "chapterId": 45,
            "desc": "一本书：人类简史...",
            "id": 3,
            "label": false,
            "name": "人类简史",
            "number": "0字",
            "onshelf": false,
            "url": ""
        },
        {
            "author": "me",
            "chapterId": 45,
            "desc": "dont know...",
            "id": 2,
            "label": false,
            "name": "test1",
            "number": "0字",
            "onshelf": false,
            "url": ""
        }
    ]
}
``` 


#### 将书籍添加到书架
* URL:```/book/shelf/add```
* Method: ```POST```
* Body:
- **请求参数**

|  参数名   | 类型  | 是否必填  |   说明   |
|:------:|:---:|:-----:|:------:|
| userId | int  |   是   |   用户id   |
| bookId  | int |   是   | 所阅读的书本id |
- **返回参数**

* Return（例）:
```
{
    "message": "Book added to shelf successfully",
    "shelf_id": 1
}

``` 

#### 将书籍移除书架
* URL:```/book/shelf/remove```
* Method: ```POST```
* Body:
- **请求参数**

|  参数名   | 类型  | 是否必填  |   说明   |
|:------:|:---:|:-----:|:------:|
| userId | int  |   是   |   用户id   |
| bookId  | int |   是   | 所阅读的书本id |
- **返回参数**

* Return（例）:
```
{
    "message": "Book removed from shelf successfully"
}

``` 

#### 查询用户书籍内容
* URL:```/book/shelf?user_id=1```
* Method: ```GET```
* Body:
- **请求参数**

|  参数名   | 类型  | 是否必填  |   说明   |
|:------:|:---:|:-----:|:------:|
| userId | int  |   是   |   用户id   |
- **返回参数**

* Return（例）:
```
{
    "shelf": [
        {
            "author": "Y,W",
            "book_id": 2,
            "category": "No category",
            "cover_image": "uploads/books\\18644194-d0b8-4b37-8c98-72b5644365f8\\QQ20250120-213516.jpg",
            "price": "10.00",
            "title": "人类简史"
        },
        {
            "author": "Unknown",
            "book_id": 4,
            "category": "No category",
            "cover_image": "uploads/books\\3ab5ef3e-69cc-4ada-a380-910e3967f223\\cover.jpg",
            "price": "Free",
            "title": "Algorithm"
        }
    ]
}

``` 