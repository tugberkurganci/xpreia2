import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Plus, Edit, Trash2 } from 'lucide-react';

type EmailType = {
  id: number;
  name: string;
  description: string;
};

const EmailTypesTab: React.FC = () => {
  const [emailTypes, setEmailTypes] = useState<EmailType[]>([
    { id: 1, name: 'Product', description: 'Product announcements and updates' },
    { id: 2, name: 'Informational/News', description: 'Company news and updates' },
    { id: 3, name: 'Community', description: 'Community engagement emails' },
    { id: 4, name: 'Sales', description: 'Promotional and sales campaigns' }
  ]);

  return (
    <div className="section">
      <Button className="action-button" onClick={() => alert('Add Email Type')}>
        <Plus className="button-icon" /> Add Email Type
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
          {emailTypes.map((emailType) => (
            <tr key={emailType.id}>
              <td>{emailType.id}</td>
              <td>{emailType.name}</td>
              <td>{emailType.description}</td>
              <td>
                <Button variant="primary" onClick={() => alert(`Edit ${emailType.id}`)}>
                  <Edit />
                </Button>
                <Button variant="danger" onClick={() => setEmailTypes(emailTypes.filter((e) => e.id !== emailType.id))}>
                  <Trash2 />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default EmailTypesTab;
