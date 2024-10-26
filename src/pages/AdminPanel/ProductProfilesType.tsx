import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Plus, Edit, Trash2 } from 'lucide-react';

type ProductProfile = {
  id: number;
  name: string;
  description: string;
  fields: string[];
  defaultTone: string;
};

const ProductProfilesTab: React.FC = () => {
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

  return (
    <div className="section">
      <Button className="action-button" onClick={() => alert('Add Profile')}>
        <Plus className="button-icon" /> Add Profile
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
          {productProfiles.map((profile) => (
            <tr key={profile.id}>
              <td>{profile.id}</td>
              <td>{profile.name}</td>
              <td>{profile.description}</td>
              <td>{profile.fields.join(', ')}</td>
              <td>{profile.defaultTone}</td>
              <td>
                <Button variant="primary" onClick={() => alert(`Edit ${profile.id}`)}>
                  <Edit />
                </Button>
                <Button variant="danger" onClick={() => setProductProfiles(productProfiles.filter((p) => p.id !== profile.id))}>
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

export default ProductProfilesTab;
