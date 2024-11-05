import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/axiosInterceptors';

// Define ShopifyDto type
interface ShopifyDto {
  shopifyApiKey: string;
  shopifyShopName: string;
  userId: number;
}

// Define the component
const Shopify: React.FC = () => {
    const authState = useSelector((state: any) => state.auth);
    const [shopifyData, setShopifyData] = useState<ShopifyDto>({
    shopifyApiKey: '',
    shopifyShopName: '',
    userId: 0, // Initialize with userId from Redux
  });
  const [message, setMessage] = useState<string>('');

  // Update Shopify information
  const updateShopifyInfo = async () => {
    console.log(shopifyData)
    try {
      const response = await axiosInstance.put('/users/shopify', {...shopifyData,userId:authState.id});
      setMessage(response.data.message); // Display success message
    } catch (error) {
      console.error('Error updating Shopify info:', error);
      setMessage('Failed to update Shopify info');
    }
  };

  // Get Shopify information
  const fetchShopifyInfo = async () => {
    try {
      const response = await axiosInstance.put('/users/shopify/get', {...shopifyData,userId:authState.id});
      setShopifyData(response.data); // Update form with received data
    } catch (error) {
      console.error('Error fetching Shopify info:', error);
      setMessage('Failed to fetch Shopify info');
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShopifyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchShopifyInfo()
  

  }, [])
  
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Update Shopify Information</h2>
      <div>
        <label>Shopify API Key:</label>
        <input
          type="text"
          name="shopifyApiKey"
          value={shopifyData.shopifyApiKey}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Shopify Shop Name:</label>
        <input
          type="text"
          name="shopifyShopName"
          value={shopifyData.shopifyShopName}
          onChange={handleChange}
        />
      </div>
  
      <button onClick={updateShopifyInfo}>Update Shopify Info</button>
      <button onClick={fetchShopifyInfo}>Fetch Shopify Info</button>
      {message && <p>{message}</p>}
    </div>
  );
}
export default Shopify;
