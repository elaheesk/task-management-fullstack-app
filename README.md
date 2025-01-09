Task Management Application

Overview
This is a full-stack Task Management application built with the following technologies:

Frontend: React (with TypeScript) and MUI for styling
Backend: Node.js, Express.js
Database: PostgreSQL
The application includes features such as:

Viewing, adding, editing, and deleting tasks.
Associating tasks with tags.
File upload functionality.
Project Structure
The project is divided into two main folders:

frontend/: Contains the React code for the user interface.
backend/: Contains the Node.js and Express.js code for the server and API.
Prerequisites

Make sure you have the following installed on your system:
Node.js
PostgreSQL
npm or yarn
Getting Started
1. Clone the Repository
git clone https://github.com/elaheesk/task-management-fullstack-app
cd task-management-fullstack-app
2. Setup the Backend
1.Navigate to the backend/ folder:
cd backend
2.Install dependencies:
npm install
3.Create a .env file in the backend/ directory with the following variables:
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<your-database-name>
PORT=5000
4.Start the PostgreSQL server and create a database for the project:
CREATE DATABASE task_management;
5.Run database migrations (if any) or initialize the tables manually:
CREATE TABLE tasks (
    taskId SERIAL PRIMARY KEY,
    taskName VARCHAR(255),
    date DATE,
    rankTask VARCHAR(10),
    tagId INTEGER
);

CREATE TABLE task_files (
    fileId SERIAL PRIMARY KEY,
    taskId INTEGER REFERENCES tasks(taskId) ON DELETE CASCADE,
    filePath VARCHAR(255),
    fileName VARCHAR(255),
    fileType VARCHAR(50),
    fileSize INTEGER
);
6. Start the backend server:
npm start

3. Setup the Frontend
1.Navigate to the frontend/ folder:
cd ../frontend
2.Install dependencies:
npm install
3. Create a .env file in the frontend/ directory with the following variables:
 REACT_APP_API_URL=http://localhost:5000
4.Start the frontend development server:
 npm start

Running the Application
1.Ensure that:
The backend server is running at http://localhost:5000.
The PostgreSQL database is up and running.
The frontend server is running at http://localhost:3000.
2.Open the browser and navigate to http://localhost:3000 to view the application.

Features
Frontend
Task Management: Create, edit, delete tasks with an intuitive UI.
File Uploads: Attach files to tasks and manage them.
Responsive Design: Styled with MUI for a modern and responsive layout.
Backend
Express.js API: RESTful API endpoints to interact with the PostgreSQL database.
Database Relationships: Uses foreign key constraints for file-task associations.



