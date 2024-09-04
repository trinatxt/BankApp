import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/authcontext';

const ExchangePop2 = () => {
  const { user, amount: initialAmount, starpoints, updateStarpoints } = useAuth(); // Destructure updateStarpoints
  const navigate = useNavigate();
  const location = useLocation();
  const airlineCode = location.state?.airlineCode || '';
  const membershipId = location.state?.membershipId || '';

  const [amount, setAmount] = useState(initialAmount);
  const [pointsUsed, setPointsUsed] = useState('');
  const [remainingPoints, setRemainingPoints] = useState(starpoints || 0);
  const [exchangedPoints, setExchangedPoints] = useState(0);
  const [promotionId, setPromotionId] = useState(''); // State for promo ID
  const [promoError, setPromoError] = useState(''); // State for promo code error

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Validate promo code
    const isValidPromoCode = await validatePromoCode(promotionId);
    if (!isValidPromoCode) {
      setPromoError('Invalid promotion code. Please check and try again.');
      return;
    }

    // Construct payload dynamically based on whether promotionId is empty or not
    const payload = {
      user_id: user.user_id,
      amount: Math.round(exchangedPoints),
      first_name: user.first_name,
      last_name: user.last_name,
      airline_code: airlineCode,
      partner_code: 'Tugharia',
      email: user.email,
      member_id: membershipId,
      ...(promotionId && { promotion_id: promotionId }), // Include promotion_id only if it's not empty
    };
  
    console.log('Sending payload:', payload);
  
    try {
      const response = await fetch('http://weloveesc.xukaiteo.com:8001/tc/credit/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);
      console.log('member_id:', payload.member_id);
  
      if (response.ok) {
        console.log('API call successful');
        updateStarpoints(remainingPoints); // Update starpoints
        navigate('/exchangehistorypage');
      } else {
        console.error('Failed to add credit', responseText);
      }
    } catch (error) {
      console.error('Error occurred during API call', error);
    }
  };

  // Function to validate promo code
  const validatePromoCode = async (code) => {
    if (!code) return true; // No promo code entered, assume valid

    try {
      // Example API call to check promo code validity
      const response = await fetch('http://weloveesc.xukaiteo.com:8001/tc/promo/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promo_id: code }),
      });
  
      const data = await response.json();
      return data.isValid; // Assuming response has a field `isValid`
    } catch (error) {
      console.error('Error validating promo code', error);
      return false;
    }
  };

  const handlePointsChange = (event) => {
    const value = parseFloat(event.target.value);
    setPointsUsed(value);
    setRemainingPoints(starpoints - value);
    handleExchange(airlineCode, value); // Update exchangedPoints immediately
  };

  const ExchangeRates = (airline_code) => {
    const rates = {
      'GJP': 1.5,
      'IPM': 0.5,
      'EAG': 1,
      'QAQ': 1,
      'CXC': 1.5,
      'MR': 2,
    };
    return rates[airline_code.toUpperCase()] || 1;
  };

  const handleExchange = (airline_code, pointsUsed) => {
    const rate = ExchangeRates(airline_code);
    const conversions = (pointsUsed * rate).toFixed(2);
    setExchangedPoints(conversions);
  };

  useEffect(() => {
    setAmount(initialAmount);
    setRemainingPoints(starpoints);
  }, [initialAmount, starpoints]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="relative p-8 w-full max-w-lg bg-white rounded-lg shadow-md">
        <div className='w-full flex flex-col items-center'>
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
            <h1 className="w-4/5 text-3xl text-center bg-5 border border-white rounded-full p-2 mb-4 pl-1">
              Exchange your miles
            </h1>
            <h3 className="w-2/3 text-left bg-white mb-4 pl-1">
              Points available: {starpoints ? starpoints : 'N/A'}
            </h3>
            <div className='w-1/2 text-left bg-white pl-1 mt-3'>
              <p>Points used:</p>
              <input className='w-full text-center bg-4 pl-1 mb-4 rounded-lg'
                type="number" value={pointsUsed} onChange={handlePointsChange} placeholder="Enter points amount" min="0" max={starpoints} />
            </div>
            <div className='w-1/2 text-left bg-white pl-1 mt-3'>
              <p>Promotion ID:</p>
              <input className='w-full text-center bg-4 pl-1 mb-4 rounded-lg'
                type="text" value={promotionId} onChange={(e) => {
                  setPromotionId(e.target.value);
                  setPromoError(''); // Clear error message when user changes promo code
                }} placeholder="Enter Promo ID" />
              {promoError && <p className="text-red-500 text-sm">{promoError}</p>}
            </div>
            <div className='w-1/2 text-left bg-white mb-4 pl-1'>
              <p>Equates to: {Math.round(exchangedPoints)} {airlineCode.toUpperCase()}</p>
              <p>Remaining Points: {remainingPoints}</p>
            </div>
            <div className="w-1/2 flex justify-center">
              <button type="submit" className="w-3/10 h-10 text-right bg-6 border-none rounded-full cursor-pointer text-base text-black">
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExchangePop2;
