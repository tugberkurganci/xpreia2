import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInterceptors';
import { useSelector } from 'react-redux';

export interface Guide {
  id: number;
  guideType: 'customerService';
  content: string;
  userId: number;
}

const CustomerServiceGuide: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true); // Loading state
  const authState = useSelector((state: any) => state.auth);
  const userId = authState.id;

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axiosInstance.get(`guides/user/${userId}/customerService`);
        setGuides(response.data);
        // Set the initial content for the first guide if available
        if (response.data.length > 0) {
          setContent(response.data[0].content);
        }
      } catch (error) {
        console.error("Failed to fetch guides", error);
      } finally {
        setLoading(false); // End loading state after data is fetched
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
      <h3>Customer Service Guides</h3>
      {loading ? (
        <p>Loading...</p> // Loading indicator
      ) : (
        <ul>
          {guides.map((guide, index) => (
            <li key={guide.id}>
              {index === 0 ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Description"
                  required
                />
              ) : (
                <p>{guide.content}</p>
              )}
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleUpdate} disabled={loading}>Save Changes</button>
    </div>
  );
};

export default CustomerServiceGuide;