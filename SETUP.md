# Database & Environment Setup Guide

This document details the configuration, schema, and local execution steps for the custom backend (Django + DB) as required by the submission guidelines.

## 1. Database Configuration

By default, the project uses **SQLite3** for rapid local development as defined in `backend/config/settings.py`. It is fully prepared to use **PostgreSQL** in production or local environments via the `DATABASE_URL` environment variable.

### Schema Documentation (DDL)
The schema definitions are managed entirely by Django's ORM and migration system. The migration source files (`backend/apps/*/migrations/0001_initial.py`) act as our version-controlled DDL scripts.

**Core Entities & Relationships:**
- **User (accounts_user):** Custom user model replacing Django's default. Tracks `email` (unique identifier), `username`, and `is_staff` (used for the Admin role).
- **Category (quizzes_category):** Groups quizzes. Fields: `name` (unique).
- **Quiz (quizzes_quiz):** The main entity. Fields: `title`, `description`, `difficulty`, `time_limit_seconds`, `is_published`. Foreign keys to `Category` and `User` (created_by).
- **Question (quizzes_question):** Belongs to a Quiz. Fields: `text`, `explanation`, `order`. Foreign key to `Quiz` with cascading delete.
- **Choice (quizzes_choice):** Belongs to a Question. Fields: `text`, `is_correct`. Foreign key to `Question` with cascading delete.
- **Attempt (attempts_attempt):** Tracks a user's quiz attempt. Fields: `score`, `started_at`, `completed_at`, `is_completed`. Foreign keys to `User` and `Quiz`.
- **AttemptAnswer (attempts_attemptanswer):** Tracks individual answers within an attempt. Foreign keys to `Attempt`, `Question`, and `Choice`.

### Access Control & Security
- **Authentication:** Managed via JWT (JSON Web Tokens). Endpoints are protected using Django REST Framework's `IsAuthenticated` permission class globally.
- **Authorization:** Only users with `is_staff=True` (Admins) can hit the `QuizCreateView`. This is enforced by the `IsAdminUser` permission class.

## 2. Local Setup Instructions

**Step 1: Environment Variables**
Navigate to the `backend` directory and copy the example environment file:
```bash
cp .env.example .env
```
Ensure `DEBUG=True` and provide your `GOOGLE_CLIENT_ID` for OAuth to work. If you wish to use PostgreSQL locally, uncomment and modify the `DATABASE_URL` line.

**Step 2: Install Dependencies**
We recommend using a virtual environment:
```bash
python -m venv venv
# Activate on Windows: venv\Scripts\activate
# Activate on macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
```

**Step 3: Run Database Migrations**
Apply the tracked migration files to build the schema:
```bash
python manage.py migrate
```

**Step 4: Seed Initial Data (Optional but Recommended)**
Populate the database with sample categories, quizzes, questions, and choices to test the application immediately:
```bash
python manage.py seed_quizzes
```

**Step 5: Create an Admin Superuser**
To access the Admin role (for creating quizzes from the frontend) and the Django admin panel, run the custom admin creation script:
```bash
python create_admin.py
```
*(This creates `admin@quizportal.com` / `Admin1234!`)*

**Step 6: Start the Server**
```bash
python manage.py runserver
```
The backend API will now be available at `http://localhost:8000`.
