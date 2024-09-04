import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/authcontext'; // Ensure this path is correct
import { IoEyeSharp } from 'react-icons/io5';

const ProfileCreationPage = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate(); 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [verifyPasswordError, setVerifyPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [serverError, setServerError] = useState('');
  const [duplicateError, setDuplicateError] = useState(''); // State for duplicate username or email

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
    return passwordPolicy.test(password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleVerifyPasswordVisibility = () => {
    setShowVerifyPassword(!showVerifyPassword);
  };

  const handleClick = async () => {
    // Client-side validation
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      valid = false;
    } else {
      setEmailError('');
    }
    
    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character");
      valid = false;
    } else {
      setPasswordError('');
    }

    if (password !== verifyPassword) {
      setVerifyPasswordError("Passwords do not match");
      valid = false;
    } else {
      setVerifyPasswordError('');
    }  

    if (!valid) return;

    // If all validations pass, proceed with user creation
    try {
      const userData = {
        first_name: firstName,
        last_name: lastName,
        email,
        username,
        password
      };
  
      const response = await fetch('http://weloveesc.xukaiteo.com:8001/user/add_user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Parse error response
        let errorMessage = 'Unknown error occurred';
  
        if (response.status === 400) {
          if (errorData.detail && Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map(err => err.msg).join(', ');
          } else {
            errorMessage = errorData.detail;
          }
          if (errorData.detail === 'Username or email already exists') {
            setDuplicateError(errorData.detail); // Set duplicateError state for UI display
            setServerError(''); // Clear serverError if duplicateError is set
          } else {
            setDuplicateError(''); // Clear duplicateError if serverError is set
            setServerError(errorMessage); // Set serverError state for UI display
          }
        } else if (response.status === 500) {
          errorMessage = errorData.detail || 'Server error occurred';
          setServerError(errorMessage); // Set serverError state for UI display
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return;
      }
  
      const data = await response.json();
      console.log('User creation successful:', data);
  
      // Assuming signUp function updates the authenticated user state
      signUp(userData);
  
      // Redirect or navigate to the profile page
      navigate('/profile');
    } catch (error) {
      console.error('Error creating user:', error.message);
      setServerError(`Error: ${error.message}`); // Set serverError state for UI display
    }
  };
  
  const handleLogin = () => {
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-10">
      <div className="w-4/5 h-auto bg-white p-8 rounded-lg shadow-md">
        <form>
          <h1 className="bg-6 mb-6 text-white text-center text-3xl break-words rounded-3xl p-3">Create Profile</h1>
          <div className="relative w-3/5 mb-6 mx-auto flex flex-col items-center">
            <p className="block text-gray-700 text-left w-full">First Name</p>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={"w-full px-3 py-2 border rounded-full"}
              required
            />
          </div>
          <div className="relative w-3/5 mb-6 mx-auto flex flex-col items-center">
            <p className="block text-gray-700 text-left w-full">Last Name</p>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={"w-full px-3 py-2 border rounded-full"}
              required
            />
          </div>
          <div className="relative w-3/5 mb-6 mx-auto flex flex-col items-center">
            <p className="block text-gray-700 text-left w-full">Email</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-full ${emailError ? 'border-red-500' : ''}`}
              required
            />

            {emailError && (
              <p className="text-red-500 text-xs italic">{emailError}</p>
            )}

          </div>
          <div className="relative w-3/5 mb-6 mx-auto flex flex-col items-center">
            <p className="block text-gray-700 text-left w-full">Username</p>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-3 py-2 border rounded-full ${duplicateError ? 'border-red-500' : ''}`}
              required
            />
          </div>
          <div className="relative w-3/5 mb-6 mx-auto flex flex-col items-center">
            <p className="block text-gray-700 text-left w-full">Password</p>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-full ${passwordError ? 'border-red-500' : ''}`}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer text-2xl border-none"
                aria-label="toggle password visibility"
              >
                <IoEyeSharp />
              </button>
            </div>

            {passwordError && (
              <p className="text-red-500 text-xs italic">{passwordError}</p>
            )}

          </div>  
          <div className="relative w-3/5 mb-6 mx-auto flex flex-col items-center">
            <p className="block text-gray-700 text-left w-full">Verify Password</p>
            <div className="relative w-full">
              <input
                type={showVerifyPassword ? "text" : "password"}
                placeholder="Verify Password"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-full ${verifyPasswordError ? 'border-red-500' : ''}`}
                required
              />
              <button
                type="button"
                onClick={toggleVerifyPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer text-2xl border-none"
                aria-label="toggle verify password visibility"
              >
                <IoEyeSharp />
              </button>
            </div>

            {verifyPasswordError && (
              <p className="text-red-500 text-xs italic text-left">{verifyPasswordError}</p>
            )}

          {serverError && (
            <div className="text-red-500 mb-6">{serverError}</div>
          )}
          {duplicateError && (
            <div className="text-red-500">{duplicateError}</div>
          )}
          </div>  
          
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={handleClick}
              className="w-2/5 px-4 py-2 text-white bg-5 hover:bg-6 rounded-full focus:outline-none focus:shadow-outline"
            >
              Create Profile
            </button>
            <p className="mt-4 text-sm text-blue-600 hover:underline cursor-pointer" onClick={handleLogin}>
              Already have an account? Log in here.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileCreationPage;
