# CommuniMart API Specification

Comprehensive documentation for all REST API endpoints powering CommuniMart.

## Base URL
```
http://localhost:5000/api
```

## 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/resident-login` | Resident email + password login | Public |
| POST | `/api/auth/admin-login` | Committee admin login | Public |
| POST | `/api/auth/register` | Register new flat resident | Public |
| GET | `/api/auth/me` | Get authenticated user profile | Private |
| POST | `/api/auth/logout` | Clear session cookies | Private |

## 2. Products & Listings (`/api/products`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/products` | Search & filter community listings | Public |
| GET | `/api/products/:id` | Get product detail | Public |
| POST | `/api/products` | Create new product listing | Resident |
| PUT | `/api/products/:id` | Update product details | Owner/Admin |
| DELETE | `/api/products/:id` | Remove listing | Owner/Admin |
| PATCH | `/api/products/:id/toggle` | Toggle listing active status | Owner |

## 3. Orders & Logistics (`/api/orders`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/orders` | List user buyer/seller orders | Private |
| POST | `/api/orders` | Create order handover request | Resident |
| PATCH | `/api/orders/:id/status` | Advance order status | Participant |

## 4. Community Notices (`/api/notices`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/notices` | List active society notice board posts | Public |
| POST | `/api/notices` | Post new flash sale or request | Resident |
