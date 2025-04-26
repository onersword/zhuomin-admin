# API 文档

## 认证

除了登录接口外，所有 API 请求都需要在请求头中包含 Bearer Token：

```
Authorization: Bearer <token>
```

### 登录

```
POST /api/login
```

请求体:

```json
{
  "username": "管理员用户名",
  "password": "管理员密码"
}
```

响应:

```json
{
  "token": "JWT 令牌"
}
```

## 用户接口

### 获取用户列表

```
GET /api/users?status=2
```

响应:

```json
[
  {
    "id": "用户 ID",
    "fid": "档案号",
    "name": "用户姓名",
    "phoneNumber": "手机号码",
    "wechatId": "微信 ID",
    "status": 0,
    "createdAt": "创建时间",
    "updatedAt": "更新时间"
  }
]
```

## 用户相关资源

### 获取用户

```
GET /api/users/{userId}
```

响应:

```json
{
  "id": "用户 ID",
  "fid": "档案号",
  "name": "用户姓名",
  "phoneNumber": "手机号码",
  "wechatId": "微信 ID",
  "status": 0,
  "createdAt": "创建时间",
  "updatedAt": "更新时间"
}
```

### 删除用户

```
DELETE /api/users/{userId}
```

### 更新用户状态

```
PATCH /api/users/{userId}
```

请求体:

```json
{
  "status": 2 // 2-审核通过
}
```

### 获取用户报告

```
GET /api/users/{userId}/files
```

响应:

```json
[
  {
    "id": "文件 ID",
    "userId": "用户 ID",
    "name": "文件名称",
    "url": "文件 URL",
    "createdAt": "创建时间",
    "updatedAt": "更新时间"
  }
]
```

### 上传用户报告

```
POST /api/users/{userId}/files
```

请求体:

```json
{
  "file": "文件"
}
```

例子

```
curl --location 'http://localhost:3000/api/users/7b9997a2-cbfe-4ea5-9403-fa8d55c123d4/files' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNzQ0NTE0NzYyfQ.8EK6xObqI7y9vHrOrdxptO46DRS8m5OmtGA6UvjBvMU' \
--form 'file=@"/Users/pp/Downloads/体检报告20240212.pdf"'
```

响应:

```json
{
  "id":"df9453a7-7f96-44c5-96c7-57a8a88ff380",
  "userId":"7b9997a2-cbfe-4ea5-9403-fa8d55c123d4",
  "name":"体检报告20240212.pdf",
  "url":"https://7072-prod-8gvh8k8d1aeb0797-1345362468.tcb.qcloud.la/files/体检报告20240212.pdf",
  "createdAt":"2025-04-09T14:27:56.000Z",
  "updatedAt":"2025-04-11T10:56:45.000Z"
}
```

### 删除用户报告

```
DELETE /api/files/{fileId}
```

### 获取用户提醒

```
GET /api/users/{userId}/reminders
```

响应:

```json
[
  {
    "id": "提醒 ID",
    "userId": "用户 ID",
    "title": "提醒标题",
    "description": "提醒描述",
    "remindAt": "提醒时间",
    "createdAt": "创建时间",
    "updatedAt": "更新时间"
  }
]
```

### 添加用户提醒

```
POST /api/users/{userId}/reminders
```

请求体:

```json
{
  "title": "提醒标题",
  "description": "提醒描述",
  "remindAt": "提醒时间"
}
```

### 删除用户提醒

```
DELETE /api/reminders/{reminderId}
```

### 获取用户小结

```
GET /api/users/{userId}/notes
```

响应:

```json
[
  {
    "id": "笔记 ID",
    "userId": "用户 ID",
    "content": "笔记内容",
    "createdAt": "创建时间",
    "updatedAt": "更新时间"
  }
]
```

### 删除用户小结

```
DELETE /api/notes/{noteId}
```

### 添加用户小结

```
POST /api/users/{userId}/notes
```

请求体:

```json
{
  "content": "小结内容"
}
```

### 更新用户小结

```
PATCH /api/users/{userId}/notes/{noteId}
```

请求体:

```json
{
  "content": "小结内容"
}
```

### 获取用户产品

```
GET /api/users/{userId}/products
```

响应:

```json
[
  {
    "id": "产品 ID",
    "name": "产品名称",
    "description": "产品描述",
    "price": 1000,
    "unit": "次",
    "type": 0,
    "createdAt": "创建时间",
    "updatedAt": "更新时间"
  }
]
```

### 添加用户产品

```
POST /api/users/{userId}/products
```

请求体:

```json
{
  "productId": "产品 ID"
}
```

## 图片接口

### 上传图片

例子

```
curl --location 'http://localhost:3000/api/images' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNzQ0NTE0NzYyfQ.8EK6xObqI7y9vHrOrdxptO46DRS8m5OmtGA6UvjBvMU' \
--form 'file=@"/Users/pp/Downloads/体检报告20240212.pdf"'
```

响应:

```json
{
  "file_id":"cloud://prod-8gvh8k8d1aeb0797.7072-prod-8gvh8k8d1aeb0797-1345362468/files/33e1ef20-a539-4748-9cc2-8f6ec1c5154b/size-guide_CN.png",
  "download_url":"https://7072-prod-8gvh8k8d1aeb0797-1345362468.tcb.qcloud.la/files/体检报告20240212.pdf",
}
```


## 产品接口

### 获取产品列表

```
GET /api/products
```

响应:

```json
[
  {
    "id": "产品 ID",
    "name": "产品名称",
    "description": "产品描述",
    "price": 1000,
    "unit": "次",
    "type": 0,
    "createdAt": "创建时间",
    "updatedAt": "更新时间"
  }
]
```

### 更新产品状态

```
PATCH /api/products/{productId}
```

请求体:

```json
{
  "price": 1000, // 价格
  "unit": "次", // 单位
  "status": 0, // 0-下架，1-上架
  "images": ["图片 fid"]
}
```

### 删除产品

```
DELETE /api/products/{productId}
```

### 添加产品

```
POST /api/products
```

请求体:

```json
{
  "name": "产品名称",
  "description": "产品描述",
  "price": 1000,
  "unit": "次",
  "status": 0,
  "images": ["图片 fid"]
}
```

## 档案接口

### 上传文件

```
POST /api/files
```

```
curl --location 'http://localhost:3000/api/files' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNzQ0NTE0NzYyfQ.8EK6xObqI7y9vHrOrdxptO46DRS8m5OmtGA6UvjBvMU' \
--form 'file=@"/Users/pp/Downloads/体检报告20240213.pdf"'
```

响应:

```json
{
  "fileid": "文件 ID",
}
```

### 创建档案

```
POST /api/records
```

请求体:

```json
{
  "name": "姓名",
  "phoneNumber": "手机号",
  "idCard": "身份证号",
  "forms": {
    // 表单数据
  },
  "pdfUrl": "👆 上传文件返回的 fileid"
}
```

响应:

```json
{
  "id": "记录 ID",
  "userId": "用户 ID",
  "forms": {
    // 表单数据
  },
  "pdfUrl": "PDF 文件 URL",
  "createdAt": "创建时间",
  "updatedAt": "更新时间"
}
```

## 错误响应

所有接口在发生错误时会返回以下格式的响应：

```json
{
  "error": "错误信息",
  "details": "详细错误信息（可选）"
}
```

常见 HTTP 状态码：

- 200: 请求成功
- 400: 请求参数错误
- 401: 未授权或令牌无效
- 404: 资源不存在
- 500: 服务器内部错误
