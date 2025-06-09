apk: https://drive.google.com/file/d/1p7TqlNBZnufAQntEKVY5yj9-gVKat0Yj/view?usp=drivesdk

A feature-rich task management application built with React Native, Redux, and JWT authentication, with Firebase Google Sign-In integration.

Features
User Authentication

Firebase Google Sign-In

JWT token-based session management

Protected routes

User profile management

Task Management

Create, read, update, and delete tasks

Task categorization (Today, Tomorrow, Upcoming, Overdue)

Priority levels (High, Medium, Low)

Status tracking (Todo, In Progress, Done)

Due date management

Task search and filtering

Notifications

Push notifications for due tasks
Swipable Lists

Scheduled reminders (today and tomorrow)

Automatic notification cancellation for completed tasks

UI/UX

Clean, intuitive interface

Task categorization with visual indicators

Responsive design for all screen sizes

Loading states and empty state handling

Technologies Used
Frontend

React Native

React Navigation

Redux Toolkit

Axios for API calls

React Native Vector Icons

Backend

Node.js

Express.js

MongoDB

JWT Authentication

Services

Firebase Authentication (Google Sign-In)

React Native Push Notifications

Installation
Prerequisites
Node.js (v14 or later)

npm or yarn

React Native development environment setup

Android Studio/Xcode for emulators

Steps
Clone the repository:

bash
git clone //copy the url
cd task-management-app
Install dependencies:

bash
npm install
# or
yarn install
Set up Firebase:

Create a Firebase project

Enable Google Sign-In method

Add your google-services.json (Android) and GoogleService-Info.plist (iOS) files

Configure environment variables:
Create a .env file in the root directory with your backend API URL:

text
API_BASE_URL=https://backend-taskmanagement-k0md.onrender.com/api/auth
Run the app:

bash
npx react-native run-android
# or
npx react-native run-ios
API Endpoints
The app communicates with a backend API that provides the following endpoints:

POST /api/auth/google - Google authentication

GET /api/auth/tasks - Get all tasks (with filtering)

POST /api/auth/tasks - Create a new task

PUT /api/auth/tasks/:id - Update a task

DELETE /api/auth/tasks/:id - Delete a task

All endpoints (except authentication) require a valid JWT token in the Authorization header.

Screens
Login Screen - Google Sign-In

Dashboard - Task overview with categories

Task Detail - View and edit task details

Create Task - Form for new task creation

Profile - User profile information

Security Features
JWT token storage in Redux (client-side)

Token expiration handling

Protected routes

Input validation

Secure API calls with authorization headers

Push Notifications
The app implements local push notifications to remind users about:

Tasks due today (morning reminder)

Tasks due tomorrow (evening reminder)

Notifications are automatically canceled when tasks are marked as complete

Folder Structure
text
/src
  /components      # Reusable components
    CreateTodo.js  # Task creation form
    Filter.js      # Task filtering component
    Loading.js     # Loading indicator
    UpdateTask.js  # Task edit modal
  /redux          # Redux store and slices
  /screens        # Main app screens
  /utils          # Utility functions
App.js            # Main app component




License
MIT License
