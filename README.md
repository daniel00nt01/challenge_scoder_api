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
  - Body: `{ "email": "string", "password": "string", "name": "string" }`

- **POST** `/api/auth/login`
  - Perform login
  - Body: `{ "email": "string", "password": "string" }`
  - Returns: JWT Token

### Appointments

- **GET** `/api/appointments`
  - List all appointments
  - Requires: JWT Token in header `Authorization: Bearer <token>`

- **POST** `/api/appointments`
  - Create a new appointment
  - Requires: JWT Token
  - Body: 
    ```json
    {
      "patientName": "string",
      "doctorName": "string",
      "date": "2024-03-20T10:00:00Z",
      "status": "SCHEDULED"
    }
    ```

- **PUT** `/api/appointments/:id`
  - Update an existing appointment
  - Requires: JWT Token
  - Body: Same fields as POST

- **DELETE** `/api/appointments/:id`
  - Cancel an appointment
  - Requires: JWT Token

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

### Using cURL

1. Register a user:
```bash
curl -X POST http://167.99.230.88/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"your_password","name":"Your Name"}'
```

2. Login:
```bash
curl -X POST http://167.99.230.88/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"your_password"}'
```

3. List appointments (using token from login):
```bash
curl http://167.99.230.88/api/appointments \
  -H "Authorization: Bearer your_token_here"
```

### Using JavaScript/TypeScript

```typescript
// Login example
async function login(email: string, password: string) {
  const response = await fetch('http://167.99.230.88/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return await response.json();
}

// Create appointment example
async function createAppointment(token: string, appointmentData: any) {
  const response = await fetch('http://167.99.230.88/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(appointmentData),
  });
  return await response.json();
}
```

## Technologies Used

- Node.js
- TypeScript
- Express
- TypeORM
- PostgreSQL
- Docker
- Nginx
- JWT for authentication

## Security Features

- All passwords are hashed before storage
- JWT-based authentication
- Validation middlewares for all routes
- Rate limiting to prevent brute force attacks
- Security headers via Helmet
- CORS protection
- Input validation and sanitization

## Error Handling

The API uses standard HTTP status codes and returns errors in the following format:

```json
{
  "status": "error",
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details. 