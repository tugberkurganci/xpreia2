import React from 'react';
import './homepage.css';
import TrainingDataUpload from '../TraningDataUpload';
import CustomerService from '../CustomerService';
import EmailCampaigns from '../EmailCampaings';
import { useSelector } from 'react-redux';

const Homepage: React.FC = () => {
  const auth = useSelector((state: any) => state.auth);

  // State to track which component is currently active
  const [activeComponent, setActiveComponent] = React.useState<'trainingData' | 'customerService' | 'emailCampaigns' | null>(null);

  return (
    <div className="app">
      {auth.id === 0 ? (
        <div className="welcome-container">
          <div className="welcome-overlay">
            <h1 className="welcome-title">Welcome to BlueSky AI</h1>
            <p className="welcome-message">
              Streamline your email interactions and launch custom campaigns with our AI-powered assistant.
            </p>
            <div className="example-messages">
              <p>🚀 *"Automatically generate responses to customer emails in seconds!"*</p>
              <p>💌 *"Design, customize, and manage your email campaigns effortlessly!"*</p>
              <p>✨ *"Enhance your customer service while saving time!"*</p>
            </div>
            <button className="welcome-button">Log in or Sign up to Get Started</button>
          </div>
        </div>
      ) : (
        <div className="content-container">
          <div className="component-select">
            <div onClick={() => setActiveComponent('trainingData')} className="component-thumbnail">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUa19mHM4wXga5JFTTFcYZYI-cEk7PByyBRg&s" alt="Training Data" />
              <p>Training Data Upload</p>
            </div>
            <div onClick={() => setActiveComponent('customerService')} className="component-thumbnail">
              <img src="https://medyailanlari.com/wp-content/uploads/2023/03/met-ajans-customer-representative-ariyor.jpeg" alt="Customer Service" />
              <p>Customer Service</p>
            </div>
            <div onClick={() => setActiveComponent('emailCampaigns')} className="component-thumbnail">
              <img src="https://www.site-seeker.com/wp-content/uploads/2020/02/STUDIO-ANG-098-45-300x279-2.jpg" alt="Email Campaigns" />
              <p>Email Campaigns</p>
            </div>
          </div>

          {/* Display the selected component */}
          <div className="active-component-container">
            {activeComponent === 'trainingData' && <TrainingDataUpload />}
            {activeComponent === 'customerService' && <CustomerService />}
            {activeComponent === 'emailCampaigns' && <EmailCampaigns />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
