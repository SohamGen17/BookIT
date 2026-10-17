# BookIT — Event Booking API

A RESTful backend API for managing events and bookings, built using **Node.js, Express.js, and MongoDB**. The API supports user authentication, role-based authorization, event management, seat availability, and booking cancellation.

## Features

- **User Authentication:** Register and log in using JWT authentication.
- **Role-Based Access Control:** Separate permissions for regular users and administrators.
- **Event Management:** Create, view, update, and delete events.
- **Event Search:** Search upcoming events by title and venue.
- **Booking Management:** Book available seats and view personal bookings.
- **Seat Availability:** Prevent bookings from exceeding available capacity.
- **Booking Cancellation:** Cancel bookings and restore the corresponding seats.
- **Input Validation:** Validate request data, event dates, seat counts, and identifiers.
- **Error Handling:** Consistent HTTP status codes and centralized error handling.

## Tech Stack

- **Runtime:** Node.js
- **Backend Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcrypt / bcryptjs
- **API Testing:** Postman
- **Architecture:** Model–View–Controller (MVC)

## Project Structure

```text
BookIT/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── eventController.js
│   └── bookingController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   ├── Event.js
│   └── Booking.js
├── routes/
│   ├── authRoutes.js
│   ├── eventRoutes.js
│   └── bookingRoutes.js
├── postman/
│   └── Event-Booking-API.json
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

*The structure above represents the intended organization. Adjust filenames if your actual project differs.*

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB Atlas account or a local MongoDB instance
- Postman for API testing

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd BookIT
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key
```

Replace the placeholder values with your own configuration. Do not commit your `.env` file or expose your database credentials or JWT secret.

### 4. Start the Server

For development:

```bash
npm run dev
```

For production-style startup:

```bash
npm start
```

The API runs at:

`http://localhost:5000`

## API Endpoints

All endpoints use the base URL:

`http://localhost:5000/api`

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a user |
| POST | `/auth/login` | Public | Log in and receive a JWT |

### Events

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/events` | Public | List upcoming events |
| GET | `/events?search=music` | Public | Search events by title |
| GET | `/events?venue=Pune` | Public | Filter events by venue |
| GET | `/events/:id` | Public | Get event details |
| POST | `/events` | Admin | Create an event |
| PUT | `/events/:id` | Admin | Update an event |
| DELETE | `/events/:id` | Admin | Delete an event |

### Bookings

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/bookings` | Authenticated user | Create a booking |
| GET | `/bookings/my` | Authenticated user | View personal bookings |
| PATCH | `/bookings/:id/cancel` | Booking owner | Cancel a booking |

## Authentication and Authorization

Protected endpoints require a valid JWT in the request header:

```http
Authorization: Bearer <YOUR_JWT_TOKEN>
```

Regular users can book events and manage their own bookings. Administrators can create, update, and delete events.

Newly registered accounts use the regular `user` role by default. Administrative access must be granted securely.

## Booking Business Rules

- Events must have a future date when created.
- The number of seats requested must be a positive integer.
- A booking cannot exceed the available seat capacity.
- Users can view their own bookings.
- Only the booking owner can cancel a booking.
- Cancelling a confirmed booking restores the reserved seats.
- A cancelled booking cannot be cancelled again.
- Events with existing bookings cannot be deleted.

## Error Handling

The API uses standard HTTP status codes, including:

| Status | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 400 | Invalid request or business-rule violation |
| 401 | Authentication required or invalid credentials/token |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 409 | Duplicate resource, such as an existing email |
| 500 | Internal server error |

## API Testing with Postman

The API is tested using Postman.

The collection includes requests organized into:

- **Auth:** User registration and login.
- **Events:** Event creation, listing, searching, retrieval, updating, and deletion.
- **Bookings:** Booking creation, personal booking history, and cancellation.

Configure the Postman environment with the following variables:

| Variable | Value |
|---|---|
| `baseUrl` | `http://localhost:5000` |
| `userToken` | JWT obtained from user login |
| `adminToken` | JWT obtained from administrator login |

Run the requests against a running server and verify both successful responses and error cases.

### Postman Deliverables

- Exported Postman collection JSON in the `postman/` directory.
- Published Postman API documentation: `https://documenter.getpostman.com/view/59017632/2sBYHSxLH2`

## Future Improvements

- Automated unit and integration tests.
- Pagination and sorting for event listings.
- Booking expiry and payment integration.
- Email notifications for booking confirmations and cancellations.
- Deployment with production-grade monitoring and logging.

## Author

**[Your Name]**

GitHub:(https://github.com/SohamGen17)

---

*This project was developed to demonstrate REST API development, database modeling, JWT authentication, role-based access control, and event booking workflows using Node.js and MongoDB.*
