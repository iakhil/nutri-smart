# NutriSmart Backend Server (FastAPI)

Backend API server for the NutriSmart mobile app, built with FastAPI, SQLAlchemy, and PostgreSQL.

## Features

- 🔐 JWT-based authentication
- 👤 User management and profiles
- 🗄️ PostgreSQL database integration with SQLAlchemy
- 📊 User profile storage (allergies, goals, dietary restrictions)
- 🔒 Secure password hashing with bcrypt
- 📝 Automatic API documentation (Swagger UI)

## Prerequisites

- Python 3.9 or higher
- PostgreSQL (v12 or higher)
- pip (Python package manager)

## Setup

### 1. Install Dependencies

Create a virtual environment (recommended):
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

### 2. Configure Database

Create a PostgreSQL database:

```sql
CREATE DATABASE nutri_smart;
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nutri_smart
DB_USER=postgres
DB_PASSWORD=your_password_here
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=3000
```

### 4. Run Database Migrations

The database tables will be created automatically when you start the server (using `Base.metadata.create_all()`).

Alternatively, you can use Alembic for migrations:

```bash
# Initialize Alembic (first time only)
alembic init alembic

# Create a migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### 5. Start the Server

Development mode (with auto-reload):
```bash
python run.py
```

Or using uvicorn directly:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 3000
```

Production mode:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 3000
```

The server will start on `http://localhost:3000`

## API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: `http://localhost:3000/docs`
- **ReDoc**: `http://localhost:3000/redoc`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create a new user account
  - Body: `{ "email": "user@example.com", "password": "password123", "name": "John Doe" }`
  - Response: `{ "success": true, "token": "jwt_token", "user": {...} }`

- `POST /api/auth/login` - Login with email and password
  - Body: `{ "email": "user@example.com", "password": "password123" }`
  - Response: `{ "success": true, "token": "jwt_token", "user": {...} }`

- `GET /api/auth/verify` - Verify JWT token
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ "success": true, "user": {...} }`

### Profile

- `GET /api/profile` - Get user profile (requires authentication)
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ "success": true, "profile": { "allergies": [], "goals": null, "dietary_restrictions": [] } }`

- `PUT /api/profile` - Update user profile (requires authentication)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "allergies": ["peanuts"], "goals": "losing_weight", "dietary_restrictions": ["vegetarian"] }`
  - Response: `{ "success": true, "profile": {...} }`

## Database Schema

### users
- `id` (INTEGER PRIMARY KEY)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (VARCHAR)
- `name` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### user_profiles
- `id` (INTEGER PRIMARY KEY)
- `user_id` (INTEGER, FOREIGN KEY)
- `allergies` (ARRAY[TEXT])
- `goals` (VARCHAR)
- `dietary_restrictions` (ARRAY[TEXT])
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### food_scans
- `id` (INTEGER PRIMARY KEY)
- `user_id` (INTEGER, FOREIGN KEY)
- `product_name` (VARCHAR)
- `image_uri` (TEXT)
- `analysis_data` (JSONB)
- `created_at` (TIMESTAMP)

## Connecting Mobile App

Update the `API_BASE_URL` in your mobile app's `config.js`:

For local development, use your computer's IP address:
```javascript
export const API_BASE_URL = 'http://192.168.1.100:3000';
```

Find your IP address:
- macOS/Linux: `ifconfig | grep "inet "`
- Windows: `ipconfig`

Make sure your mobile device and computer are on the same network.

## Project Structure

```
server/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── database.py          # Database connection
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # Authentication utilities
│   ├── dependencies.py      # FastAPI dependencies
│   └── routers/
│       ├── __init__.py
│       ├── auth.py          # Auth routes
│       └── profile.py        # Profile routes
├── alembic/                 # Database migrations
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variables template
└── run.py                  # Server entry point
```

## Security Notes

- Change `JWT_SECRET` to a strong random string in production
- Use environment variables for all sensitive configuration
- Consider adding rate limiting for production
- Use HTTPS in production
- Implement proper CORS policies for production
- Use Alembic migrations for production database changes

## Development

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

### Code Formatting

```bash
# Install formatting tools
pip install black isort

# Format code
black app/
isort app/
```
