# Event Planner Frontend

**Event Planner Frontend** is a React application that allows users to view events, RSVP, and post comments. It connects to a backend API to manage users, events, RSVPs, and comments.

---

## Group Members
Muema, Brian
Matara, Edwin
Ngaruiya, Victorious
Ondari, Gidion
Hadi, Mohamed(Scrum Master)

---

## Features

- User authentication (login)  
- View list of events  
- View event details, including images, date, location  
- RSVP to events (Going, Maybe, Not Going)  
- Post and view comments on events  
- Responsive UI for desktops and mobile  

---

## Technologies

- React 18+  
- React Router v6  
- Context API for authentication state  
- Bootstrap 5 for styling  
- Fetch API for backend integration  
- Git for version control  

---

## Getting Started

### Prerequisites

- Node.js (v16+)  
- npm or yarn  

### Installation

```bash
# Clone the repository
git clone <FRONTEND_REPO_URL>
cd EventPlannerFE

# Install dependencies
npm install
```

### Running the App

```bash
# Start the development server
npm start
```

The app will run at [http://localhost:3000](http://localhost:3000) by default.  



---

## Available Scripts

- `npm start` – runs the app in development mode  
- `npm build` – builds the app for production  
- `npm test` – runs tests (if implemented)  

---

## Configuration

Create a `src/config.js` file with your backend API URL:

```javascript
export const API_URL = "http://127.0.0.1:5000"; // or your deployed backend URL
```

---

## Usage

1. Open the app in the browser.  
2. Login or create a user (depending on backend).  
3. Browse events on the home page.  
4. Click an event to see details, RSVP, and add comments.  
5. Navigate to your profile to see your information (if implemented).  

---

## Contributing

1. Fork the repository  
2. Create a branch (`git checkout -b feature-name`)  
3. Make your changes  
4. Commit your changes (`git commit -m "Add feature"`)  
5. Push to the branch (`git push origin feature-name`)  
6. Open a pull request  

---

## License

This project is licensed under the MIT License.