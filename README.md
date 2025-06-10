# Billboard - A Modern Note-Taking Application

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A minimalist and elegant note-taking application inspired by the classic corkboard. After logging in with a Google or GitHub account, users can create, edit, and visually organize their notes on a drag-and-drop billboard. The application is built with Node.js, Express, and MongoDB and features a dynamic and customizable user interface.

## Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [Built With](#built-with)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Testing](#testing)
- [Contact](#contact)

---

### About The Project

Billboard was designed to be more than just a standard to-do list. It recreates the satisfying feeling of a physical corkboard where you can freely place and arrange your ideas. Users can write detailed notes using Markdown, customize the look of their workspace, and organize their thoughts with a simple and intuitive category system. The position of every note is saved, so your board always looks just the way you left it.

This project demonstrates a complete full-stack development cycle, from back-end logic and database management to creating an interactive and responsive user interface.

---

### Key Features

- **Secure User Authentication:** Log in seamlessly with Google or GitHub accounts using Passport.js.
- **Rich Note-Taking:** Create, edit, and delete notes with full Markdown support for rich text formatting.
- **Interactive Billboard:** A dynamic drag-and-drop interface allows you to visually organize notes. Your layout is saved automatically.
- **Personalization:**
  - Light & Dark mode support for the entire application.
  - User-defined colors for note backgrounds and fonts.
- **Organization & Filtering:** Assign categories to notes and use the search bar and filter dropdown to find information quickly.
- **User Dashboard:** A welcoming dashboard that presents usage statistics or a getting-started guide.
- **RESTful API:** A back-end API to handle all note and user preference operations.

---

### Built With

This project leverages a modern set of technologies:

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** Passport.js (Google OAuth 2.0, GitHub OAuth 2.0), Express Session, Connect-Mongo
- **Templating:** EJS (Embedded JavaScript)
- **Frontend:** Vanilla JavaScript (ES6+), CSS3 with Custom Variables, Font Awesome, Devicon
- **Markdown:** `marked.js` for parsing & `sanitize-html` for security
- **Development:** `nodemon` for live-reloading, `dotenv` for environment management
- **Testing:** Mocha, Chai, Supertest

---

### Getting Started

Follow these steps to get a local copy of the project up and running on your machine.

1.  **Prerequisites**

    You must have [Node.js](https://nodejs.org/) (which includes npm) and [MongoDB](https://www.mongodb.com/try/download/community) installed and running on your machine.

2.  **Installation & Setup**

    1.  Clone the repository:
        ```sh
        git clone [https://github.com/Rolens1/notetaking.git](https://github.com/Rolens1/notetaking.git)
        ```
    2.  Navigate into the project directory:
        ```sh
        cd note_taking_app
        ```
    3.  Install all dependencies and devDependencies:
        ```sh
        npm install
        ```
    4.  Create a `.env` file in the root directory. Copy the content from the example below and fill in your own secret keys and database URL.

        ```env
        # Server Port
        PORT=3000

        # MongoDB Connection String
        MONGODB_URI=mongodb://localhost:27017/billboard_db

        # Session Secret (use a long, random string)
        SESSION_SECRET=replace_this_with_a_very_long_random_string

        # Google OAuth Credentials
        GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
        GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

        # GitHub OAuth Credentials
        GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID
        GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET
        ```

---

### Usage

Once setup is complete, you can launch the application.

- **To run in development mode (with auto-restart):**

  ```sh
  npm run dev
  ```

- **To run for production:**
  `sh
npm start
`
  Open [http://localhost:3000](http://localhost:3000) in your browser to choose one of the two login services. And after logging in you will be redirected to the dashboard and ready to use the app.

---

### Testing

This project uses **Mocha**, **Chai**, and **Supertest** for API endpoint testing.

The test setup is configured to bypass the `isLoggedIn` authentication middleware by automatically setting `NODE_ENV=test` when you run the test command. This allows for direct testing of the protected endpoints.

> **:warning: CRITICAL WARNING**
>
> Running the test suite will **completely delete all notes** in the database that is specified in your `.env` file. This is done to ensure that each test runs in a clean, isolated environment.
>
> **NEVER run tests against a production database.** It is highly recommended to use a separate database connection string for testing.

To run the entire test suite, ensure you have installed all dependencies (including devDependencies) with `npm install`, then run:

```sh
npm test
```
