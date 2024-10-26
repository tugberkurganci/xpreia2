import React from 'react';
import './homepage.css';
import TrainingDataUpload from '../TraningDataUpload';
import SystemMessageManager from '../SystemMessageManager';
import MainComponent from '../MainComponent';
import { useSelector } from 'react-redux';

const Homepage: React.FC = () => {
  const auth = useSelector((state: any) => state.auth);

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
          <div className="left-container">
            <TrainingDataUpload />
            <MainComponent />
          </div>
          <div className="right-container">
            <SystemMessageManager />
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
