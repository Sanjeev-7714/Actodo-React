import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

// Main App Component
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(true);

  // Load users from localStorage on initial render
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(storedUsers);
    
    const loggedInUser = localStorage.getItem("currentUser");
    if (loggedInUser) {
      setCurrentUser(loggedInUser);
      setIsAuthenticated(true);
    }
    
    // Simulate loading for a smoother experience
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  // Save users to localStorage whenever users state changes
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // Register a new user
  const registerUser = (username, password) => {
    if (users.some(user => user.username === username)) {
      return false;
    }
    const newUser = { username, password, activities: [] };
    setUsers([...users, newUser]);
    return true;
  };

  // Login a user
  const loginUser = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(username);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", username);
      return true;
    }
    return false;
  };

  // Logout user
  const logoutUser = () => {
    setCurrentUser("");
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
  };

  // Add activity for current user
  const addActivity = (activity) => {
    const updatedUsers = users.map(user => {
      if (user.username === currentUser) {
        return {
          ...user,
          activities: [...user.activities, activity]
        };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  // Remove activity for current user
  const removeActivity = (activityToRemove) => {
    const updatedUsers = users.map(user => {
      if (user.username === currentUser) {
        return {
          ...user,
          activities: user.activities.filter(activity => activity !== activityToRemove)
        };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  // Get current user's activities
  const getCurrentUserActivities = () => {
    const user = users.find(u => u.username === currentUser);
    return user ? user.activities : [];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 border-solid mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-purple-700">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex justify-center items-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Routes>
            <Route 
              path="/" 
              element={isAuthenticated ? <Home 
                                          username={currentUser} 
                                          activities={getCurrentUserActivities()} 
                                          addActivity={addActivity} 
                                          removeActivity={removeActivity}
                                          logout={logoutUser} 
                                        /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/signup" 
              element={isAuthenticated ? <Navigate to="/" /> : <Signup registerUser={registerUser} />} 
            />
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/" /> : <Login loginUser={loginUser} />} 
            />
          </Routes>
        </motion.div>
      </div>
    </Router>
  );
}

// Home Component
function Home({ username, activities, addActivity, removeActivity, logout }) {
  const [newActivity, setNewActivity] = useState("");
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(null);
  const navigate = useNavigate();
  
  // Get current date
  const date = new Date();
  const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })}`;
  const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newActivity.trim() !== "") {
      addActivity(newActivity);
      setNewActivity("");
    }
  };

  // Handle activity removal with confirmation
  const handleRemove = (activity) => {
    removeActivity(activity);
    setShowRemoveConfirm(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-lg p-8 w-full"
    >
      <motion.h1 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-3xl font-bold mb-1"
      >
        Hello {username}!
      </motion.h1>
      <p className="text-gray-600 mb-6">I help you manage your activities :)</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-purple-500 text-white p-4 rounded-lg flex flex-col items-center justify-center"
        >
          <div className="text-3xl font-bold">23°</div>
          <div>Chennai</div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-red-500 text-white p-4 rounded-lg flex flex-col items-center justify-center"
        >
          <div className="text-xl font-bold">{formattedDate}</div>
          <div>{formattedTime}</div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-yellow-500 text-white p-4 rounded-lg flex flex-col items-center justify-center"
        >
          <div className="text-xl font-bold">Built Using</div>
          <div>React</div>
        </motion.div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Manage Activities</h2>
      
      <form onSubmit={handleSubmit} className="flex mb-6">
        <input
          type="text"
          value={newActivity}
          onChange={(e) => setNewActivity(e.target.value)}
          placeholder="Next Activity?"
          className="flex-grow border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
        />
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit" 
          className="bg-black text-white px-4 py-2 rounded-r hover:bg-gray-800 transition"
        >
          Add
        </motion.button>
      </form>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-purple-100 rounded-lg p-4 mb-6"
      >
        <h3 className="text-xl font-bold mb-2">Today's Activity</h3>
        {activities.length === 0 ? (
          <p>You haven't added anything yet</p>
        ) : (
          <ul className="space-y-2">
            {activities.map((activity, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm"
              >
                <span>{activity}</span>
                {showRemoveConfirm === activity ? (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleRemove(activity)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Confirm
                    </button>
                    <button 
                      onClick={() => setShowRemoveConfirm(null)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowRemoveConfirm(activity)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    Remove
                  </motion.button>
                )}
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
      
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={logout} 
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
      >
        Logout
      </motion.button>
    </motion.div>
  );
}

// Login Component
function Login({ loginUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() === "" || password.trim() === "") {
      setError("Please enter both username and password");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate a bit of loading for better UX
    setTimeout(() => {
      const loginSuccess = loginUser(username, password);
      if (!loginSuccess) {
        setError("Invalid username or password");
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-lg p-8 w-full"
    >
      <motion.h1 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-3xl font-bold mb-1"
      >
        Hey Hi 👋
      </motion.h1>
      <p className="text-gray-600 mb-6">I help you manage your activities after you login :)</p>
      
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-100 text-red-700 p-3 rounded-lg mb-4"
        >
          {error}
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit}>
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
          />
        </motion.div>
        
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
          />
        </motion.div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
          type="submit" 
          className="w-full bg-purple-500 text-white px-4 py-2 rounded mb-4 hover:bg-purple-600 transition flex justify-center items-center"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-solid"></div>
          ) : (
            "Login"
          )}
        </motion.button>
      </form>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Don't have an account? <Link to="/signup" className="text-purple-500 hover:underline">Sign Up</Link>
      </motion.p>
    </motion.div>
  );
}

// Signup Component
function Signup({ registerUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (username.trim() === "" || password.trim() === "" || confirmPassword.trim() === "") {
      setError("All fields are required");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate a bit of loading for better UX
    setTimeout(() => {
      // Register user
      const registrationSuccess = registerUser(username, password);
      if (registrationSuccess) {
        setSuccess(true);
        setError("");
        // Navigate to login after showing success message
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError("Username already exists");
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-lg p-8 w-full"
    >
      <motion.h1 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-3xl font-bold mb-1"
      >
        Hey Hi 👋
      </motion.h1>
      <p className="text-gray-600 mb-6">You can Signup here :)</p>
      
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-100 text-red-700 p-3 rounded-lg mb-4"
        >
          {error}
        </motion.div>
      )}
      
      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-green-100 text-green-700 p-3 rounded-lg mb-4"
        >
          Registration successful! Redirecting to login...
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit}>
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
          />
        </motion.div>
        
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
          />
        </motion.div>
        
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="confirm password"
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
          />
        </motion.div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading || success}
          type="submit" 
          className="w-full bg-yellow-500 text-white px-4 py-2 rounded mb-4 hover:bg-yellow-600 transition flex justify-center items-center"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-solid"></div>
          ) : (
            "Sign Up"
          )}
        </motion.button>
      </form>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Already have an account? <Link to="/login" className="text-yellow-500 hover:underline">Login</Link>
      </motion.p>
    </motion.div>
  );
}