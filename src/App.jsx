// import './App.css'
// import { Routes, Route } from 'react-router-dom';
// import LoginSignup from "./components/loginSignup/LoginSignup"
// import Home from './Dashboard';
// function App() {

//   return (
//     <Routes>
//     <Route path="/" element={<LoginSignup />} />
//     <Route path="/home" element={<Home />} />
//   </Routes>
//   )
// }

// export default App
// client/src/App.js
import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginSignup from "./components/loginSignup/LoginSignup"
import Dashboard from "./Dashboard"  // The newly renamed Bolt code

function App() {
  const navigate = useNavigate();

  // Handler for logout
  const handleLogout = () => {
    // Clear tokens
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    // Navigate to login
    navigate('/');
  };

  return (
    <Routes>
      {/* Auth screen */}
      <Route path="/" element={<LoginSignup />} />

      {/* Dashboard route */}
      <Route
        path="/home"
        element={
          <Dashboard
            onLogout={handleLogout}
          />
        }
      />
    </Routes>
  )
}

export default App
