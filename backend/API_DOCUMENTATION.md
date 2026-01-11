# PSR API Documentation

## Base URL
`http://localhost:5000/api/psr`

All endpoints require authentication (JWT token in Authorization header)

---

## Endpoints

### 1. Get All PSRs
**GET** `/api/psr`

**Query Parameters:**
- `status` (optional): Filter by status (draft, pending, approved, rejected, in_progress)
- `department` (optional): Filter by department
- `priority` (optional): Filter by priority (low, medium, high)
- `requestor` (optional): Filter by requestor ID (admin/procurement only)

**Response:**
```json
{
  "psrs": [...],
  "count": 10
}
```

---

### 2. Get My Requests (Current User's PSRs)
**GET** `/api/psr/my-requests`

**Query Parameters:**
- `status` (optional): Filter by status

**Response:**
```json
{
  "psrs": [...],
  "count": 5
}
```

---

### 3. Get Pending Requests
**GET** `/api/psr/pending`

**Access:** Procurement Team / Admin only

**Response:**
```json
{
  "psrs": [...],
  "count": 3
}
```

---

### 4. Get Approved Requests
**GET** `/api/psr/approved`

**Response:**
```json
{
  "psrs": [...],
  "count": 8
}
```

---

### 5. Get PSR by ID
**GET** `/api/psr/:id`

**Response:**
```json
{
  "psr": {
    "_id": "...",
    "psrId": "REQ-001",
    "title": "New Laptop for Development Team",
    "description": "...",
    "department": "IT",
    "status": "pending",
    "priority": "high",
    "budget": {
      "amount": 2500000,
      "currency": "INR",
      "display": "INR 2.5M"
    },
    "requestor": {...},
    "comments": [...],
    "history": [...]
  }
}
```

---

### 6. Create PSR
**POST** `/api/psr`

**Body:**
```json
{
  "title": "New Laptop for Development Team",
  "description": "Need 10 new laptops for development team",
  "department": "IT",
  "priority": "high",
  "budget": {
    "amount": 2500000,
    "currency": "INR"
  },
  "category": "Hardware"
}
```

**Response:**
```json
{
  "message": "PSR created successfully",
  "psr": {...}
}
```

---

### 7. Update PSR
**PUT** `/api/psr/:id`

**Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "department": "IT",
  "priority": "medium",
  "budget": {
    "amount": 3000000,
    "currency": "INR"
  }
}
```

**Note:** Requestors can only update their own PSRs if status is 'draft' or 'pending'

---

### 8. Submit PSR for Approval
**POST** `/api/psr/:id/submit`

**Response:**
```json
{
  "message": "PSR submitted successfully",
  "psr": {...}
}
```

**Note:** Only draft PSRs can be submitted

---

### 9. Approve PSR
**POST** `/api/psr/:id/approve`

**Access:** Procurement Team / Admin only

**Response:**
```json
{
  "message": "PSR approved successfully",
  "psr": {...}
}
```

---

### 10. Reject PSR
**POST** `/api/psr/:id/reject`

**Access:** Procurement Team / Admin only

**Body:**
```json
{
  "reason": "Budget exceeds department limit"
}
```

**Response:**
```json
{
  "message": "PSR rejected",
  "psr": {...}
}
```

---

### 11. Add Comment to PSR
**POST** `/api/psr/:id/comment`

**Body:**
```json
{
  "comment": "Please provide more details about the requirements"
}
```

**Response:**
```json
{
  "message": "Comment added successfully",
  "psr": {...}
}
```

---

### 12. Delete PSR
**DELETE** `/api/psr/:id`

**Note:** Only draft PSRs can be deleted, and only by the creator

**Response:**
```json
{
  "message": "PSR deleted successfully"
}
```

---

### 13. Get Statistics
**GET** `/api/psr/statistics/summary`

**Response:**
```json
{
  "total": 47,
  "pending": 8,
  "approved": 23,
  "rejected": 5,
  "inProgress": 6,
  "draft": 5
}
```

---

## PSR Status Flow

```
draft → pending → approved/rejected
                ↓
            in_progress
```

---

## Testing with curl

### Create PSR:
```bash
curl -X POST http://localhost:5000/api/psr \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Laptop for Development Team",
    "department": "IT",
    "priority": "high",
    "budget": {"amount": 2500000, "currency": "INR"}
  }'
```

### Get My Requests:
```bash
curl -X GET http://localhost:5000/api/psr/my-requests \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Approve PSR:
```bash
curl -X POST http://localhost:5000/api/psr/PSR_ID/approve \
  -H "Authorization: Bearer YOUR_TOKEN"
```
