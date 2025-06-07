# Medical Clinic API

A RESTful API for managing medical clinic appointments, built with Node.js, Express, TypeORM, and PostgreSQL.

## Features

- User authentication (JWT)
- Role-based access control (doctors and patients)
- Doctor registration and management
- Patient registration and management
- Appointment scheduling and management
- Data validation using class-validator
- PostgreSQL database with TypeORM
- TypeScript support

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd medical-clinic-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```env
PORT=3000
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=1d

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=medical_clinic
```

4. Create the database:
```bash
createdb medical_clinic
```

5. Run migrations:
```bash
npm run migration:run
```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register/doctor` - Register a new doctor
- `POST /api/auth/register/patient` - Register a new patient
- `POST /api/auth/login` - Login for both doctors and patients

### Appointments

- `POST /api/appointments` - Create a new appointment
- `GET /api/appointments/doctor` - Get doctor's appointments
- `GET /api/appointments/patient` - Get patient's appointments
- `PUT /api/appointments/:id` - Update an appointment
- `DELETE /api/appointments/:id` - Delete an appointment

## Request Examples

### Register Doctor
```json
POST /api/auth/register/doctor
{
  "name": "Dr. John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phone": "1234567890",
  "crm": "12345",
  "specialization": "Cardiology"
}
```

### Register Patient
```json
POST /api/auth/register/patient
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "password": "password123",
  "phone": "0987654321",
  "birth_date": "1990-01-01",
  "health_insurance": "Insurance123"
}
```

### Create Appointment
```json
POST /api/appointments
{
  "doctorId": "doctor-uuid",
  "patientId": "patient-uuid",
  "appointment_date": "2024-03-15T14:30:00Z",
  "notes": "Regular checkup"
}
```

## Error Handling

The API uses standard HTTP status codes and returns error messages in the following format:

```json
{
  "message": "Error message here"
}
```

## Security

- All endpoints (except registration and login) require JWT authentication
- Passwords are hashed using bcrypt
- CORS and Helmet middleware for security headers
- Role-based access control for protected endpoints

## Database Schema

- Users (Base table for both doctors and patients)
- Doctors (Extends Users)
- Patients (Extends Users)
- Appointments (Relates doctors and patients)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 