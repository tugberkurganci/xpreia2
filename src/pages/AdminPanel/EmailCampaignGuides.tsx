import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInterceptors';
import { useSelector } from 'react-redux';

export interface Guide {
  id: number;
  guideType: 'emailCampaign';
  content: string;
  userId: number;
}

const EmailCampaignGuides: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const authState = useSelector((state: any) => state.auth);
  const userId = authState.id;

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axiosInstance.get(`guides/user/${userId}/emailCampaign`);
        if (response.data.length > 0) {
          setGuides(response.data);
          setContent(response.data[0].content); // Set initial content for the first guide
        } else {
          // Initialize a new guide if none are found
          const newGuide: Guide = { id: 0, guideType: 'emailCampaign', content: '', userId };
          setGuides([newGuide]);
        }
      } catch (error) {
        console.error("Failed to fetch guides", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGuides();
  }, [userId]);

  const handleUpdate = async () => {
    setLoading(true)
    if (guides.length > 0) {
      const firstGuide = guides[0];

      try {
        let response;
        if (firstGuide.id === 0) {
          // Create a new guide if it doesn't exist on the backend
          response = await axiosInstance.post(`/guides`, { ...firstGuide, content });
        } else {
          // Update the existing guide
          response = await axiosInstance.post(`/guides/${firstGuide.id}`, { ...firstGuide, content });
        }
        
        // Update the guides list with the new or updated guide
        setGuides(guides.map(guide => (guide.id === response.data.id ? response.data : guide)));
      } catch (error) {
        console.error("Failed to update guide", error);
      }
    }
    setLoading(false)
  };

  return (
    <div>
      <h3>Email Campaign Guides</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
        
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Description"
                />
          
        </ul>
      )}
      <button onClick={handleUpdate} disabled={loading}>Save Changes</button>
    </div>
  );
};

export default EmailCampaignGuides;
