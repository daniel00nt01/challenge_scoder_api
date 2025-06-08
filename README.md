# Medical Clinic API

A RESTful API for managing medical clinic appointments, built with Node.js, TypeScript, Express, and PostgreSQL.

For more facility, use script deploy.sh in your server, locate in folder scripts.

## Hosted API

The API is hosted on Digital Ocean and can be accessed through the following endpoints:

- Base URL: `http://167.99.230.88:3000`
- API Base: `http://167.99.230.88:3000/api`

## Available Endpoints

### Authentication

- **POST** `/api/auth/register`
  - Register a new user
  - Request Body:
    ```json
    {
       "name": "Dr. João Silva",
       "email": "joao.silva2@example.com",
       "password": "123456",
       "phone": "11999999999",
       "crm": "123456",
       "specialization": "Cardiologia"
   }
    ```

- **POST** `/api/auth/login`
  - Perform login
  - Request Body:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  - Response:
    ```json
    {
      "user": {
        "id": "uuid",
        "name": "string",
        "email": "string",
        "role": "DOCTOR | PATIENT"
      },
      "token": "JWT_TOKEN"
    }
    ```

### Appointments

- **GET** `/api/appointments`
  - List all appointments
  - Requires: JWT Token in header `Authorization: Bearer <token>`
  - Query Parameters:
    - `status`: (optional) Filter by status (SCHEDULED, COMPLETED, CANCELLED)
    - `date`: (optional) Filter by date (YYYY-MM-DD)
  - Response:
    ```json
    {
      "data": [
        {
          "id": "uuid",
          "patientId": "uuid",
          "doctorId": "uuid",
          "date": "timestamp",
          "status": "SCHEDULED | COMPLETED | CANCELLED",
          "notes": "string",
          "createdAt": "timestamp",
          "updatedAt": "timestamp",
          "patient": {
            "id": "uuid",
            "name": "string"
          },
          "doctor": {
            "id": "uuid",
            "name": "string"
          }
        }
      ],
      "total": "number",
      "page": "number",
      "limit": "number"
    }
    ```

- **POST** `/api/appointments`
  - Create a new appointment
  - Requires: JWT Token
  - Request Body:
    ```json
    {
      "patientId": "uuid",
      "doctorId": "uuid",
      "date": "timestamp",
      "notes": "string (optional)"
    }
    ```
  - Response:
    ```json
    {
      "id": "uuid",
      "patientId": "uuid",
      "doctorId": "uuid",
      "date": "timestamp",
      "status": "SCHEDULED",
      "notes": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
    ```

- **PUT** `/api/appointments/:id`
  - Update an existing appointment
  - Requires: JWT Token
  - URL Parameters:
    - `id`: Appointment UUID
  - Request Body:
    ```json
    {
      "date": "timestamp (optional)",
      "status": "SCHEDULED | COMPLETED | CANCELLED (optional)",
      "notes": "string (optional)"
    }
    ```
  - Response: Updated appointment object

- **DELETE** `/api/appointments/:id`
  - Cancel an appointment
  - Requires: JWT Token
  - URL Parameters:
    - `id`: Appointment UUID
  - Response:
    ```json
    {
      "message": "Appointment cancelled successfully"
    }
    ```

## Running Locally

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- Git

### Installation Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd medical-clinic-api
   ```

2. Create a `.env` file in the project root:
   ```env
   NODE_ENV=development
   PORT=3000
   
   # Database
   DB_HOST=postgres
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=medical_clinic
   
   # JWT
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRATION=1d
   ```

3. Start containers with Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. The API will be available at `http://localhost:3000`

### Project Structure

```
medical-clinic-api/
├── src/
│   ├── config/
│   │   ├── data-source.ts
│   │   └── swagger.ts
│   ├── controllers/
│   ├── entities/
│   ├── middlewares/
│   ├── routes/
│   └── app.ts
├── nginx/
│   ├── conf.d/
│   └── Dockerfile
├── docker-compose.yml
└── package.json
```

## Development

### Available Scripts

- `npm run dev`: Start server in development mode
- `npm run build`: Compile TypeScript
- `npm start`: Start server in production mode
- `npm run typeorm`: Execute TypeORM commands

### Useful Docker Commands

- Start services:
  ```bash
  docker-compose up -d
  ```

- Stop services:
  ```bash
  docker-compose down
  ```

- View logs:
  ```bash
  docker-compose logs -f
  ```

### Migrations

To create a new migration:
```bash
npm run typeorm migration:create ./src/migrations/MigrationName
```

To run migrations:
```bash
npm run typeorm migration:run
```

## API Usage Examples

## Technologies Used

- Node.js
- TypeScript
- Express
- TypeORM
- PostgreSQL
- Docker
- Nginx
- JWT for authentication


## Testing with Insomnia

### 1. Initial Setup
1. Download and install Insomnia from https://insomnia.rest/
2. Create a new Collection (Click "Create" > "Request Collection")
3. Name it "Medical Clinic API"

### 2. Environment Setup
1. Click the "No Environment" dropdown
2. Select "Base Environment"
3. Add the following JSON:
```json
{
  "baseUrl": "http://167.99.230.88:3000",
  "token": ""
}
```

### 3. Testing Endpoints

#### Register Doctor
- Method: `POST`
- URL: `{{ baseUrl }}/api/auth/register/doctor`
- Headers:
  ```
  Content-Type: application/json
  ```
- Body (JSON):
  ```json
  {
    "name": "Dr. João Silva",
    "email": "joao.silva2@example.com",
    "password": "123456",
    "phone": "11999999999",
    "crm": "123456",
    "specialization": "Cardiologia"
  }
  ```

#### Register Patient
- Method: `POST`
- URL: `{{ baseUrl }}/api/auth/register/patient`
- Headers:
  ```
  Content-Type: application/json
  ```
- Body (JSON):
  ```json
  {
    "name": "Maria Santos",
    "email": "maria.santos@example.com",
    "password": "123456",
    "phone": "11988888888",
    "birthDate": "1990-01-01",
    "healthInsurance": "Unimed"
  }
  ```

#### Login
- Method: `POST`
- URL: `{{ baseUrl }}/api/auth/login`
- Headers:
  ```
  Content-Type: application/json
  ```
- Body (JSON):
  ```json
  {
    "email": "joao.silva2@example.com",
    "password": "123456"
  }
  ```
- After successful login, copy the token from the response and update your environment:
  ```json
  {
    "baseUrl": "http://167.99.230.88:3000",
    "token": "your_received_token_here"
  }
  ```

#### Create Appointment
- Method: `POST`
- URL: `{{ baseUrl }}/api/appointments`
- Headers:
  ```
  Content-Type: application/json
  Authorization: Bearer {{ token }}
  ```
- Body (JSON):
  ```json
  {
    "doctorId": "doctor_id_from_register",
    "patientId": "patient_id_from_register",
    "date": "2024-03-20T10:00:00.000Z",
    "notes": "Regular checkup"
  }
  ```

#### List Appointments
- Method: `GET`
- URL: `{{ baseUrl }}/api/appointments`
- Headers:
  ```
  Authorization: Bearer {{ token }}
  ```
- Query Parameters (optional):
  - `status`: SCHEDULED, COMPLETED, or CANCELLED
  - `date`: YYYY-MM-DD

#### Update Appointment
- Method: `PUT`
- URL: `{{ baseUrl }}/api/appointments/:id`
- Headers:
  ```
  Content-Type: application/json
  Authorization: Bearer {{ token }}
  ```
- Body (JSON):
  ```json
  {
    "status": "COMPLETED",
    "notes": "Patient showed improvement"
  }
  ```

#### Cancel Appointment
- Method: `DELETE`
- URL: `{{ baseUrl }}/api/appointments/:id`
- Headers:
  ```
  Authorization: Bearer {{ token }}
  ```

### 4. Tips for Testing

1. **Managing Multiple Environments**
   - Create different environments for development and production
   - Example Development Environment:
     ```json
     {
       "baseUrl": "http://localhost:3000",
       "token": ""
     }
     ```

2. **Using Response Data**
   - After registration, save the returned IDs for creating appointments
   - After login, save the token in your environment

3. **Testing Flow**
   1. Register a doctor
   2. Register a patient
   3. Login with either account
   4. Save the token
   5. Create an appointment
   6. List appointments
   7. Update appointment status
   8. Cancel appointment if needed

4. **Error Handling**
   - Test with invalid data to ensure proper error responses
   - Common error scenarios to test:
     - Invalid credentials
     - Expired token
     - Invalid appointment dates
     - Non-existent IDs
     - Missing required fields

5. **Headers Cheat Sheet**
   ```
   Content-Type: application/json
   Authorization: Bearer {{ token }}
   ``` 