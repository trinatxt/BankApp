import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/authcontext';

function ExchangePop1() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const airlineCode = location.state?.airlineCode || '';

  const [enteredCardName, setEnteredCardName] = useState('');
  const [membershipId, setMembershipID] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('User object:', user);
  }, [user]);

  const firstName = user?.first_name || '';
  const lastName = user?.last_name || '';
  const fullName = `${firstName} ${lastName}`;

  const regexPattern = (airline_code) => {
    const patterns = {
      'GJP': /^\d{10}(\d{6})?$/,
      'IPM': /^\d{10}$/,
      'EAG': /^\d{12}$/,
      'QAQ': /^\d{10}$/,
      'CXC': /^\d{9}$/,
      'MR': /^\d{9}[A-Za-z]$/,
    };
    return patterns[airline_code.toUpperCase()] || /./; 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      setError('You must be logged in to validate card name.');
      navigate('/login');
      return;
    }

    try {
      const isCardNameValid = enteredCardName === fullName;
      const isMembershipIdValid = regexPattern(airlineCode).test(membershipId);

      console.log('Entered card name:', enteredCardName);
      console.log('Full name for validation:', fullName);
      console.log('Membership ID:', membershipId);
      console.log('Validation pattern:', regexPattern(airlineCode));
      console.log('Card name valid:', isCardNameValid);
      console.log('Membership ID valid:', isMembershipIdValid);

      if (isCardNameValid && isMembershipIdValid) {
        navigate('/exchangepop2', { state: { membershipId, airlineCode } });
      } else if (!isCardNameValid) {
        setError('The card name does not match the registered details.');
      } else if (!isMembershipIdValid) {
        setError('Membership ID does not match the required pattern.');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      setError('Submission failed. Please try again later.');
    }
  };

  const handleIDVerification = (event) => {
    const { value } = event.target;
    setMembershipID(value);
    const isValidInput = regexPattern(airlineCode).test(value);
    setIsValid(isValidInput);
    console.log('Input change:', value, 'Valid:', isValidInput);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 w-full max-w-lg bg-white rounded-lg shadow-md">
        <ExchangeForm 
          handleSubmit={handleSubmit} 
          enteredCardName={enteredCardName} 
          setEnteredCardName={setEnteredCardName} 
          membershipId={membershipId} 
          handleIDVerification={handleIDVerification} 
          isValid={isValid} 
          error={error}
        />
      </div>
    </div>  
  );
}

const ExchangeForm = ({ handleSubmit, enteredCardName, setEnteredCardName, membershipId, handleIDVerification, isValid, error }) => {
  return (
    <div className="w-full flex flex-col items-center">
      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
        <h1 className="w-4/5 text-3xl text-center bg-5 rounded-full p-2 mb-4">
          Exchange your miles
        </h1>
        <h3 className="w-2/5 text-center mb-4">
          Please link your account
        </h3>
        {error && <p className="text-red-500">{error}</p>}        
        <div className="w-4/5 flex flex-col text-left mb-4">
          <label htmlFor="membershipId" className="text-lg font-semibold mb-2">Membership ID</label>
          <input
            type="text"
            id="membershipId"
            value={membershipId}
            onChange={handleIDVerification}
            placeholder="Enter your ID for your Loyalty Program"
            className={`border ${isValid ? 'border-gray-400' : 'border-red-500'} p-2 rounded-lg`}
            required
          />
          <label htmlFor="cardname" className="text-lg font-semibold mb-2">Name on Card</label>
          <input
            type="text"
            id="cardname"
            value={enteredCardName}
            onChange={(e) => setEnteredCardName(e.target.value)}
            placeholder="Enter the name on your card"
            className={`border ${isValid ? 'border-gray-400' : 'border-red-500'} p-2 rounded-lg`}
            required
          />
        </div>
        <div className="w-4/5 flex flex-col items-center">
          <button
            type="submit"
            className="w-full bg-3 text-black text-lg font-semibold py-2 rounded-lg hover:bg-4 transition duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExchangePop1;
