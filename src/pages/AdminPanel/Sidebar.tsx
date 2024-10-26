import React from 'react';
import { Card } from 'react-bootstrap';
import { LayoutGrid, Mail, Users, Settings } from 'lucide-react';

type SidebarProps = {
  selectedSection: string;
  setSelectedSection: (section: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ selectedSection, setSelectedSection }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'campaign-settings', label: 'Campaign Settings', icon: Mail },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'trainingData', label: 'Traning Data', icon: Settings },
    { id: 'test-area', label: 'Edit Config Data', icon: Settings },
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
