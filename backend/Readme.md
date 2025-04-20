# Backend Documentation

## Overview
This backend is part of the **Hackathon Code Reviewer** project. It provides APIs and services to support the application's functionality, including user management, code review processing, and data storage.

## Features
- User authentication and authorization
- Code review submission and processing
- Integration with external APIs
- Database management and storage

## Technologies Used
- **Programming Language**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Other Tools**: Docker, ESLint, Prettier

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/hackathon-code-reviewer-backend.git
    cd hackathon-code-reviewer-backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and configure the following:
    ```
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4. Start the server:
    ```bash
    npm start
    ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user

### Code Review
- `POST /api/reviews` - Submit a code review
- `GET /api/reviews` - Fetch all code reviews
- `GET /api/reviews/:id` - Fetch a specific code review

### Users
- `GET /api/users` - Fetch all users
- `GET /api/users/:id` - Fetch a specific user

## Development

### Running in Development Mode
Use the following command to start the server in development mode:
```bash
npm run dev
```

### Linting and Formatting
- Run ESLint:
  ```bash
  npm run lint
  ```
- Format code with Prettier:
  ```bash
  npm run format
  ```

## Testing
Run unit tests using:
```bash
npm test
```

## Deployment
1. Build the Docker image:
    ```bash
    docker build -t hackathon-backend .
    ```
2. Run the container:
    ```bash
    docker run -p 3000:3000 hackathon-backend
    ```

## Contributing
Contributions are welcome! Please follow the [contribution guidelines](CONTRIBUTING.md).

## License
This project is licensed under the [MIT License](LICENSE).

## Contact
For any inquiries, please contact [your-email@example.com].