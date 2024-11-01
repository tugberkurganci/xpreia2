import React, { useState, ChangeEvent, useEffect } from 'react';
import axiosInstance from './../utils/axiosInterceptors';
import { Card, CardHeader, Button } from 'react-bootstrap';
import { FiRefreshCw } from 'react-icons/fi';
import { BiDownload } from 'react-icons/bi';
import { FaStar } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const EmailCampaigns: React.FC = () => {
  const [emailType, setEmailType] = useState<string>('');
  const [productProfile, setProductProfile] = useState<string>('');
  const [aiTemplate, setAiTemplate] = useState<string>('');
  const [generatedCampaign, setGeneratedCampaign] = useState<string>('');
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [previousReply, setPreviousReply] = useState<string>(''); // İlk yanıt
  const [commentInput, setCommentInput] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null); // Hover efekti
  const auth = useSelector((state: any) => state.auth);
  const [emailTypes, setEmailTypes] = useState<{ id: number; name: string }[]>([]); // Updated state

 

  const productProfiles = [
    { id: 1, name: 'Tech Product' },
    { id: 2, name: 'Fashion Item' }
  ];

  const aiTemplates = [
    { id: 1, name: 'Professional Announcement' },
    { id: 2, name: 'Community Update' }
  ];

  const handleGenerateHtml = async () => {
    const campaignInput = `Generate html with this generated Campaign Content: ${generatedCampaign}`;
    try {
      const response = await axiosInstance.post('/assistants', {
        userId: auth.id,
        chatId: auth.id,
        userMessage: campaignInput
      });
      const htmlData = response.data;
      setGeneratedHtml(htmlData!=null?htmlData:generatedHtml);
      handleDownloadHtml(htmlData); // HtmlData ile direkt indir
    } catch (error) {
      console.error('Error generating HTML:', error);
      alert('Failed to generate HTML.');
    }
  };
  useEffect(() => {
    fetchEmailTypes();
  }, []);

  const fetchEmailTypes = async () => {
    try {
      const response = await axiosInstance.get('/email-types');
      // Ensure response data is an array

      console.log(response.data)
      if (Array.isArray(response.data)) {-
        setEmailTypes(response.data);
      } else {
        console.error('Expected response data to be an array:', response.data);
        setEmailTypes([]); // Default to empty array if not an array
      }
    } catch (error) {
      console.error('Error fetching email types:', error);
      setEmailTypes([]); // Default to empty array on error
    }
  };
  const handleGenerateCampaign = async () => {
    const campaignInput = `Email Type: ${emailType}, Product Profile: ${productProfile}, AI Template: ${aiTemplate}`;
    try {
      const response = await axiosInstance.post('/assistants', {
        userId: auth.id,
        chatId: auth.id,
        userMessage: campaignInput
      });
      const campaignData = response.data;
      setGeneratedCampaign(campaignData);
      setPreviousReply(campaignData); // İlk yanıtı kaydet
    } catch (error) {
      console.error('Error generating campaign:', error);
      alert('Failed to generate campaign.');
    }
  };

  const handleLearnChanges = async () => {
    if (!previousReply) {
      alert('No previous reply to learn from.');
      return;
    }

    try {
      const campaignInput = `Email Type: ${emailType}, Product Profile: ${productProfile}, AI Template: ${aiTemplate}`;

      await axiosInstance.post('/assistants/learn', {
        customerMessage: campaignInput,
        originalResponse: previousReply,
        editedResponse: generatedCampaign,
        rating,
        userId: auth.id
      });
      alert('AI has learned from your changes.');
      setPreviousReply('');
      setGeneratedCampaign('');
      setRating(0); // Gönderim sonrası sıfırla
    } catch (error) {
      console.error('Error learning changes:', error);
      alert('Failed to learn changes.');
    }
  };

  const handleGenerateComment = async () => {
    try {
      const response = await axiosInstance.post('/assistants', {
        userId: auth.id,
        chatId: auth.id,
        userMessage: "This is a user comment for the campaign: " + commentInput +"change this:" +generatedCampaign});
      setGeneratedCampaign(response.data); 
      alert('Comment processed and reply regenerated.');
    } catch (error) {
      console.error('Error regenerating reply:', error);
      alert('Failed to regenerate reply.');
    }
  };

  const handleDownloadHtml = (responseData: string) => {
    const blob = new Blob([responseData], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email_campaign.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    <Card>
      <CardHeader className="text-lg font-bold">Campaign Generator</CardHeader>
      <div className="space-y-4">
        <div className="border rounded p-4 space-y-4">
          <div className="space-y-2">
            <label className="font-medium">1. Email Type</label>
            <select
              className="w-full p-2 border rounded"
              value={emailType}
              onChange={(e) => setEmailType(e.target.value)}
            >
              <option value="">Choose campaign type</option>
              {emailTypes.map((type) => (
                <option key={type.id} value={type.name}>{type.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-medium">2. Choose Product Profile</label>
            <select
              className="w-full p-2 border rounded"
              value={productProfile}
              onChange={(e) => setProductProfile(e.target.value)}
            >
              <option value="">Select product profile</option>
              {productProfiles.map((profile) => (
                <option key={profile.id} value={profile.name}>{profile.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-medium">3. Choose AI Template</label>
            <select
              className="w-full p-2 border rounded"
              value={aiTemplate}
              onChange={(e) => setAiTemplate(e.target.value)}
            >
              <option value="">Select template</option>
              {aiTemplates.map((template) => (
                <option key={template.id} value={template.name}>{template.name}</option>
              ))}
            </select>
          </div>

          <Button className="w-full" onClick={handleGenerateCampaign}>Generate Campaign</Button>

          <div className="border rounded p-4 min-h-32 bg-gray-50 mt-4">
            <p className="text-gray-400">{generatedCampaign || 'Generated content will appear here...'}</p>
          </div>

          <div className="flex space-x-2 mt-4">
            <Button className="flex-1" onClick={handleGenerateCampaign}>
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
            <Button className="flex-1" onClick={handleGenerateHtml}>
              <BiDownload className="w-4 h-4 mr-2" />
              Download as HTML
            </Button>
          </div>

          {/* Learn My Changes and Rating Section */}
          <div className="generated-reply mt-4">
            <h3 className="text-lg font-semibold mb-2">Adjust Reply and Learn</h3>
            <textarea
              placeholder="Adjust the reply here..."
              value={generatedCampaign}
              onChange={(e) => setGeneratedCampaign(e.target.value)}
              className="textarea mb-4"
            />

            {/* Rating Section */}
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

            <Button onClick={handleLearnChanges} className="primary mb-4">
              Learn My Changes
            </Button>
          </div>

          <div className="comment-input mt-4">
            <h3 className="text-lg font-semibold mb-2">Add a Comment:</h3>
            <textarea
              placeholder="Comment about the response..."
              value={commentInput}
              onChange={(e) => handleTextAreaChange(e, setCommentInput)}
              className="textarea mb-4"
            />
            <Button onClick={handleGenerateComment}>Regenerate Response Based on Comment</Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EmailCampaigns;
