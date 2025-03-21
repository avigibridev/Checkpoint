
# Users Management Application

This is a full-stack application that allows you to manage users. It has both a backend and a frontend component:

- **Backend**: A Spring Boot application that handles user management (CRUD operations, user validation, email uniqueness) with retry logic with exponential backoff.
- **Frontend**: A React application that provides a user interface to create, view, and delete users.

## Features

- User creation with first name, last name, email, and password.
- User deletion.
- Email uniqueness validation on the backend.
- Validation of fields on the frontend before submission.
- Error handling with retry logic in case of failures.
- Display users in a table format with options to add and delete users.
- Backend user data is stored in a relational database (MySQL).

## Prerequisites

Before running the application, ensure you have the following software installed:

- Java 17 or later
- Maven
- Node.js and npm
- MySQL
- Spring Boot
- React

## Backend Setup

### Step 1: Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/avigibridev/Checkpoint.git
cd Checkpoint/backend
```

## Step 2: Configure Database

Set up your MySQL database. You can configure the database connection by editing `application.properties` under the `src/main/resources` folder.

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/admin_console
spring.datasource.username=root
spring.datasource.password=password
```

### **Start MySQL** 🛢️  
Make sure **MySQL** is running and create the database:  
```sql
sudo apt install mysql-server -y

sudo service mysql start

CREATE USER 'root'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

mysql -u root --password=password

CREATE DATABASE admin_console;
```

### Step 3: Build and Run the Backend

Ensure Maven is installed and run the following commands:(or stare java application from IDE)

1. Clean and package the application:

```bash
mvn clean install
```

2. Run the application:

```bash
mvn spring-boot:run
```

The backend will now be running on `http://localhost:8080`.

### Step 4: Test the Backend

You can test the following API endpoints:

- `POST /users`: Create a new user
- `GET /users`: Get all users
- `DELETE /users/{id}`: Delete a user by ID

The backend uses Spring Security for password hashing, and you can send requests to the endpoints using tools like Postman or any HTTP client.

---

## Frontend Setup

### Step 1: Clone the Frontend Repository

If you're setting up the frontend separately, clone the repository in a new directory:

```bash
git clone https://github.com/avigibridev/Checkpoint.git
cd Checkpoint/frontend
```

### Step 2: Install Dependencies

Install the required packages using npm or yarn:

```bash
npm install
```

### Step 3: Start the Frontend

Run the React application locally:

```bash
npm start
```

The frontend will now be running on `http://localhost:3000`. It will communicate with the backend at `http://localhost:8080` for all user management operations.

---

## Frontend Validation

The frontend uses the following validation:

- **First Name**, **Last Name**, **Email**, and **Password** are all required.
- **Email** must follow the email format (e.g., user@example.com).
- The "Add User" button is disabled until all fields are correctly filled out.

---

## Notes

1. **Retry Logic**: The backend uses retry logic with exponential backoff for operations that might fail due to temporary issues.
2. **Error Handling**: Both frontend and backend handle errors gracefully with proper messages.
3. **Toast Notifications**: The frontend uses `react-toastify` for showing success and error messages.
4. **Asynchronous Operations**: The frontend performs asynchronous operations for fetching users, creating, and deleting users with the help of React hooks and asynchronous API calls.

---

## Conclusion

This application allows efficient user management with validations and error handling. The backend performs validation for unique emails and securely handles passwords. The frontend provides an intuitive UI to create and manage users.

If you face any issues or need further assistance, feel free to raise an issue in the repository.

---
