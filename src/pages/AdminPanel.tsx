import React, { useState } from 'react';
import { 
  Plus,
  Edit,
  Trash2,
  LayoutGrid,
  Settings,
  Users,
  Mail,
  Box,
  FileCode
} from 'lucide-react';
import { Button, Card, Tabs, Tab, Table } from 'react-bootstrap';
import './AdminPanel.css'; // CSS dosyasını eklemeyi unutma!

type EmailType = {
  id: number;
  name: string;
  description: string;
};

type ProductProfile = {
  id: number;
  name: string;
  description: string;
  fields: string[];
  defaultTone: string;
};

type AiTemplate = {
  id: number;
  name: string;
  description: string;
  structure: string;
  tone: string;
  compatibleTypes: number[];
};

const AdminPanel: React.FC = () => {
  const [emailTypes, setEmailTypes] = useState<EmailType[]>([
    { id: 1, name: 'Product', description: 'Product announcements and updates' },
    { id: 2, name: 'Informational/News', description: 'Company news and updates' },
    { id: 3, name: 'Community', description: 'Community engagement emails' },
    { id: 4, name: 'Sales', description: 'Promotional and sales campaigns' }
  ]);

  const [productProfiles, setProductProfiles] = useState<ProductProfile[]>([
    { 
      id: 1, 
      name: 'Tech Product',
      description: 'Template for technology products',
      fields: ['specs', 'features', 'pricing'],
      defaultTone: 'Professional'
    },
    { 
      id: 2, 
      name: 'Fashion Item',
      description: 'Template for clothing and accessories',
      fields: ['size', 'material', 'care'],
      defaultTone: 'Trendy'
    }
  ]);

  const [aiTemplates, setAiTemplates] = useState<AiTemplate[]>([
    {
      id: 1,
      name: 'Professional Announcement',
      description: 'Formal product announcement template',
      structure: 'Introduction -> Features -> Benefits -> Call to Action',
      tone: 'Professional',
      compatibleTypes: [1, 4] // Compatible with Product and Sales email types
    },
    {
      id: 2,
      name: 'Community Update',
      description: 'Engaging community newsletter template',
      structure: 'Greeting -> Updates -> Stories -> Engagement Call',
      tone: 'Friendly',
      compatibleTypes: [3] // Compatible with Community email type
    }
  ]);

  const [selectedSection, setSelectedSection] = useState('email-types');
  const [editingId, setEditingId] = useState<number | 'new-email' | 'new-profile' | 'new-template' | null>(null);
  const [activeTab, setActiveTab] = useState('email-types');

  return (
    <div className="admin-panel">
      {/* Admin Header */}
      <div className="admin-header">
        <div className="container">
          <div className="header-content">
            <h1>Email Campaign Admin</h1>
            <span className="role-badge">Admin</span>
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <div className="container admin-content">
        <div className="admin-body">
          {/* Sidebar */}
          <div className="sidebar">
            <Card>
              <div className="sidebar-nav">
                <button
                  className={`sidebar-button ${selectedSection === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setSelectedSection('dashboard')}
                >
                  <LayoutGrid className="icon" />
                  Dashboard
                </button>
                <button
                  className={`sidebar-button ${selectedSection === 'campaign-settings' ? 'active' : ''}`}
                  onClick={() => setSelectedSection('campaign-settings')}
                >
                  <Mail className="icon" />
                  Campaign Settings
                </button>
                <button
                  className={`sidebar-button ${selectedSection === 'users' ? 'active' : ''}`}
                  onClick={() => setSelectedSection('users')}
                >
                  <Users className="icon" />
                  Users
                </button>
                <button
                  className={`sidebar-button ${selectedSection === 'settings' ? 'active' : ''}`}
                  onClick={() => setSelectedSection('settings')}
                >
                  <Settings className="icon" />
                  Settings
                </button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="main-content">
            <Card>
              <Card.Header>
                <h2>Campaign Configuration</h2>
              </Card.Header>
              <div>
                <Tabs 
                  activeKey={activeTab} 
                  onSelect={(eventKey) => {
                    if (eventKey !== null) {
                      setActiveTab(eventKey);
                    }
                  }}
                >
                  <Tab eventKey="email-types" title={<span><Mail className="tab-icon" /> Email Types</span>}>
                    <div className="section">
                      <Button className="action-button" onClick={() => setEditingId('new-email')}>
                        <Plus className="button-icon" />
                        Add Email Type
                      </Button>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {emailTypes.map(emailType => (
                            <tr key={emailType.id}>
                              <td>{emailType.id}</td>
                              <td>{emailType.name}</td>
                              <td>{emailType.description}</td>
                              <td>
                                <Button variant="primary" onClick={() => setEditingId(emailType.id)}>
                                  <Edit />
                                </Button>
                                <Button variant="danger" onClick={() => setEmailTypes(emailTypes.filter(e => e.id !== emailType.id))}>
                                  <Trash2 />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Tab>

                  <Tab eventKey="product-profiles" title={<span><Box className="tab-icon" /> Product Profiles</span>}>
                    <div className="section">
                      <Button className="action-button" onClick={() => setEditingId('new-profile')}>
                        <Plus className="button-icon" />
                        Add Profile
                      </Button>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Fields</th>
                            <th>Default Tone</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productProfiles.map(profile => (
                            <tr key={profile.id}>
                              <td>{profile.id}</td>
                              <td>{profile.name}</td>
                              <td>{profile.description}</td>
                              <td>{profile.fields.join(', ')}</td>
                              <td>{profile.defaultTone}</td>
                              <td>
                                <Button variant="primary" onClick={() => setEditingId(profile.id)}>
                                  <Edit />
                                </Button>
                                <Button variant="danger" onClick={() => setProductProfiles(productProfiles.filter(p => p.id !== profile.id))}>
                                  <Trash2 />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Tab>

                  <Tab eventKey="ai-templates" title={<span><FileCode className="tab-icon" /> AI Templates</span>}>
                    <div className="section">
                      <Button className="action-button" onClick={() => setEditingId('new-template')}>
                        <Plus className="button-icon" />
                        Add Template
                      </Button>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Structure</th>
                            <th>Tone</th>
                            <th>Compatible Types</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {aiTemplates.map(template => (
                            <tr key={template.id}>
                              <td>{template.id}</td>
                              <td>{template.name}</td>
                              <td>{template.description}</td>
                              <td>{template.structure}</td>
                              <td>{template.tone}</td>
                              <td>{template.compatibleTypes.join(', ')}</td>
                              <td>
                                <Button variant="primary" onClick={() => setEditingId(template.id)}>
                                  <Edit />
                                </Button>
                                <Button variant="danger" onClick={() => setAiTemplates(aiTemplates.filter(t => t.id !== template.id))}>
                                  <Trash2 />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
