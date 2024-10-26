import React, { useState, ChangeEvent } from 'react';
import axiosInstance from './../utils/axiosInterceptors';
import { useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';

const CustomerService: React.FC = () => {
  const [emailThread, setEmailThread] = useState<string>('');
  const [generatedReply, setGeneratedReply] = useState<string>('');
  const [previousReply, setPreviousReply] = useState<string>('');
  const [commentInput, setCommentInput] = useState<string>(''); // Yorum input state'i
  const auth = useSelector((state:any) => state.auth);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null); // Hover efekti

  const handleGenerateReply = async (): Promise<void> => {
    try {
      const response = await axiosInstance.post('/assistants', { userId: auth.id, chatId: auth.id, userMessage: emailThread+" .sadece email örneği atmalısın" });
      setGeneratedReply(response.data);
      setPreviousReply(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error generating reply:', error);
      alert('Failed to generate reply.');
    }
  };

  const handleLearnChanges = async (): Promise<void> => {
    try {
       await axiosInstance.post('/assistants/learn', {
        customerMessage: emailThread,
        originalResponse: previousReply,
        editedResponse: generatedReply,
        rating: rating,
        userId: auth.id
      });
      alert('AI has learned from your changes.');
      setPreviousReply('');
      setGeneratedReply('');
    } catch (error) {
      console.error('Error learning changes:', error);
      alert('Failed to learn changes.');
    }
  };

  const handleGenerateComment = async (): Promise<void> => {
    try {
      const response = await axiosInstance.post('/assistants', { userId: auth.id, chatId: auth.id, userMessage: "bu bir kullanıcı yorumu geçmiş mesajların üstüne :" + commentInput });
      setGeneratedReply(response.data); // Cevap tekrar oluşturuluyor
      alert('Reply regenerated successfully.');
    } catch (error) {
      console.error('Error regenerating reply:', error);
      alert('Failed to regenerate reply.');
    }
  };

  const handleTextAreaChange = (
    e: ChangeEvent<HTMLTextAreaElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ): void => {
    setter(e.target.value);
  };

  const handleRatingClick = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Customer Service Emails</h2>
      <textarea
        placeholder="Paste customer email thread here..."
        value={emailThread}
        onChange={(e) => handleTextAreaChange(e, setEmailThread)}
        className="textarea"
      />
      <button onClick={handleGenerateReply} className="primary mt-4">
        Generate Reply
      </button>

      <div className="generated-reply mt-4">
        <h3 className="text-lg font-semibold mb-2">Reply:</h3>
        <textarea
          placeholder="Adjust the reply here..."
          value={generatedReply}
          onChange={(e) => setGeneratedReply(e.target.value)}
          className="textarea mb-4"
        />
                    <div className="flex items-center mt-4">
              <h4 className="mr-2">Rate the Response:</h4>
              <div className="rating flex">
                {Array.from({ length: 10 }, (_, index) => (
                  <FaStar
                    key={index}
                    onClick={() => handleRatingClick(index)}
                    onMouseEnter={() => setHoverRating(index + 1)}
                    onMouseLeave={() => setHoverRating(null)}
                    style={{
                      cursor: 'pointer',
                      color: index < (hoverRating || rating) ? '#FFD700' : '#D3D3D3',
                      transition: 'color 0.2s',
                    }}
                    size={24}
                  />
                ))}
              </div>
            </div>
        <button onClick={handleLearnChanges} className="primary mb-4">
          Adjustment Reply and Learn My Changes
        </button>

        <div className="comment-input mt-4">
          <h3 className="text-lg font-semibold mb-2">Add a Comment:</h3>
          <textarea
            placeholder="Enter your comment here..."
            value={commentInput}
            onChange={(e) => handleTextAreaChange(e, setCommentInput)}
            className="textarea mb-4"
          />
        </div>

        <button onClick={handleGenerateComment} className="primary">
          Regenerate Reply
        </button>
      </div>
    </div>
  );
};

export default CustomerService;
