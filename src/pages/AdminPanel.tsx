import React, { useState } from 'react';
import { Card, Tabs, Tab } from 'react-bootstrap';

import './AdminPanel.css';
import AiTemplatesTab from './AdminPanel/AiTemplatesTab';
import EmailTypesTab from './AdminPanel/EmailType';
import TrainingDataUpload from './TraningDataUpload';
import Header from './AdminPanel/Header';
import Sidebar from './AdminPanel/Sidebar';
import Shopify from './AdminPanel/Shopify';
import EmailCampaignGuides from './AdminPanel/EmailCampaignGuides';
import CustomerServiceGuide from './AdminPanel/CustomerServiceGuide';

const AdminPanel: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>('dashboard');
  const [activeTab, setActiveTab] = useState<string>('email-types');

  return (
    <div className="admin-panel">
      <Header />
      <div className="container admin-content">
        <div className="admin-body">
          <Sidebar selectedSection={selectedSection} setSelectedSection={setSelectedSection} />
          <div className="main-content">
            {selectedSection === 'dashboard' && (
              <Card>
                <Card.Header>
                  <h2>Dashboard Overview</h2>
                </Card.Header>
                <Card.Body>
                  <p>Welcome to the dashboard. Here you can find an overview of key metrics and recent activities.</p>
                  {/* Additional dashboard content */}
                </Card.Body>
              </Card>
            )}

            {selectedSection === 'campaign-settings' && (
              <Card>
                <Card.Header>
                  <h2> Email Campaign Settings</h2>
                </Card.Header>
                <Card.Body>
                  <Tabs
                    activeKey={activeTab}
                    onSelect={(eventKey) => {
                      if (eventKey !== null) {
                        setActiveTab(eventKey);
                      }
                    }}
                  >
                    <Tab eventKey="email-types" title="Email Types">
                      <EmailTypesTab />
                    </Tab>
                
                    <Tab eventKey="ai-templates" title="AI Templates">
                      <AiTemplatesTab />
                    </Tab>
                  </Tabs>
                </Card.Body>
              </Card>
            )}

            {selectedSection === 'users' && (
              <Card>
                <Card.Header>
                  <h2>User Management</h2>
                </Card.Header>
                <Card.Body>
                  <p>Manage users, view user statistics, and control access rights.</p>
                  {/* Additional User Management content */}
                </Card.Body>
              </Card>
            )}

            {selectedSection === 'settings' && (
            <Shopify/>
            )}

            {selectedSection === 'trainingData' && <TrainingDataUpload />}

            {selectedSection === 'customer-area' && <CustomerServiceGuide />}

            {selectedSection === 'email-area' && <EmailCampaignGuides />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
