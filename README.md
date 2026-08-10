# Hyperlocal Services Marketplace

A local services booking platform where customers can discover and book verified service providers — inspired by Urban Company.

## Overview
Finding trustworthy local service providers is fragmented and unreliable. This platform centralizes service discovery, booking, and reviews for customers, providers, and admins in one place, with role-based access and a full booking lifecycle.

## Architecture Diagram
![Architecture Diagram](docs/diagrams/architecture-diagram.png)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite) + Axios |
| Backend | Django REST Framework |
| Auth | Django SimpleJWT |
| ORM | Django ORM |
| Database | MySQL 8 |
| Testing | Pytest |
| API Docs | drf-yasg (Swagger) |
| CI/CD | GitHub Actions |
| Backend Hosting | Render / Railway |
| Frontend Hosting | Vercel / Netlify |

## Features
- **Auth**: role-based registration/login (customer, provider, admin) with JWT
- **Services**: providers create and manage service listings under categories
- **Bookings**: customers book services for a scheduled time, with status tracking (pending → confirmed → completed)
- **Reviews**: customers leave ratings and comments after a completed booking
- **Admin**: manage categories, oversee users and listings via Django admin

## Screenshots
_Coming soon._

## Getting Started

### Prerequisites
- Python 3.11+
- MySQL 8 (installed and running locally)
- Node.js 18+ and npm

### 1. Clone the repository
```bash
git clone https://github.com/aadhilbanu/hyperlocal-service-masterplace.git
cd hyperlocal-service-masterplace
```

### 2. Create the MySQL database
Log into MySQL and create an empty database for the project:
```bash
mysql -u root -p
```
```sql
CREATE DATABASE hyperlocal_marketplace;
EXIT;
```

### 3. Backend setup
```bash
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

cd backend
pip install -r requirements.txt
```

Copy `.env.example` (in the project root) to `.env` and fill in your real MySQL credentials:
```bash
copy ..\.env.example ..\.env    # Windows
# cp ../.env.example ../.env    # macOS/Linux
```

Then apply migrations and create an admin account:
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
Backend runs at `http://127.0.0.1:8000`. Admin panel at `http://127.0.0.1:8000/admin`.

### 4. Frontend setup
Open a **new terminal** (leave the backend running in the first one):
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

### 5. Try it out
- Register a new user via the API (`POST /api/users/register/`) or log in with your superuser account
- Add a Service Category and Service Listing via the Django admin panel
- Log in through the React app at `http://localhost:5173` and view the live listings

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DB_NAME` | MySQL database name | Y |
| `DB_USER` | MySQL username | Y |
| `DB_PASSWORD` | MySQL password | Y |
| `DB_HOST` | MySQL host (e.g. `localhost`) | Y |
| `DB_PORT` | MySQL port (default `3306`) | Y |

## API Documentation
_Swagger UI link added after deployment (Day 41)._

## Running Tests
```bash
cd backend
pytest
```

## Deployment
_Deployment details added after Review-II (Day 41)._

## Folder Structure
```
hyperlocal-service-masterplace/
├── backend/
│   ├── manage.py
│   ├── core/            # project settings
│   ├── users/            # custom User model, auth, registration
│   ├── services/          # ServiceCategory, ServiceListing
│   └── bookings/          # Booking model
├── frontend/
│   └── src/
│       ├── api.js         # Axios instance
│       ├── Login.jsx       # Login screen
│       ├── Services.jsx     # Service listings screen
│       └── App.jsx
├── docs/
│   └── diagrams/           # architecture, ER, class diagrams
├── Problem_Statement.md
├── .env.example
└── README.md
```

## Future Enhancements
- Geolocation-based provider matching
- ML-based service recommendations
- Real-time booking notifications

## License
MIT

## Author
Aadhil Banu
