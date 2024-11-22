import React, { useState, ChangeEvent } from 'react';
import axiosInstance from './../utils/axiosInterceptors';
import { useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';
interface BrandToneProps {
  brandTone:string
}

const CustomerService: React.FC<BrandToneProps> = ({ brandTone }) => {
  const [emailThread, setEmailThread] = useState<string>('');
  const [generatedReply, setGeneratedReply] = useState<string>('');
  const [previousReply, setPreviousReply] = useState<string>('');
  const [commentInput, setCommentInput] = useState<string>('');
  const auth = useSelector((state: any) => state.auth);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const rentalState = useSelector((store: any) => store.rental);

 
  const handleGenerateReply = async (): Promise<void> => {
    setLoading(true); // Start loading
    console.log( emailThread + ` .You should only send an email example and respond to the last message.brand tone : ${rentalState.brandTone}`)
    try {
      const response = await axiosInstance.post('/assistants', {
        userId: auth.id,
        chatId: auth.id,
        userMessage: emailThread + ` .You should only send an email example and respond to the last message.brand tone : ${rentalState.brandTone} .only show content`
      });
      
      setGeneratedReply(response.data);
      setPreviousReply(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error generating reply:', error);
      alert('Failed to generate reply.');
    }
    setLoading(false); // Stop loading
  };

  const handleLearnChanges = async (): Promise<void> => {
    setLoading(true); // Start loading
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
    setLoading(false); // Stop loading
  };

  const handleGenerateComment = async (): Promise<void> => {
    setLoading(true); // Start loading
    try {
      const response = await axiosInstance.post('/assistants', {
        userId: auth.id,
        chatId: auth.id,
        userMessage: "This is a user comment on top of previous messages. :" + commentInput
      });
      setGeneratedReply(response.data);
      alert('Reply regenerated successfully.');
    } catch (error) {
      console.error('Error regenerating reply:', error);
      alert('Failed to regenerate reply.');
    }
    setLoading(false); // Stop loading
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
      <button onClick={handleGenerateReply} className="primary mt-4" disabled={loading}>
        {loading ? 'Generating...' : 'Generate Reply'}
      </button>

      
      <div className="border rounded p-4 min-h-32 bg-gray-50 mt-4">
            <p className="text-gray-400">{'Generated content will appear here...'}</p>
            {/* HTML Preview */}
            
              <div className="html-preview mt-4 p-2 border-t">
                {generatedReply}
              </div>
            
          </div>
    <div className="comment-input mt-4">
  <h3 className="text-lg font-semibold mb-2">Add a Comment:</h3>
  <textarea
    placeholder="Enter your comment here..."
    value={commentInput}
    onChange={(e) => handleTextAreaChange(e, setCommentInput)}
  />
</div>



      <button onClick={handleGenerateComment} className="primary" disabled={loading}>
        {loading ? 'Regenerating...' : '  Regenerate Response Based on Comment'}
      </button>
      <div className="generated-reply mt-4">
        <h3 className="text-lg font-semibold mb-2">Generated Reply:</h3>
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
        <button onClick={handleLearnChanges} className="primary mb-4" disabled={loading}>
          {loading ? 'Submitting Changes...' : 'Adjust and Learn My Changes'}
        </button>


      </div>
    </div>
  );
};

export default CustomerService;
