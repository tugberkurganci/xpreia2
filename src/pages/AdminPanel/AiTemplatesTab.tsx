import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Plus, Edit, Trash2 } from 'lucide-react';

type AiTemplate = {
  id: number;
  name: string;
  description: string;
  inputFields: string[];
  outputFormat: string;
};

const AiTemplatesTab: React.FC = () => {
  const [aiTemplates, setAiTemplates] = useState<AiTemplate[]>([
    {
      id: 1,
      name: 'Product Description Generator',
      description: 'Generates product descriptions based on features',
      inputFields: ['productName', 'features', 'tone'],
      outputFormat: 'Description Text'
    },
    {
      id: 2,
      name: 'Email Subject Line Creator',
      description: 'Creates catchy email subject lines based on input keywords',
      inputFields: ['keywords', 'tone'],
      outputFormat: 'Subject Line'
    },
    {
      id: 3,
      name: 'Social Media Post Generator',
      description: 'Generates engaging social media posts',
      inputFields: ['topic', 'hashtags', 'tone'],
      outputFormat: 'Social Media Post Text'
    }
  ]);

  return (
    <div className="section">
      <Button className="action-button" onClick={() => alert('Add AI Template')}>
        <Plus className="button-icon" /> Add AI Template
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Input Fields</th>
            <th>Output Format</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {aiTemplates.map((template) => (
            <tr key={template.id}>
              <td>{template.id}</td>
              <td>{template.name}</td>
              <td>{template.description}</td>
              <td>{template.inputFields.join(', ')}</td>
              <td>{template.outputFormat}</td>
              <td>
                <Button variant="primary" onClick={() => alert(`Edit ${template.id}`)}>
                  <Edit />
                </Button>
                <Button variant="danger" onClick={() => setAiTemplates(aiTemplates.filter((t) => t.id !== template.id))}>
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

export default AiTemplatesTab;
