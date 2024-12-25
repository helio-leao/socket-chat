# Project Overview

This project implements a basic room chat using **Socket.io**.

---

## Design

**Unique room sign**

- The user can only access one room at a time. Changing the room will signoff the user on that previous room.

---

## Installation

1. Clone the repository.
2. Navigate to the project directory.
3. Run `npm install` to install the dependencies.
4. Run `npm run dev` to start the server.  
   To use this command it's necessary to have the .env file in the root of the project. Optionally, you can add a custom `PORT` variable to it. If not defined, the application will run on port 3000.

---

## Example Usage

Once the server is running, you can use the chat at `http://localhost:3000/`.
