import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/authcontext'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom';
import avatar1 from '../assets/avatar1.png'; // Default avatar
import avatar2 from '../assets/avatar2.png';
import avatar3 from '../assets/avatar3.png';
import avatar4 from '../assets/avatar4.png';
import avatar5 from '../assets/avatar5.png';
import avatar6 from '../assets/avatar6.png';
import axios from 'axios';
import { IoEyeSharp } from "react-icons/io5";

const avatars = [
  { name: 'avatar1.png', src: avatar1 },
  { name: 'avatar2.png', src: avatar2 },
  { name: 'avatar3.png', src: avatar3 },
  { name: 'avatar4.png', src: avatar4 },
  { name: 'avatar5.png', src: avatar5 },
  { name: 'avatar6.png', src: avatar6 },
];

// Function to validate the password
const validatePassword = (password) => {
  const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
  return passwordPolicy.test(password);
};

const EditProfilePage = () => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [user_id, setUserid] = useState('');
  const [email, setEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [avatarURL, setAvatarURL] = useState('');
  const [password, setPassword] = useState(''); // Current password
  const [newPassword, setNewPassword] = useState(''); // New password
  const [confirmPassword, setConfirmPassword] = useState(''); // Confirm new password
  const [passwordError, setPasswordError] = useState(''); // State for password errors
  const [updateError, setUpdateError] = useState(''); // State for update errors
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const [newPasswordVisible, setNewPasswordVisible] = useState(false); // State for new password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // State for confirm password visibility
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setUsername(user.username);
      setUserid(user.user_id);
      setEmail(user.email);

      // Initialize avatar selection
      const userAvatar = user.profile_pic || 'avatar1.png'; // Default to avatar1 if no avatar is set
      const avatar = avatars.find(avatar => avatar.name === userAvatar);

      if (avatar) {
        setSelectedAvatar(avatar.name);
        setAvatarURL(avatar.src);
      } else {
        setSelectedAvatar(userAvatar); // Treat as custom avatar
        setAvatarURL(userAvatar);
      }
    }
  }, [user]);

  const handleSave = async () => {
    if (newPassword && !validatePassword(newPassword)) {
      setPasswordError('New password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    try {
      // Verify the current password
      const authResponse = await axios.post('http://weloveesc.xukaiteo.com:8001/user/auth/', {
        username,
        password
      });

      if (authResponse.status === 200) {
        // Password is correct, proceed with the update
        const payload = {
          first_name: firstName,
          last_name: lastName,
          verified: true,
          user_id,
          email,
          username,
          profile_pic: selectedAvatar || avatarURL, // Use the selected avatar or current avatar URL if none is selected
          password: newPassword // Include new password if provided
        };

        try {
          const response = await axios.post('http://weloveesc.xukaiteo.com:8001/user/edit_user', payload);
          if (response.status === 200) {
            console.log('Profile updated successfully:', response.data);
            navigate('/profile'); // Redirect to the profile page after saving
          } else {
            console.error('Failed to update profile:', response.status, response.data);
            setUpdateError('Failed to update profile. Please try again.');
          }
        } catch (error) {
          console.error('Error updating profile:', error.response ? error.response.data : error.message);
          setUpdateError('Error updating profile. Please try again.');
        }
      } else {
        setPasswordError('Incorrect password. Please try again.');
      }
    } catch (error) {
      setPasswordError('Error verifying password. Please try again.');
    }
  };

  const handleRemoveAvatar = () => {
    setSelectedAvatar('');
    setAvatarURL(avatar1); // Reset to default avatar1
  };

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleNewPasswordVisibility = () => setNewPasswordVisible(!newPasswordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

  return (
    <div className="bg-3 min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
      <div className="flex mb-8 items-center">
        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-8 mr-8">
          <img
            src={avatarURL}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Choose Avatar</h2>
          <div className="flex mb-4">
            {avatars.map((avatar) => (
              <img
                key={avatar.name}
                src={avatar.src}
                alt={avatar.name}
                className={`w-16 h-16 rounded-full mr-2 cursor-pointer ${selectedAvatar === avatar.name ? 'border-4 border-blue-500' : ''}`}
                onClick={() => {
                  setSelectedAvatar(avatar.name);
                  setAvatarURL(avatar.src);
                }}
              />
            ))}
            {selectedAvatar && (
              <button
                onClick={handleRemoveAvatar}
                className="ml-4 py-2 px-4 rounded-md bg-7 text-white hover:bg-9"
              >
                Remove Avatar
              </button>
            )}
          </div>
          <h2 className="text-xl font-semibold mb-4">Update Information</h2>
          <div className="error-container">
            {passwordError && (
              <div className="text-red-500 mb-4">
                {passwordError}
              </div>
            )}
            {updateError && (
              <div className="text-red-500 mb-4">
                {updateError}
              </div>
            )}
          </div>
          <label className="block mb-4 input-container">
            <span className="text-gray-700">First Name</span>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </label>
          <label className="block mb-4 input-container">
            <span className="text-gray-700">Last Name</span>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </label>
          <label className="block mb-4 input-container">
            <span className="text-gray-700">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </label>
          <label className="block mb-4 input-container relative">
            <span className="text-gray-700">Current Password</span>
            <div className="relative">
              <input
                type={passwordVisible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer border-transparent text-xl"
                aria-label="toggle password visibility"
              >
                <IoEyeSharp />
              </button>
            </div>
          </label>
          <label className="block mb-4 input-container relative">
            <span className="text-gray-700">New Password</span>
            <div className="relative">
              <input
                type={newPasswordVisible ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm pr-10"
              />
              <button
                type="button"
                onClick={toggleNewPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer border-transparent text-xl"
                aria-label="toggle new password visibility"
              >
                <IoEyeSharp />
              </button>
            </div>
          </label>
          <label className="block mb-4 input-container relative">
            <span className="text-gray-700">Confirm New Password</span>
            <div className="relative">
              <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm pr-10"
              />
              <button
                type="button"
                onClick={ toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer border-transparent text-xl"
                aria-label="toggle confirm password visibility"
              >
                <IoEyeSharp />
              </button>
            </div>
          </label>
          <div className="flex mt-4">
            <button
              onClick={handleSave}
              className="py-2 px-4 rounded-md bg-7 text-white hover:bg-9 mr-4"
            >
              Save
            </button>
            <button
              onClick={() => navigate('/profile')} // Add your cancel functionality here
              className="py-2 px-4 rounded-md bg-gray-500 text-white hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
