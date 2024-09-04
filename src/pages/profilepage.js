import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/authcontext'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom';
import { MdEdit } from 'react-icons/md'; // Import the edit icon

// Import all avatars
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

const ProfilePage = () => {
  const { user, email, user_id, starpoints, setUser, logout } = useAuth();
  const [cards, setCards] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCard, setSelectedCard] = useState(null);
  const [spendingData, setSpendingData] = useState({});
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const response = await axios.post('http://weloveesc.xukaiteo.com:8001/user/get_user', 
        { user_id: user_id },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        setUser(response.data); // Update user context with new data
      } else {
        console.error('Failed to fetch user profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile(); // Fetch user profile on component mount
  }, [user_id, setUser]);

  const fetchUserCards = async () => {
    try {
      const response = await axios.post('http://weloveesc.xukaiteo.com:8001/card/get_cards', 
        { user_id: user_id },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        setCards(response.data); // Assuming response.data is an array of card objects
        if (response.data.length > 0) {
          setSelectedCard(response.data[0].card_name); // Default to the first card
        }
      } else {
        console.error('Failed to fetch cards:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const fetchTransactionSummary = async () => {
    setLoading(true);
    setNoData(false);
    try {
      const response = await axios.post('http://weloveesc.xukaiteo.com:8001/transactions/get_summary', 
        { user_id: user_id },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200 && response.data.monthly_spendings) {
        setSpendingData(response.data.monthly_spendings);
      } else {
        console.error('Failed to fetch transaction summary');
        setNoData(true);
      }
    } catch (error) {
      console.error('Error fetching transaction summary:', error);
      setNoData(true);
    } finally {
      setLoading(false);
    }
  };

  const deleteUserFromDatabase = async () => {
    try {
      const response = await axios.post('http://weloveesc.xukaiteo.com:8001/user/delete_user', 
        { user_id: user_id },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        console.log('User deleted successfully from database 1:', response.data);
        return true;
      } else {
        console.error('Failed to delete user from database 1:', response.status, response.data);
        return false;
      }
    } catch (error) {
      console.error('Error deleting user from database 1:', error.response ? error.response.data : error.message);
      return false;
    }
  };

  const deleteUserAccount = async () => {
    console.log('Showing confirmation dialog');
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    console.log('Confirmation result:', confirmDelete);
    if (!confirmDelete) {
      return;
    }
  
    setDeleting(true);
    
    try {
      console.log('Deleting user with ID:', user_id);
      const db1Success = await deleteUserFromDatabase();
  
      if (db1Success) {
        window.alert('Profile has been deleted.');
        logout(); // Logout after successful deletion
        navigate('/login'); // Redirect to login page
      } else {
        window.alert('Failed to delete profile. Please try again.'); // Notify user of failure
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      window.alert('An error occurred while deleting the profile. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchUserCards();
    fetchTransactionSummary();
  }, [user_id]); // Fetch data whenever user_id changes

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 5;

  const changeYear = (direction) => {
    const newYear = selectedYear + direction;
    if (newYear <= currentYear && newYear >= minYear) {
      setSelectedYear(newYear);
    }
  };

  const generateSpendingTableRows = (cardData) => {
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    return months.map((month) => {
      const amount = cardData[month] || 0;
      return (
        <tr key={month}>
          <td className="border px-6 py-4">{month.charAt(0).toUpperCase() + month.slice(1)}</td>
          <td className="border px-6 py-4">{amount}</td>
        </tr>
      );
    });
  };

  const handleTabClick = (cardName) => {
    setSelectedCard(cardName);
  };

  const handleEditProfile = () => {
    navigate('/editprofilepage');
  };

  const handleLogout = () => {
    deleteUserAccount(); // Change from logout to deleteUserAccount
  };

  return (
    <div className="bg-3 min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        Profile
        <button
          onClick={handleEditProfile}
          className="ml-4 text-2xl cursor-pointer hover:text-5"
          aria-label="Edit Profile"
        >
          <MdEdit />
        </button>
      </h1>
      <div className="flex mb-8 items-center">
        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-8 mr-8 relative">
          <img
            src={avatars[user?.profile_pic] || avatars['avatar1.png']}
            alt="Profile"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-lg font-semibold text-9">
            {user?.first_name} {user?.last_name}
          </p>
          <p className="text-lg font-semibold text-9">
            Username: <span className="font-normal">{user?.username}</span>
          </p>
          <p className="text-lg font-semibold text-9">
            Email: <span className="font-normal">{email}</span>
          </p>
          <p className="text-lg font-semibold text-9">
            Tugharia points: <span className="font-normal">{starpoints}</span>
          </p>
          <button
            onClick={handleLogout}
            className="mt-4 py-2 px-4 rounded-md bg-7 text-white hover:bg-9"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Annual Spending</h2>
      <div className="bg-2 p-6 rounded-lg shadow-md">
        <div className="mb-4 flex items-center space-x-4">
          <button
            onClick={() => changeYear(-1)}
            className="py-2 px-4 rounded-md focus:outline-none bg-3 text-8 hover:bg-4"
            disabled={selectedYear <= minYear}
          >
            &lt;
          </button>
          <span className="text-xl font-bold">{selectedYear}</span>
          <button
            onClick={() => changeYear(1)}
            className="py-2 px-4 rounded-md focus:outline-none bg-3 text-8 hover:bg-4"
            disabled={selectedYear >= currentYear}
          >
            &gt;
          </button>
        </div>

        {/* Tabs for each card */}
        <div className="mb-4">
          <div className="flex space-x-4">
            {cards.map(card => (
              <button
                key={card.card_name}
                onClick={() => handleTabClick(card.card_name)}
                className={`py-2 px-4 ${selectedCard === card.card_name ? 'bg-5 text-white' : 'bg-3 text-8'} rounded-none `}
              >
                {card.card_name}
              </button>
            ))}
          </div>
          <div className="bg-3 p-4 border-t rounded-b-lg">
            {loading ? (
              <p>Loading...</p>
            ) : noData ? (
              <p>No spending data available for the selected year and card.</p>
            ) : (
              <div>
                <h3 className="text-xl font-semibold mb-4">{selectedCard}</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-3 border rounded-lg">
                    <thead className="bg-5">
                      <tr>
                        <th className="border px-6 py-3 text-left text-8">Month</th>
                        <th className="border px-6 py-3 text-left text-8">Total Spent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generateSpendingTableRows(spendingData[selectedCard]?.[selectedYear] || {})}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
