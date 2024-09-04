import React from 'react';
import { useNavigate } from 'react-router-dom';
import airline1 from '../assets/airline1.png';
import airline2 from '../assets/airline2.png';
import airline3 from '../assets/airline3.png';
import airline4 from '../assets/airline4.png';
import airline5 from '../assets/airline5.png';
import airline6 from '../assets/airline6.png';

const Partners = () => {
  const navigate = useNavigate();

  const airlines = [
    { name: 'Airline 1', code: 'GJP', image: airline1 },
    { name: 'Airline 2', code: 'IPM', image: airline2 },
    { name: 'Airline 3', code: 'EAG', image: airline3 },
    { name: 'Airline 4', code: 'QAQ', image: airline4 },
    { name: 'Airline 5', code: 'CXC', image: airline5 },
    { name: 'Airline 6', code: 'MR', image: airline6 },
  ];

  const handleClick = (airlineCode) => {
    navigate('/exchangepop1', { state: { airlineCode } });
  };

  return (
    <main>
      <div data-testid="partners" className='max-w-[1000px] m-auto py-16 px-4'>
        <h3 className='text-5xl md:text-5xl font-bold mb-8 text-center'>Partners</h3>
        <div className='flex flex-wrap justify-center gap-4'>
          {airlines.map((airline, index) => (
            <div key={index} className='relative border border-gray-300 rounded-lg overflow-hidden w-1/3 bg-white'>
              <div className='relative pt-[75%]'>
                <img className='absolute inset-0 object-cover w-full h-full' src={airline.image} alt={airline.name} />
              </div>
              <button 
                onClick={() => handleClick(airline.code)} 
                className='bg-grey text-black px-3 py-1 rounded shadow w-full block mt-0'
                style={{ marginTop: '0' }}
              >
                Select
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Partners;
