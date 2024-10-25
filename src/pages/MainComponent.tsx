import React, { useState } from 'react';
import CustomerService from './CustomerService';
import EmailCampaigns from './EmailCampaings';

const MainComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'customerService' | 'emailCampaigns'>('customerService');

  return (
    <div className="email-campaign-section">
      <div className="tabs">
        <button
          onClick={() => setActiveTab('customerService')}
          className={`tab-button ${activeTab === 'customerService' ? 'active' : ''}`}
        >
          Customer Service
        </button>
        <button
          onClick={() => setActiveTab('emailCampaigns')}
          className={`tab-button ${activeTab === 'emailCampaigns' ? 'active' : ''}`}
        >
          Email Campaigns
        </button>
      </div>

      {activeTab === 'customerService' && <CustomerService />}
      {activeTab === 'emailCampaigns' && <EmailCampaigns />}
    </div>
  );
};

export default MainComponent;
