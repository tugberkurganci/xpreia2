import React, { useState } from 'react';
import './homepage.css';
import TrainingDataUpload from '../TraningDataUpload';
import CustomerService from '../CustomerService';
import EmailCampaigns from '../EmailCampaings';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Pricing from '../Pricing';

const Homepage: React.FC = () => {
  const auth = useSelector((state: any) => state.auth);
  const [brandTone, setBrandTone] = useState<string>("friendly")

  // State to track which component is currently active
  const [activeComponent, setActiveComponent] = React.useState<'trainingData' | 'customerService' | 'emailCampaigns' | null>(null);

  return (<>
    <div className="app">
      {auth.id === 0 ? (<div>
        <div className="welcome-container">
          <div className="welcome-overlay">
            <h1 className="welcome-title">Welcome to BlueSky AI</h1>

            <p className="welcome-message">
              Streamline your email interactions and launch custom campaigns with our AI-powered assistant.
            </p>

            <div className="example-messages">
              <p>🚀 <em>"Automatically generate responses to customer emails in seconds!"</em></p>
              <p>💌 <em>"Design, customize, and manage your email campaigns effortlessly!"</em></p>
              <p>✨ <em>"Enhance your customer service while saving time!"</em></p>
            </div>



            {/* Login Button */}


            <Link to="/login" className="welcome-link"><button className="welcome-button">Sign Up & Log In</button></Link>

          </div>
        </div>

      </div>
      ) : (auth.isActive ?
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


          <div className="active-component-container">
            {activeComponent === 'trainingData' && <TrainingDataUpload  />}
            {activeComponent === 'customerService' && <CustomerService />}
            {activeComponent === 'emailCampaigns' && <EmailCampaigns />}
          </div>
        </div>
        : <> <Pricing></Pricing></>)}
    </div></>
  );
};

export default Homepage;
