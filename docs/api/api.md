# 🔌 API Reference Documentation

> REST API Endpoints — Request & Response Examples

---

## 📋 Base Info

| Property | Value |
|----------|-------|
| Base URL | `http://localhost:5000/api/tasks` |
| Format | JSON |
| Swagger UI | `http://localhost:5000/swagger` |

---

## 📦 Task Object (Response)

```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write all MD files for the project",
  "status": "InProgress",
  "priority": "High",
  "dueDate": "2026-05-20T00:00:00Z",
  "createdAt": "2026-05-12T08:00:00Z",
  "updatedAt": "2026-05-12T09:00:00Z"
}
```

## 📦 Task DTO (Request Body)

```json
{
  "title": "Complete project documentation",
  "description": "Write all MD files for the project",
  "status": 1,
  "priority": 2,
  "dueDate": "2026-05-20T00:00:00Z"
}
```

**Status values:** `0` = Pending, `1` = InProgress, `2` = Done
**Priority values:** `0` = Low, `1` = Medium, `2` = High

---

## 📡 Endpoints

---

### 1. GET `/api/tasks` — Get All Tasks

Returns all tasks ordered by latest first.

**Request:**
```http
GET http://localhost:5000/api/tasks
```

**Response: `200 OK`**
```json
[
  {
    "id": 2,
    "title": "Fix login bug",
    "description": "Users cannot login with special characters",
    "status": "Pending",
    "priority": "High",
    "dueDate": null,
    "createdAt": "2026-05-12T10:00:00Z",
    "updatedAt": null
  },
  {
    "id": 1,
    "title": "Setup project",
    "description": "Initialize .NET and Angular projects",
    "status": "Done",
    "priority": "Medium",
    "dueDate": "2026-05-10T00:00:00Z",
    "createdAt": "2026-05-11T08:00:00Z",
    "updatedAt": "2026-05-12T09:00:00Z"
  }
]
```

---

### 2. GET `/api/tasks/{id}` — Get Task by ID

**Request:**
```http
GET http://localhost:5000/api/tasks/1
```

**Response: `200 OK`**
```json
{
  "id": 1,
  "title": "Setup project",
  "description": "Initialize .NET and Angular projects",
  "status": "Done",
  "priority": "Medium",
  "dueDate": "2026-05-10T00:00:00Z",
  "createdAt": "2026-05-11T08:00:00Z",
  "updatedAt": "2026-05-12T09:00:00Z"
}
```

**Response: `404 Not Found`** (when task does not exist)
```json
(empty body)
```

---

### 3. POST `/api/tasks` — Create New Task

**Request:**
```http
POST http://localhost:5000/api/tasks
Content-Type: application/json

{
  "title": "Write unit tests",
  "description": "Cover all controller endpoints",
  "status": 0,
  "priority": 2,
  "dueDate": "2026-05-15T00:00:00Z"
}
```

**Response: `201 Created`**
```json
{
  "id": 3,
  "title": "Write unit tests",
  "description": "Cover all controller endpoints",
  "status": "Pending",
  "priority": "High",
  "dueDate": "2026-05-15T00:00:00Z",
  "createdAt": "2026-05-12T11:00:00Z",
  "updatedAt": null
}
```

> **Note:** `status` and `priority` are sent as numbers (0,1,2) but returned as strings ("Pending", "High").

---

### 4. PUT `/api/tasks/{id}` — Update Task

**Request:**
```http
PUT http://localhost:5000/api/tasks/3
Content-Type: application/json

{
  "title": "Write unit tests",
  "description": "All 43 tests written and passing",
  "status": 2,
  "priority": 2,
  "dueDate": "2026-05-15T00:00:00Z"
}
```

**Response: `200 OK`**
```json
{
  "id": 3,
  "title": "Write unit tests",
  "description": "All 43 tests written and passing",
  "status": "Done",
  "priority": "High",
  "dueDate": "2026-05-15T00:00:00Z",
  "createdAt": "2026-05-12T11:00:00Z",
  "updatedAt": "2026-05-12T12:00:00Z"
}
```

**Response: `404 Not Found`** (when task does not exist)

---

### 5. DELETE `/api/tasks/{id}` — Delete Task

**Request:**
```http
DELETE http://localhost:5000/api/tasks/3
```

**Response: `204 No Content`** (success — empty body)

**Response: `404 Not Found`** (when task does not exist)

---

## 📊 Response Status Codes Summary

| Status Code | Meaning | When |
|-------------|---------|------|
| `200 OK` | Success | GET, PUT |
| `201 Created` | Resource created | POST |
| `204 No Content` | Success, no body | DELETE |
| `404 Not Found` | Resource not found | GET/PUT/DELETE with invalid id |
| `400 Bad Request` | Validation failed | POST/PUT with invalid data |

---

## 🔒 CORS Configuration

The API allows requests only from Angular frontend:

```csharp
policy.WithOrigins("http://localhost:4200")
      .AllowAnyHeader()
      .AllowAnyMethod()
```

---

## 🧪 Testing API with Swagger

1. Run the backend: `dotnet run`
2. Open browser: `http://localhost:5000/swagger`
3. Click on any endpoint → `Try it out` → `Execute`

---

## 🧪 Testing API with curl

```bash
# Get all tasks
curl -X GET http://localhost:5000/api/tasks

# Get task by id
curl -X GET http://localhost:5000/api/tasks/1

# Create task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Desc","status":0,"priority":1}'

# Update task
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Task","description":"Desc","status":2,"priority":1}'

# Delete task
curl -X DELETE http://localhost:5000/api/tasks/1
```
