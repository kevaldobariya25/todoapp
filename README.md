# Todo List Management System

A simple Todo List Management System built with Node.js. This application allows you to manage your tasks by adding and deleting, and importing/exporting tasks via CSV files.

## Features

- Add new todos
- Mark todos as complete or pending
- Delete todos
- Download todos as a CSV file
- Upload todos from a CSV file

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed
- MongoDB installed and running

## Getting Started

Follow these steps to set up and run the project on your local machine:

1. **Install dependencies**
   ````
   npm install
   ````
2. **Set up environment variables**

    Create a ".env" file in the root directory of the project and add your mongodb database's URL:
    ````
    MONGO_URI='your mongodb database URL'
    ````
3. **Run the server**
    ````
    npm start
    ````
