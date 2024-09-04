import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PromotionPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.post('http://weloveesc.xukaiteo.com:8001/tc/promotions/get');
        if (response.status === 200) {
          setPromotions(response.data);
        } else {
          setError('Failed to fetch promotions.');
        }
      } catch (error) {
        setError('Error fetching promotions.');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  return (
    <div className="bg-3 min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        Promotions
      </h1>
      {loading ? (
        <p>Loading promotions...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo, index) => (
            <div key={index} className="bg-2 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{promo.name}</h2>
              <p className="text-lg text-9">{promo.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromotionPage;
