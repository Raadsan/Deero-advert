# Postman API Testing Guide - Service API

Base URL: `http://localhost:5000/api/service`

---

## 1. CREATE SERVICE (POST)

**Endpoint:** `POST http://localhost:5000/api/service/create`

**Method:** `POST`

**Headers:**
- No special headers needed (Postman will set `Content-Type: multipart/form-data` automatically)

**Body Type:** `form-data`

**Body Fields:**

| Key | Type | Value | Required |
|-----|------|-------|----------|
| `serviceTitle` | Text | `Web Development Service` | ✅ Yes |
| `serviceIcon` | File | Select an image file (jpg, png, gif) | ✅ Yes |
| `packages` | Text | See JSON below | ✅ Yes |

**Packages JSON (paste as text):**
```json
[{"packageTitle":"Basic Package","price":50,"features":["5 pages","Mobile responsive","Basic SEO"]},{"packageTitle":"Premium Package","price":100,"features":["10 pages","Mobile responsive","Advanced SEO","SSL Certificate"]}]
```

**Example Request:**
```
POST http://localhost:5000/api/service/create

Body (form-data):
- serviceTitle: "Web Development Service"
- serviceIcon: [Select file: logo.jpg]
- packages: [{"packageTitle":"Basic Package","price":50,"features":["5 pages","Mobile responsive","Basic SEO"]}]
```

**Expected Response (201 Created):**
```json
{
    "message": "Service created successfully",
    "success": true,
    "data": {
        "_id": "65f1234567890abcdef12345",
        "serviceTitle": "Web Development Service",
        "serviceIcon": "uploads/1766308788931.jpg",
        "packages": [
            {
                "packageTitle": "Basic Package",
                "price": 50,
                "features": ["5 pages", "Mobile responsive", "Basic SEO"]
            }
        ],
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
    }
}
```

---

## 2. GET ALL SERVICES (GET)

**Endpoint:** `GET http://localhost:5000/api/service/`

**Method:** `GET`

**Headers:** None required

**Query Parameters:** None

**Example Request:**
```
GET http://localhost:5000/api/service/
```

**Expected Response (200 OK):**
```json
{
    "message": "All Services",
    "success": true,
    "data": [
        {
            "_id": "65f1234567890abcdef12345",
            "serviceTitle": "Web Development Service",
            "serviceIcon": "uploads/1766308788931.jpg",
            "packages": [...],
            "createdAt": "2024-01-15T10:30:00.000Z",
            "updatedAt": "2024-01-15T10:30:00.000Z"
        },
        {
            "_id": "65f1234567890abcdef12346",
            "serviceTitle": "Hosting Service",
            "serviceIcon": "uploads/1766308788949.jpg",
            "packages": [...],
            "createdAt": "2024-01-15T11:00:00.000Z",
            "updatedAt": "2024-01-15T11:00:00.000Z"
        }
    ]
}
```

---

## 3. GET SERVICE BY ID (GET)

**Endpoint:** `GET http://localhost:5000/api/service/:id`

**Method:** `GET`

**Headers:** None required

**URL Parameters:**
- `id` - The service ID (replace `:id` with actual ID)

**Example Request:**
```
GET http://localhost:5000/api/service/65f1234567890abcdef12345
```

**Expected Response (200 OK):**
```json
{
    "success": true,
    "message": "Service retrieved successfully",
    "data": {
        "_id": "65f1234567890abcdef12345",
        "serviceTitle": "Web Development Service",
        "serviceIcon": "uploads/1766308788931.jpg",
        "packages": [
            {
                "packageTitle": "Basic Package",
                "price": 50,
                "features": ["5 pages", "Mobile responsive", "Basic SEO"]
            }
        ],
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
    }
}
```

**Error Response (404 Not Found):**
```json
{
    "success": false,
    "message": "Service not found with this id"
}
```

---

## 4. UPDATE SERVICE (PUT/PATCH)

**Endpoint:** `PUT http://localhost:5000/api/service/:id` or `PATCH http://localhost:5000/api/service/:id`

**Method:** `PUT` or `PATCH`

**Headers:**
- No special headers needed (Postman will set `Content-Type: multipart/form-data` automatically)

**URL Parameters:**
- `id` - The service ID (replace `:id` with actual ID)

**Body Type:** `form-data`

**Body Fields (All Optional - only include fields you want to update):**

| Key | Type | Value | Required |
|-----|------|-------|----------|
| `serviceTitle` | Text | `Updated Service Title` | ❌ No |
| `serviceIcon` | File | Select an image file | ❌ No |
| `packages` | Text | See JSON below | ❌ No |

**Example Request - Update Title Only:**
```
PUT http://localhost:5000/api/service/65f1234567890abcdef12345

Body (form-data):
- serviceTitle: "Updated Web Development Service"
```

**Example Request - Update Packages Only:**
```
PUT http://localhost:5000/api/service/65f1234567890abcdef12345

Body (form-data):
- packages: [{"packageTitle":"Updated Package","price":75,"features":["10 pages","Mobile responsive","Advanced SEO"]}]
```

**Example Request - Update Everything:**
```
PUT http://localhost:5000/api/service/65f1234567890abcdef12345

Body (form-data):
- serviceTitle: "Updated Web Development Service"
- serviceIcon: [Select file: new-logo.jpg]
- packages: [{"packageTitle":"Premium Package","price":150,"features":["15 pages","Mobile responsive","Advanced SEO","SSL Certificate","24/7 Support"]}]
```

**Expected Response (200 OK):**
```json
{
    "success": true,
    "message": "Service updated successfully",
    "data": {
        "_id": "65f1234567890abcdef12345",
        "serviceTitle": "Updated Web Development Service",
        "serviceIcon": "uploads/1766308892477.jpg",
        "packages": [
            {
                "packageTitle": "Premium Package",
                "price": 150,
                "features": ["15 pages", "Mobile responsive", "Advanced SEO", "SSL Certificate", "24/7 Support"]
            }
        ],
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T12:00:00.000Z"
    }
}
```

**Error Response (400 Bad Request - No fields to update):**
```json
{
    "success": false,
    "message": "No updatable fields provided"
}
```

---

## 5. DELETE SERVICE (DELETE)

**Endpoint:** `DELETE http://localhost:5000/api/service/:id`

**Method:** `DELETE`

**Headers:** None required

**URL Parameters:**
- `id` - The service ID (replace `:id` with actual ID)

**Example Request:**
```
DELETE http://localhost:5000/api/service/65f1234567890abcdef12345
```

**Expected Response (200 OK):**
```json
{
    "success": true,
    "message": "Service deleted successfully",
    "data": {
        "_id": "65f1234567890abcdef12345",
        "serviceTitle": "Web Development Service",
        "serviceIcon": "uploads/1766308788931.jpg",
        "packages": [...],
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
    }
}
```

**Error Response (404 Not Found):**
```json
{
    "success": false,
    "message": "Service not found"
}
```

---

## Common Error Responses

### 400 Bad Request - Validation Errors

**Missing serviceTitle:**
```json
{
    "message": "serviceTitle is required",
    "success": false
}
```

**Missing serviceIcon:**
```json
{
    "message": "serviceIcon image is required",
    "success": false
}
```

**Invalid packages format:**
```json
{
    "message": "Invalid packages JSON format: ...",
    "success": false,
    "hint": "Send just the array: [{\"packageTitle\":\"Name\",\"price\":20,\"features\":[\"feature1\"]}]"
}
```

**Missing package fields:**
```json
{
    "message": "Package at index 0 is missing required field: packageTitle",
    "success": false
}
```

### 500 Internal Server Error
```json
{
    "success": false,
    "message": "Server error",
    "error": "Error details here"
}
```

---

## Quick Testing Checklist

- [ ] ✅ Create a new service with all fields
- [ ] ✅ Get all services
- [ ] ✅ Get a specific service by ID
- [ ] ✅ Update service title only
- [ ] ✅ Update service icon only
- [ ] ✅ Update packages only
- [ ] ✅ Update all fields at once
- [ ] ✅ Delete a service
- [ ] ✅ Test error cases (missing fields, invalid IDs, etc.)

---

## Tips for Postman Testing

1. **For form-data requests (POST/PUT/PATCH):**
   - Select "Body" tab
   - Choose "form-data" option
   - Add fields as key-value pairs
   - For file uploads, change the field type from "Text" to "File"

2. **For packages JSON:**
   - Use "Text" type (not JSON)
   - Paste the array directly without outer quotes
   - Example: `[{"packageTitle":"Name","price":20,"features":["feature1"]}]`

3. **Save responses:**
   - Copy the `_id` from CREATE response to use in GET/UPDATE/DELETE requests

4. **Test image uploads:**
   - Supported formats: jpg, jpeg, png, gif
   - Max file size: 5MB

---

## Postman Collection JSON

You can import this into Postman:

```json
{
	"info": {
		"name": "Service API",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "Create Service",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "formdata",
					"formdata": [
						{
							"key": "serviceTitle",
							"type": "text",
							"value": "Web Development Service"
						},
						{
							"key": "serviceIcon",
							"type": "file",
							"src": []
						},
						{
							"key": "packages",
							"type": "text",
							"value": "[{\"packageTitle\":\"Basic Package\",\"price\":50,\"features\":[\"5 pages\",\"Mobile responsive\",\"Basic SEO\"]}]"
						}
					]
				},
				"url": {
					"raw": "http://localhost:5000/api/service/create",
					"protocol": "http",
					"host": ["localhost"],
					"port": "5000",
					"path": ["api", "service", "create"]
				}
			}
		},
		{
			"name": "Get All Services",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "http://localhost:5000/api/service/",
					"protocol": "http",
					"host": ["localhost"],
					"port": "5000",
					"path": ["api", "service", ""]
				}
			}
		},
		{
			"name": "Get Service By ID",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "http://localhost:5000/api/service/:id",
					"protocol": "http",
					"host": ["localhost"],
					"port": "5000",
					"path": ["api", "service", ":id"],
					"variable": [
						{
							"key": "id",
							"value": "YOUR_SERVICE_ID_HERE"
						}
					]
				}
			}
		},
		{
			"name": "Update Service",
			"request": {
				"method": "PUT",
				"header": [],
				"body": {
					"mode": "formdata",
					"formdata": [
						{
							"key": "serviceTitle",
							"type": "text",
							"value": "Updated Service Title"
						},
						{
							"key": "serviceIcon",
							"type": "file",
							"src": []
						},
						{
							"key": "packages",
							"type": "text",
							"value": "[{\"packageTitle\":\"Updated Package\",\"price\":75,\"features\":[\"10 pages\",\"Mobile responsive\"]}]"
						}
					]
				},
				"url": {
					"raw": "http://localhost:5000/api/service/:id",
					"protocol": "http",
					"host": ["localhost"],
					"port": "5000",
					"path": ["api", "service", ":id"],
					"variable": [
						{
							"key": "id",
							"value": "YOUR_SERVICE_ID_HERE"
						}
					]
				}
			}
		},
		{
			"name": "Delete Service",
			"request": {
				"method": "DELETE",
				"header": [],
				"url": {
					"raw": "http://localhost:5000/api/service/:id",
					"protocol": "http",
					"host": ["localhost"],
					"port": "5000",
					"path": ["api", "service", ":id"],
					"variable": [
						{
							"key": "id",
							"value": "YOUR_SERVICE_ID_HERE"
						}
					]
				}
			}
		}
	]
}
```

Save this as a `.json` file and import it into Postman!

