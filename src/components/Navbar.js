import React, { useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { FaUserCircle } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './authcontext'; // Adjust path as needed
import logo from '../assets/tugharia.png'; // Adjust the path to where your image is located

import avatar1 from '../assets/avatar1.png';
import avatar2 from '../assets/avatar2.png';
import avatar3 from '../assets/avatar3.png';
import avatar4 from '../assets/avatar4.png';
import avatar5 from '../assets/avatar5.png';
import avatar6 from '../assets/avatar6.png';

const avatars = {
  'avatar1.png': avatar1,
  'avatar2.png': avatar2,
  'avatar3.png': avatar3,
  'avatar4.png': avatar4,
  'avatar5.png': avatar5,
  'avatar6.png': avatar6
};


const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleGoBack = () => {
    navigate('/');
  };

  // Determine which tab is currently active
  const isActiveTab = (path) => location.pathname === path;

  return (
    <div data-testid="NavbarLogo" className='relative w-full bg-8 py-4 px-6 flex items-center'>
      <Link to='/' className='flex items-center'>
        <img src={logo}
          alt='CloudBank Logo'
          className='h-12 max-w-[200px] object-contain cursor-pointer' // Adjust the size here
          />
      </Link>
      <div data-testid="PageHeaders" className='flex items-stretch flex-grow ml-8 space-x-4 h-full'>
        <Link
          to='/'
          className={`flex-1 text-center text-xl py-2 font-bold max-w-[150px] rounded-md ${isActiveTab('/') ? 'bg-6 text-white' : 'text-white'}`}
        >
          Home
        </Link>
        <Link
          to='/promotionpage'
          className={`flex-1 text-center text-xl py-2 font-bold max-w-[150px] rounded-md ${isActiveTab('/promotionpage') ? 'bg-6 text-white' : 'text-white'} h-full`}
        >
          Promotions
        </Link>
      </div>
      <div className='relative flex items-center space-x-1'>
        {user ? (
          <img
            src={avatars[user?.profile_pic] || avatars[0]} // Use user's avatar or default avatar
            alt="User Avatar"
            className="w-8 h-8 rounded-full cursor-pointer"
            data-testid="LoggedInProfileIcon"
            onClick={toggleDropdown}
          />
        ) : (
          <FaUserCircle size={25} className='text-white cursor-pointer' data-testid="NotLoggedInProfileIcon"/>
        )}
        <RiArrowDropDownLine
          className='text-white cursor-pointer'
          data-testid="DropDownMenu"
          size={25}
          onClick={toggleDropdown}
        />
        {user ? (
          <button onClick={handleLogout} className='bg-11 text-white font-bold py-2 px-4 rounded' data-testid="SignOut">
            Sign Out
          </button>
        ) : (
          <button onClick={handleLogin} className='bg-11 text-white font-bold py-2 px-4 rounded' data-testid="Login">
            Login
          </button>
        )}
      </div>
      {dropdownOpen && (
        <div className='absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10'>
          <ul className='list-none p-0'>
            <li className='font-bold text-lg p-4'>
              <Link
                to='/profile'
                className={location.pathname === '/profile' ? 'text-6 hover:bg-white hover:text-10' : 'text-6 hover:bg-white hover:text-10'}
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </Link>
            </li>
            <li className='font-bold text-lg p-4'>
              <Link
                to='/exchangehistorypage'
                className={location.pathname === '/exchangehistorypage' ? 'text-6 hover:bg-white hover:text-10' : 'text-6 hover:bg-white hover:text-10'}
                onClick={() => setDropdownOpen(false)}
              >
                Exchange History
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
