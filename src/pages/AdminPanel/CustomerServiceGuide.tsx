import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInterceptors';
import { useDispatch, useSelector } from 'react-redux';
import { loadcompanyInfo } from '../../store/rentalSlice';

export interface Guide {
  id: number;
  guideType: 'customerService';
  content: string;
  userId: number;
}

const CustomerServiceGuide: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const authState = useSelector((state: any) => state.auth);
  const userId = authState.id;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axiosInstance.get(`guides/user/${userId}/customerService`);
        if (response.data.length > 0) {
          setGuides(response.data);
          setContent(response.data[0].content); // Set initial content from the first guide
        } else {
          // Initialize a new guide if none are found
          const newGuide: Guide = { id: 0, guideType: 'customerService', content: '', userId };
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
          // Create new guide if it doesn't exist on the backend
          response = await axiosInstance.post(`/guides`, { ...firstGuide, content });
        } else {
          // Update existing guide
          response = await axiosInstance.post(`/guides/${firstGuide.id}`, { ...firstGuide, content });
        }
        
        // Update the guides list with the new or updated guide
        setGuides(guides.map(guide => (guide.id === response.data.id ? response.data : guide)));
        dispatch(loadcompanyInfo(content))

      } catch (error) {
        console.error("Failed to update guide", error);
      }
    }
    setLoading(false)
  };

  return (
    <div>
      <h3>Customer Service Guides</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {guides.map((guide, index) => (
            <li key={guide.id}>
              {index === 0 ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Description"
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
