import React from 'react';
import Navbar from './Navbar'; // Assuming Navbar component file path



const Wrapper = ({ children }) => {
  return (
    <div className="bg-3">
      <Navbar /> {/* Include Navbar component */}
      <div className="container mx-auto"> {/* Assuming Tailwind CSS for centering content */}
        {children}
      </div>
    </div>
  );
};

export default Wrapper;
