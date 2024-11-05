import React from 'react';
import { Card } from 'react-bootstrap';
import { LayoutGrid, Mail, Settings } from 'lucide-react';

type SidebarProps = {
  selectedSection: string;
  setSelectedSection: (section: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ selectedSection, setSelectedSection }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'campaign-settings', label: 'Email Campaign Settings', icon: Mail },
    { id: 'settings', label: 'Shopify Settings', icon: Settings },
    { id: 'customer-area', label: ' Customer Service Edit Guide', icon: Settings },
    { id: 'email-area', label: 'Email Campaign Edit Guide', icon: Settings },
  ];

  return (
    <Card className="sidebar">
      <div className="sidebar-nav">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`sidebar-button ${selectedSection === id ? 'active' : ''}`}
            onClick={() => setSelectedSection(id)}
          >
            <Icon className="icon" /> {label}
          </button>
        ))}
      </div>
    </Card>
  );
};

export default Sidebar;
