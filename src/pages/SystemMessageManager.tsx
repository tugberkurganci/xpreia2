import React, { useState, useEffect, ChangeEvent } from 'react';
import axios, { AxiosError } from 'axios';
import './System.css';
import axiosInstance from '../utils/axiosInterceptors';

interface SystemMessageResponse {
  systemMessage: string;
}

const SystemMessageManager: React.FC = () => {
  const [systemMessage, setSystemMessage] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Fetch current system message from the server when the component loads
  useEffect(() => {
    const fetchSystemMessage = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<SystemMessageResponse>('/assistants/system-message');
        console.log(response)
        setSystemMessage(response?.data.systemMessage);
        setLoading(false);
      } catch (err) {
        const error = err as AxiosError;
        setError('Error fetching system message: ' + (error.message || 'Unknown error'));
        setLoading(false);
      }
    };

    fetchSystemMessage();
  }, []);

  // Handle the message update
  const updateSystemMessage = async () => {
    try {
      setLoading(true);
      setSuccess(false);
      await axiosInstance.post('/assistants/system-message', { systemMessage: newMessage }, {
        headers: { 'Content-Type': 'application/json' },
      });
      setSystemMessage(newMessage);
      setNewMessage('');
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      const error = err as AxiosError;
      setError('Error updating system message: ' + (error.message || 'Unknown error'));
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  return (
    <div className="system-message-manager">
      <h2>System Message Manager</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">System message updated successfully!</p>}

      <div>
        <h3>Current System Message</h3>
        <p>{systemMessage || 'No message set'}</p>
      </div>

      <div>
        <h3>Update System Message</h3>
        <input
          type="text"
          placeholder="Enter new system message"
          value={newMessage}
          onChange={handleInputChange}
        />
        <button onClick={updateSystemMessage} disabled={loading || !newMessage}>
          Update
        </button>
      </div>
    </div>
  );
};

export default SystemMessageManager;
