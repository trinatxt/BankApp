import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/authcontext'; // Adjust path as needed
import { FaUser } from 'react-icons/fa';
import { RiLockPasswordFill } from 'react-icons/ri';
import { IoEyeSharp } from "react-icons/io5";

const LoginPage = () => {
  const { authenticate } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState(null); // State to manage login error

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!username.trim()) {
        setError('Please enter a username.');
        return;
      }
      if (!password.trim()) {
        setError('Please enter a password.');
        return;
      }

      const isAuthenticated = await authenticate(username, password);
      console.log('isAuthenticated:', isAuthenticated);

      if (isAuthenticated) {
        const redirectTo = location.state?.from?.pathname || '/profile';
        navigate(redirectTo);
      } else {
        setError('Invalid username or password. Please try again.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again later.');
    }
  };

  const handleSignUp = () => {
    navigate('/profilecreationpage'); // Redirect to sign up page
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="justify-center flex items-center min-h-screen">
      <div className="w-4/5 h-auto bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleLogin}>
          <h1 className="bg-5 mb-6 text-center text-3xl break-words rounded-3xl p-3">Tugharia Bank Login</h1>
          {error && (
            <p data-testid="error-message" className="text-red-500 text-center mb-4">{error}</p>
          )}
          <div className="relative w-4/5 mb-6 mx-auto flex-col items-center">
            <label className="block text-gray-700">Username</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={`w-full px-4 py-2 border rounded-full ${!error ? 'border-gray-300' : 'border-red-500'}`}
              />
            </div>
          </div>
          <div className="relative w-4/5 mb-6 mx-auto flex-col items-center">
            <label className="block text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full px-4 py-2 border rounded-full ${!error ? 'border-gray-300' : 'border-red-500'}`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer border-white text-xl"
                aria-label="toggle password visibility"
              >
                <IoEyeSharp />
              </button>
            </div>
            <div className="p-4 text-right">
              <a href="#" className="text-blue-500 hover:underline"></a>
            </div>
            
            <div className="flex justify-center items-center">
              <button type="submit" className="w-3/5 bg-5 text-white py-2 rounded-full hover:bg-6">
                Login
              </button>
            </div>
          </div>
          
          
          <div className="mt-4 text-center">
            <p>
              Don't have an account?{' '}
              <a onClick={handleSignUp} className="text-blue-500 hover:underline cursor-pointer">Sign up</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
