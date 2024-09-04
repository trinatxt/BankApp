import React, { createContext, useContext, useState } from 'react';

// Create the context
const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [cards, setCards] = useState([]);
  const [user_id, setUserId] = useState('');
  const [profile_pic, setPfp] = useState('');
  const [starpoints, setStarpoints] = useState(1000); // Default value for new users
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [airlineCode, setAirlineCode] = useState('');
  const [reference, setReference] = useState('');
  const [transaction_date, setDate] = useState('');
  const [creditHistory, setCreditHistory] = useState([]); // State for credit history

  const updateStarpoints = (newStarpoints) => {
    setStarpoints(newStarpoints);
  };

  const fetchUserData = async (userId) => {
    try {
      const userResponse = await fetch('http://weloveesc.xukaiteo.com:8001/user/get_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      console.log('Fetched user data:', userData);

      setEmail(userData.email);
      setUserId(userData.user_id);
      setPfp(userData.profile_pic);
      setAmount(userData.amount);
      setStatus(userData.status);
      setAirlineCode(userData.airline_code);
      setReference(userData.reference);
      setDate(userData.transaction_date);

      // Fetch credit history
      try {
        const creditHistoryResponse = await fetch('http://weloveesc.xukaiteo.com:8001/tc/credit/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId }),
        });

        if (creditHistoryResponse.ok) {
          const creditHistoryData = await creditHistoryResponse.json();
          console.log('Fetched credit history:', creditHistoryData);
          setCreditHistory(creditHistoryData);
        } else {
          console.warn('No credit history available');
          setCreditHistory([]);
        }
      } catch (error) {
        console.error('Error fetching credit history:', error);
        setCreditHistory([]); // Set an empty array in case of error
      }

      // Fetch card data
      try {
        const cardResponse = await fetch(`http://weloveesc.xukaiteo.com:8001/card/get_cards?user_id=${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId }),
        });

        if (cardResponse.ok) {
          const cardData = await cardResponse.json();
          console.log('Fetched card data:', cardData);
          setCards(cardData);
        } else {
          console.warn('No card data available');
          setCards([]);
        }
      } catch (error) {
        console.error('Error fetching card data:', error);
        setCards([]); // Set an empty array in case of error
      }

      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  const fetchCardData = async (userId) => {
    try {
      const cardResponse = await fetch(`http://weloveesc.xukaiteo.com:8001/card/get_cards?user_id=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!cardResponse.ok) {
        throw new Error('Failed to fetch card data');
      }

      const cardData = await cardResponse.json();
      console.log('Fetched card data:', cardData);
      setCards(cardData);
      return cardData;
    } catch (error) {
      console.error('Error fetching card data:', error);
      setCards([]); // Set an empty array in case of error
      return [];
    }
  };

  const validateCardName = async (userId, cardName) => {
    try {
      const cardData = await fetchCardData(userId);
      console.log('Fetched card data for validation:', cardData);
      return cardData.some(card => card.card_name === cardName);
    } catch (error) {
      console.error('Error validating card name:', error);
      return false; // Return false in case of error
    }
  };

  const authenticate = async (username, password) => {
    try {
      const authResponse = await fetch('http://weloveesc.xukaiteo.com:8001/user/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const authData = await authResponse.json();
      console.log('Authentication response:', authData);

      if (authResponse.ok && authData.verified) {
        setUser(authData);
        await fetchUserData(authData.user_id); // Use authData.user_id directly here
        return true;
      } else {
        console.error('Authentication failed:', authData.detail || 'Invalid credentials');
        return false;
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      return false;
    }
  };

  const signUp = async (userData) => {
    try {
      const checkResponse = await fetch('http://weloveesc.xukaiteo.com:8001/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userData.username }),
      });

      const checkData = await checkResponse.json();

      if (checkData.exists) {
        console.error('Username already exists');
        return false;
      }

      // Add starpoints to userData before sending it to the server
      userData.starpoints = 1000;

      const signUpResponse = await fetch('http://weloveesc.xukaiteo.com:8001/user/add_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!signUpResponse.ok) {
        throw new Error('Error adding new user to the database');
      }

      const newUserAuthData = await signUpResponse.json();
      setUser(newUserAuthData);
      setStarpoints(1000);
      await fetchCardData(newUserAuthData.user_id);

      return true;
    } catch (error) {
      console.error('Error during sign up:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setAmount(null);
    setStatus(null);
    setAirlineCode(null);
    setReference(null);
    setCards([]);
    setStarpoints(1000);
    console.log("User has been logged out and state has been cleared.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        email,
        cards,
        user_id,
        profile_pic,
        amount,
        status,
        airlineCode,
        reference,
        creditHistory,
        starpoints,
        setUser,
        authenticate,
        signUp,
        logout,
        validateCardName,
        updateStarpoints
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
