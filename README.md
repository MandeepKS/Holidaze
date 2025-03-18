# Holidaze
![image](https://github.com/user-attachments/assets/8b45b3ad-ea5b-4496-96df-3c1a1f00828e)

Holidaze is an e-commerce platform where users can browse, book, and manage holiday venues. Venue managers can also create and manage their listings.

## Table of Contents

*   [Features](#features)
*   [Tech Stack](#tech-stack)
*   [Installation](#installation)
*   [Available Scripts](#available-scripts)
*   [API Usage](#api-usage)
*   [Development](#development)

## Features

*   User authentication (Login/Signup)
*   Venue listing with details (price, images, amenities, location, etc.)
*   Booking functionality
*   Admin panel for venue management
*   Responsive design for all devices

## Tech Stack

*   Frontend: React, React Router, Bootstrap
*   Backend: Uses external API endpoints (Noroff API)
*   State Management: React Context API

## Installation

To set up the project locally, follow these steps:

1.  Clone the repository
    ```bash
    git clone [https://github.com/your-username/holidaze.git](https://github.com/your-username/holidaze.git)
    ```

2.  Navigate to the project directory
    ```bash
    cd holidaze
    ```

3.  Install dependencies
    ```bash
    npm install
    ```

4.  Start the development server
    ```bash
    npm start
    ```
    This will run the app in development mode. Open http://localhost:3000 to view it in the browser.

## Available Scripts

In the project directory, you can run the following commands:

*   **Start the development server:**
    ```bash
    npm start
    ```
    Runs the app in development mode.

*   **Run tests:**
    ```bash
    npm test
    ```
    Launches the test runner in interactive watch mode.

*   **Build the project:**
    ```bash
    npm run build
    ```
    Builds the app for production in the `build` folder.

## API Usage

Holidaze interacts with external APIs for authentication, venue management, and booking.  The API endpoints are configured in the `api/endpoints.js` file.

**Example API Call: Fetching a User's Venues**

```javascript
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
````
## Development

To run the project in development mode or build it for production, use the following commands:
* **Run the project (development):**
     ```bash
    npm start
    ```
* **Build for production:**
   ```bash
     npm run build
    ```
## Demo Link
https://holidazemks.netlify.app/
