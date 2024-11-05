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
  const [loading, setLoading] = useState(true); // Loading state
  const authState = useSelector((state: any) => state.auth);
  const userId = authState.id;

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axiosInstance.get(`guides/user/${userId}/emailCampaign`);
        setGuides(response.data);
        // Set initial content for the first guide if available
        if (response.data.length > 0) {
          setContent(response.data[0].content);
        }
      } catch (error) {
        console.error("Failed to fetch guides", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };
    fetchGuides();
  }, [userId]);

  const handleUpdate = async () => {
    if (guides.length > 0) {
      const firstGuide = guides[0];
      const updatedGuide = { ...firstGuide, content };
      const response = await axiosInstance.post(`/guides/${firstGuide.id}`, updatedGuide);
      // Update the guides list with the new content
      setGuides(guides.map(guide => (guide.id === response.data.id ? response.data : guide)));
    }
  };

  return (
    <div>
      <h3>Email Campaign Guides</h3>
      {loading ? (
        <p>Loading...</p> // Loading indicator
      ) : (
         
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Edit content for the first guide"
              required
            />
            <button onClick={handleUpdate}>Save Changes</button>
          </div>
        
      )}
    </div>
  );
};

export default EmailCampaignGuides;
