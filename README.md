# Holidaze
![image](https://github.com/user-attachments/assets/8b45b3ad-ea5b-4496-96df-3c1a1f00828e)

## Description 
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

## Contact
[LinkedIn](https://www.linkedin.com/in/mandeep-salhan-194422357/)

## Contributing

This project is primarily a personal, school-based project, you are welcome to explore and play around with it. If you find it interesting or useful for your learning, feel free to fork the repository and experiment with your ideas.

As this is a part of my academic coursework, I am not seeking contributions. However, any insights, suggestions, or feedback are always appreciated. If you have any, please feel free to reach out or open an issue in the repository for discussion.

Thank you for your interest and understanding!
## Credits and Acknowledgements

I would like to extend my gratitude and acknowledge the following resources and support that have been instrumental in the development of this project:

- **Bootstrap Icons**: The icons used in this project are sourced from [Bootstrap Icons](https://icons.getbootstrap.com/), which provided an excellent set of visuals to enhance the user interface.

- **Unsplash Images**: Many thanks to [Unsplash.com](https://unsplash.com/) for providing high-quality, royalty-free images that have been used throughout this project. The placeholder images and background visuals are particularly sourced from here.

- **Noroff Course Content**: Immense gratitude to the Noroff course content for providing the foundational knowledge and guidance throughout this project.

- **Classmates and Discord Server**: A special thanks to my classmates and the members of our Discord server for their continuous support, insights, and valuable discussions.
  
## Demo Link
https://holidazemks.netlify.app/
