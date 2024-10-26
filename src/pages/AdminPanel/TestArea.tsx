import React, { useEffect, useState } from 'react';
import { Card, Button, ListGroup, Form } from 'react-bootstrap';
import axiosInstance from '../../utils/axiosInterceptors';

const TestArea: React.FC = () => {
  const [generalGuide, setGeneralGuide] = useState<string>('');
  const [specificGuide, setSpecificGuide] = useState<string>('');
  const [guides, setGuides] = useState<{ id: number; guideType: string; content: string }[]>([]);
  const [selectedGuideId, setSelectedGuideId] = useState<number | null>(null);
  const [guideType, setGuideType] = useState<'general' | 'specific'>('general');

  // Fetch guides from the backend
  const fetchGuides = async () => {
    try {
      const response = await axiosInstance.get('/guides');
      setGuides(response.data);
    } catch (error) {
      console.error('Error fetching guides:', error);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  const handleSelectGuide = (guide: { id: number; guideType: string; content: string }) => {
    setSelectedGuideId(guide.id);
    setGuideType(guide.guideType === 'General Guide' ? 'general' : 'specific');
    
    if (guide.guideType === 'General Guide') {
      setGeneralGuide(guide.content);
      setSpecificGuide('');
    } else {
      setSpecificGuide(guide.content);
      setGeneralGuide('');
    }
  };

  const handleSave = async () => {
    const guideData = {
      id: selectedGuideId,
      guideType: guideType === 'general' ? 'General Guide' : 'Specific Guide',
      content: guideType === 'general' ? generalGuide : specificGuide,
    };

    try {
      if (selectedGuideId) {
        // Check if the guide with the selected ID exists
        const existingGuide = guides.find(guide => guide.id === selectedGuideId);

        if (existingGuide) {
          // If it exists, update it
          await axiosInstance.post(`/guides/${selectedGuideId}`, guideData);
          alert('Guide successfully updated!');
        } else {
          // If it doesn't exist, create a new one
          await axiosInstance.post('/guides', guideData);
          alert('Guide successfully saved!');
        }
      } else {
        // If no guide is selected, create a new one
        await axiosInstance.post('/guides', guideData);
        alert('Guide successfully saved!');
      }

      fetchGuides(); // Refresh the list after adding or updating
      resetFields(); // Reset fields
    } catch (error) {
      console.error('Error saving the guide:', error);
      alert('An error occurred while saving the guide.');
    }
  };

  const resetFields = () => {
    setGeneralGuide('');
    setSpecificGuide('');
    setSelectedGuideId(null);
  };

  return (
    <Card>
      <Card.Header>
        <h2>Test Area</h2>
      </Card.Header>
      <Card.Body>
        <h3>Select a Guide</h3>
        <ListGroup>
          {guides.map((guide) => (
            <ListGroup.Item 
              key={guide.id} 
              onClick={() => handleSelectGuide(guide)} 
              style={{ cursor: 'pointer', backgroundColor: selectedGuideId === guide.id ? '#d1e7dd' : undefined }} // Highlight selected guide
            >
              <strong>{guide.guideType}:</strong> {guide.content}
            </ListGroup.Item>
          ))}
        </ListGroup>

        <Form.Group controlId="guideTypeSelect" style={{ marginTop: '20px' }}>
          <Form.Label>Select Guide Type</Form.Label>
          <Form.Control
            as="select"
            value={guideType}
            onChange={(e) => setGuideType(e.target.value as 'general' | 'specific')}
          >
            <option value="general">General Guide</option>
            <option value="specific">Document Handling Guide</option>
          </Form.Control>
        </Form.Group>

        <textarea
          rows={5}
          placeholder={guideType === 'general' ? "Define the AI's role here..." : "Define how the AI handles different documents here..."}
          value={guideType === 'general' ? generalGuide : specificGuide}
          onChange={(e) => {
            if (guideType === 'general') {
              setGeneralGuide(e.target.value);
            } else {
              setSpecificGuide(e.target.value);
            }
          }}
          style={{ width: '100%', marginTop: '10px' }}
        />

        <Button onClick={handleSave} style={{ marginTop: '10px' }}>
          {selectedGuideId ? 'Update Guide' : 'Save Changes'}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TestArea;
