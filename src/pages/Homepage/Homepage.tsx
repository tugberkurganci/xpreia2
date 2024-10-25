import React from 'react';
import './homepage.css';
import TrainingDataUpload from '../TraningDataUpload';
import EmailCampaigns from '../EmailCampaings';
import SystemMessageManager from '../SystemMessageManager';
import MainComponent from '../MainComponent';

const Homepage: React.FC = () => {
  return (
    <div className="app">
      <div className="left-container">
        <TrainingDataUpload />
        <MainComponent />
      </div>
      <div className="right-container">
        <SystemMessageManager />
      </div>
    </div>
  );
};

export default Homepage;
