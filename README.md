# Subscription Tracker API

A backend API for a subscription tracker application, allowing users to manage their subscriptions and receive reminders for upcoming renewals.

## Features

- **User Authentication:** Secure user sign-up, sign-in, and sign-out.
- **User Management:** Basic CRUD operations for users.
- **Subscription Management:** Create, read, update, and delete subscriptions.
- **Renewal Reminders:** Automatically send reminders for upcoming subscription renewals.
- **Secure:** Uses Arcjet for rate limiting and bot protection.

## Tech Stack

- **Node.js:** JavaScript runtime environment.
- **Express:** Web framework for Node.js.
- **MongoDB:** NoSQL database.
- **Mongoose:** ODM for MongoDB.
- **JSON Web Tokens (JWT):** For user authentication.
- **bcryptjs:** For password hashing.
- **Nodemailer:** For sending emails.
- **Upstash Workflow:** For scheduling and running workflows.
- **Arcjet:** For security and rate limiting.
- **Day.js:** For date and time manipulation.

## Installation and Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/subscription-tracker.git
    cd subscription-tracker
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    EMAIL_HOST=your_email_host
    EMAIL_PORT=your_email_port
    EMAIL_USER=your_email_user
    EMAIL_PASS=your_email_password
    ARCJET_KEY=your_arcjet_key
    UPSTASH_TOKEN=your_upstash_token
    UPSTASH_URL=your_upstash_url
    ```

4.  **Start the server:**

    ```bash
    npm start
    ```

    For development with auto-reloading:

    ```bash
    npm run dev
    ```

## API Endpoints

### Authentication

- `POST /api/v1/auth/sign-up`: Register a new user.
- `POST /api/v1/auth/sign-in`: Log in a user.
- `POST /api/v1/auth/sign-out`: Log out a user.

### Users

- `GET /api/v1/users`: Get all users.
- `GET /api/v1/users/:id`: Get a single user by ID (requires authentication).
- `POST /api/v1/users`: Create a new user.
- `PUT /api/v1/users/:id`: Update a user by ID.
- `DELETE /api/v1/users/:id`: Delete a user by ID.

### Subscriptions

- `GET /api/v1/subscriptions`: Get all subscriptions.
- `GET /api/v1/subscriptions/:id`: Get a single subscription by ID.
- `POST /api/v1/subscriptions`: Create a new subscription (requires authentication).
- `PUT /api/v1/subscriptions/:id`: Update a subscription by ID.
- `DELETE /api/v1/subscriptions/:id`: Delete a subscription by ID.
- `GET /api/v1/subscriptions/user/:id`: Get all subscriptions for a user (requires authentication).
- `PUT /api/v1/subscriptions/:id/cancel`: Cancel a subscription.
- `GET /api/v1/subscriptions/:id/upcoming-renewals`: Get upcoming renewals for a subscription.

### Workflows

- `POST /api/v1/workflows/subscription/reminder`: Send subscription reminders.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature`).
6.  Open a pull request.

## License

This project is licensed under the MIT License.

