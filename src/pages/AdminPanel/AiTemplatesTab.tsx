import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { Plus, Edit, Trash2 } from 'lucide-react';
import axiosInstance from '../../utils/axiosInterceptors';
import { useSelector } from 'react-redux';

type EmailType = {
  id: number;
  name: string;
  content: string;

};

const EmailTypesTab: React.FC = () => {
  const [emailTypes, setEmailTypes] = useState<EmailType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEmailType, setCurrentEmailType] = useState<EmailType | null>(null);
  const authState = useSelector((state: any) => state.auth);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchEmailTypes();
  }, []);

  const fetchEmailTypes = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get(`/guides/user/${authState.id}/aiTypes`);
      // Ensure response data is an array
      if (Array.isArray(response.data)) {-
        setEmailTypes(response.data);
      } else {
        console.error('Expected response data to be an array:', response.data);
        setEmailTypes([]); // Default to empty array if not an array
      }
    } catch (error) {
      console.error('Error fetching ai types:', error);
      setEmailTypes([]); // Default to empty array on error
    }
    setIsLoading(false)
  };

  const handleSave = async () => {
    setIsLoading(true)
    console.log(currentEmailType)
    if (currentEmailType && currentEmailType?.id !=0) {
      await axiosInstance.post(`/guides/${currentEmailType.id}`,{...currentEmailType,  guideType:"aiTypes",userId:authState.id});
    } else {
     
      await axiosInstance.post('/guides', {...currentEmailType, guideType:"aiTypes",userId:authState.id});
    }
    setShowModal(false);
    fetchEmailTypes();
    setIsLoading(false)
  };

  const handleEdit = (emailType: EmailType) => {
    setCurrentEmailType(emailType);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    await axiosInstance.delete(`/guides/${id}`);
    fetchEmailTypes();
  };

  const handleCloseModal = () => {
    setCurrentEmailType(null);
    setShowModal(false);
  };

  return (
    <div className="section">
      <Button className="action-button" onClick={() => handleEdit({ id: 0, name: '', content: '' })}>
        <Plus className="button-icon" /> {isLoading?"Loading":"Add Ai Template Type"}
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>content</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {emailTypes.length > 0 && emailTypes.map((emailType) => (
            <tr key={emailType.id}>
              <td>{emailType.id}</td>
              <td>{emailType.name}</td>
              <td>{emailType.content}</td>
              <td>
                <Button variant="primary" onClick={() => handleEdit(emailType)}>
                  <Edit />
                </Button>
                <Button variant="danger" onClick={() => handleDelete(emailType.id)}>
                  <Trash2 />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentEmailType ? 'Edit Ai Type' : 'Add ai Type'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={currentEmailType?.name || ''}
                onChange={(e) => 
                  setCurrentEmailType((prev) => ({
                    ...(prev || { id: 0, name: '', content: '' }), // Use a default if prev is null
                    name: e.target.value
                
                  
                  }))
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>content</Form.Label>
              <textarea
                value={currentEmailType?.content || ''}
                onChange={(e) => 
                  setCurrentEmailType((prev) => ({
                    ...(prev || { id: 0, name: '', content: '' }),
                    content: e.target.value,
                  }))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmailTypesTab;
