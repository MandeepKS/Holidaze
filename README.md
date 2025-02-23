# Holidaze

Holidaze is an e-commerce platform where users can browse, book, and manage holiday venues. Venue managers can also create and manage their listings.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [API Usage](#api-usage)
- [Development](#development)

## Features

- User authentication (Login/Signup)
- Venue listing with details (price, images, amenities, location, etc.)
- Booking functionality
- Admin panel for venue management
- Responsive design for all devices

## Tech Stack

- **Frontend:** React, React Router, Bootstrap
- **Backend:** Uses external API endpoints (Noroff API)
- **State Management:** React Context API

## Installation

To set up the project locally, follow these steps:

### 1. Clone the repository

```sh
git clone https://github.com/your-username/holidaze.git

2. Navigate to the project directory

cd holidaze

3. Install dependencies

npm install

4. Start the development server

npm start

This will run the app in development mode. Open http://localhost:3000 to view it in the browser.
Available Scripts

In the project directory, you can run:
Start the development server

npm start

Runs the app in development mode.
Run tests

npm test

Launches the test runner in interactive watch mode.
Build the project

npm run build

Builds the app for production in the build folder.
API Usage

Holidaze interacts with external APIs for authentication, venue management, and booking. The API endpoints are configured in the api/endpoints.js file.
Example API Call: Fetching a User's Venues

const url = apiEndpoints(undefined, name).profileVenues;
const response = await fetch(url, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-Noroff-API-Key': 'your-api-key',
    'Content-Type': 'application/json',
  },
  mode: "cors",
});

Development
Run the project

npm start

Build for production

npm run build