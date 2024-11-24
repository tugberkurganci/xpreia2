import React, { useState, ChangeEvent, useEffect } from 'react';
import axiosInstance from './../utils/axiosInterceptors';
import { Card, CardHeader, Button } from 'react-bootstrap';
import { BiDownload } from 'react-icons/bi';
import { FaStar } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import "./EmailCampaings.css";

const EmailCampaigns: React.FC = () => {
  const [emailType, setEmailType] = useState<{ id: number; name: string; description: string }>();
  const [productProfile, setProductProfile] = useState<{ id: number; name: string;content:string; vectorStoreId: string }>();
  const [aiTemplate, setAiTemplate] = useState<{ id: number; name: string; content: string }>();
  const [generatedCampaign, setGeneratedCampaign] = useState<string>('');
  const [generatedHtml, setGeneratedHtml] = useState<any>();
  const [previousReply, setPreviousReply] = useState<string>(''); // İlk yanıt
  const [commentInput, setCommentInput] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null); // Hover efekti
  const auth = useSelector((state: any) => state.auth);
  const [emailTypes, setEmailTypes] = useState<{ id: number; name: string; description: string }[]>([]); // Updated state
  const [aiTemplates, setAiTemplates] = useState<{ id: number; name: string; content: string }[]>([]);
  const [productProfiles, setProductProfiles] = useState<{ id: number; name: string;content:string; vectorStoreId: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const handleGenerateHtml = async (campaignData: string) => {


    debugger
    const sanitizedHtml = DOMPurify.sanitize(campaignData);

    setGeneratedHtml(parse(sanitizedHtml));
  };
  useEffect(() => {
    fetchEmailTypes();
    fetchAiTemplates();
    fetchProductProfiles();
  }, []);
  useEffect(() => {
    console.log(generatedCampaign);

  }, [generatedCampaign]);


  const fetchEmailTypes = async () => {

    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/email-types/${auth.id}`);
      // Ensure response data is an array

      console.log(response.data)
      if (Array.isArray(response.data)) {
        -
          setEmailTypes(response.data);
      } else {
        console.error('Expected response data to be an array:', response.data);
        setEmailTypes([]); // Default to empty array if not an array
      }

    setIsLoading(false);

    } catch (error) {
      console.error('Error fetching email types:', error);
      setEmailTypes([]); // Default to empty array on error
    }

    setIsLoading(false);
  };



  const fetchAiTemplates = async () => {
    try {
      
      const response = await axiosInstance.get(`/guides/user/${auth.id}/aiTypes`);
      // Ensure response data is an array

      console.log(response.data)
      if (Array.isArray(response.data)) {
        -
          setAiTemplates(response.data);
      } else {
        console.error('Expected response data to be an array:', response.data);
        setAiTemplates([]); // Default to empty array if not an array
      }
    } catch (error) {
      console.error('Error fetching email types:', error);
      setAiTemplates([]); // Default to empty array on error
    }
  };
  const handleGenerateCampaign = async () => {
    setIsLoading(true);

    const campaignInput = `Generate Email Campaing  and generate Html  with theese informations :Email Type:  ${emailType?.name} content : ${emailType?.description},
    only select this Product Profile : ${productProfile?.name}  content : ${productProfile?.content}  dont add another.  
     ONLY  SELECT :"${aiTemplate?.content}" AND GENERATE, html kodunu oluştur bu bilgilerle`;

   /*  const campaignInput = `Generate Email Campaing  and generate Html  with theese informations :Email Type:  ${emailType?.name} content : ${emailType?.description},
     only select this Product Profile : ${productProfile?.name}  content : ${productProfile?.description}  dont add another.  
      ONLY  SELECT :"${aiTemplate?.name}" AND GENERATE, html kodunu oluştur bu bilgilerle .`;
*/
    console.log(campaignInput)
    try {
      const response = await axiosInstance.post('/assistants', {
        userId: auth.id,
        chatId: auth.id,
        userMessage: campaignInput
      });
      const campaignData = response.data;

      setGeneratedCampaign(campaignData);
      setPreviousReply(campaignData); // İlk yanıtı kaydet
      handleGenerateHtml(campaignData)
      setIsLoading(false);

    } catch (error) {
      console.error('Error generating campaign:', error);
      alert('Failed to generate campaign.');
      setIsLoading(false);

    }
  };

  const handleLearnChanges = async () => {
    setIsLoading(true);

    if (!previousReply) {
      alert('No previous reply to learn from.');
      return;
    }

    try {
      const campaignInput = `Generate Email Campaing  and generate Html  with theese informations :Email Type:  ${emailType?.name} content : ${emailType?.description},
      only select this Product Profile : ${productProfile?.name}  content : ${productProfile?.content}  dont add another.  
       ONLY  SELECT :"${aiTemplate?.content}" AND GENERATE, html kodunu oluştur bu bilgilerle`;
        await axiosInstance.post('/assistants/learn', {
        customerMessage: campaignInput,
        originalResponse: generatedCampaign,
        editedResponse: previousReply,
        rating,
        userId: auth.id
      });
      alert('AI has learned from your changes.');
      setPreviousReply('');
      setGeneratedCampaign("");
      setRating(0); // Gönderim sonrası sıfırla
      setIsLoading(false);

    } catch (error) {
      console.error('Error learning changes:', error);
      alert('Failed to learn changes.');
      setIsLoading(false);

    }
  };

  const handleGenerateComment = async () => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/assistants', {
        userId: auth.id,
        chatId: auth.id,
        userMessage: "This is a user comment for the campaign: " + commentInput + ". Change this:" + generatedCampaign
      });
      const result = response.data
      console.log(result)
      setGeneratedCampaign(result);
      setPreviousReply(result)
          handleGenerateHtml(result)

      alert('Comment processed andd reply regenerated.');
      setIsLoading(false);

    } catch (error) {
      console.error('Error regenerating reply:', error);
      alert('Failed to regenerate reply.');
      setIsLoading(false);

    }
  };


  const handleDownloadHtml = () => {
    setIsLoading(true);

    const blob = new Blob([generatedCampaign], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email_campaign.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);      
    setIsLoading(false);

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

  const fetchProductProfiles = async () => {
    try {
      const response = await axiosInstance.get(`/documnts/filter`, {
        params: {
          userId: auth.id,
          fileType: "productInfo"
        }
      });
      setProductProfiles(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };


  const selectAiTemplate = async (name: string) => {
    const selectedTemplate = aiTemplates.find((e) => e.name === name);
    setAiTemplate(selectedTemplate || undefined);
  };

  const selectEmailType = async (name: string) => {
    const selectedTemplate = emailTypes.find((e) => e.name === name);
    setEmailType(selectedTemplate || undefined);
  };

  const selectProductProfile = async (name: string) => {
    const selectedTemplate = productProfiles.find((e) => e.name === name);
    setProductProfile(selectedTemplate || undefined);
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
              value={emailType?.name}
              onChange={(e) => { selectEmailType(e.target.value) }}
            >
              <option value="">Choose campaign type</option>
              {emailTypes.map((type) => (
                <option key={type.id} value={type.name}>{type.name}</option>
              ))}
            </select>
          </div>

          {emailType?.name === "Product" && <div className="space-y-2">
            <label className="font-medium">2. Choose Product Profile</label>
            <select
              className="w-full p-2 border rounded"
              value={productProfile?.name}
              onChange={(e) => { selectProductProfile(e.target.value) }}
            >
              <option value="">Select product profile</option>
              {productProfiles.map((profile) => (
                <option key={profile.id} value={profile.name}>{profile.name}</option>
              ))}
            </select>
          </div>}

          <div className="space-y-2">
            <label className="font-medium">3. Choose AI Template</label>
            <select
              className="w-full p-2 border rounded"
              value={aiTemplate?.name}
              onChange={(e) => { selectAiTemplate(e.target.value) }}
            >
              <option value="">Select template</option>
              {aiTemplates.map((template) => (
                <option key={template.id} value={template.name}>{template.name}</option>
              ))}
            </select>
          </div>

          <Button className="w-full" onClick={handleGenerateCampaign}>{isLoading?"Generating ":"Generate Campaign"}</Button>

          <div className="border rounded p-4 min-h-32 bg-gray-50 mt-4">
            <p className="text-gray-400">{'Generated content will appear here...'}</p>
            {/* HTML Preview */}
            {generatedHtml && (
              <div className="html-preview mt-4 p-2 border-t">
                {generatedHtml}
              </div>
            )}
          </div>
          <div className="flex items-start space-x-4 mt-4">
            {/* Comment Input Section */}
            <div className="space-y-4 mt-4">
              {/* Comment Input Section */}
              <div className="max-w-sm">
                <h3 className="text-lg font-semibold mb-2">Add a Comment:</h3>
                <textarea
                  placeholder="Comment about the response..."
                  value={commentInput}
                  onChange={(e) => handleTextAreaChange(e, setCommentInput)}
                  className="textarea w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>

              {/* Buttons Section */}
              <div className="grid grid-cols-2 gap-4">
                <Button className="flex items-center justify-center space-x-1 px-4 py-2 bg-blue-500 text-white rounded-md w-full" onClick={handleGenerateComment}>
                  {isLoading?"Loading":"Regenerate Response Based on Comment"}
                </Button>
                <Button className="flex items-center justify-center space-x-1 px-4 py-2 bg-green-500 text-white rounded-md w-full" onClick={handleDownloadHtml}>
                  <BiDownload className="w-4 h-4" />
                  <span>{isLoading?"Loading":"Download as HTML"}</span>
                </Button>
              </div>
            </div>
          </div>
          {/* Learn My Changes and Rating Section */}
          <div className="generated-reply mt-4">
            <h3 className="text-lg font-semibold mb-2">Adjust Reply and Learn</h3>
            <textarea
              placeholder="Adjust the reply here..."
              value={previousReply}
              onChange={(e) => setPreviousReply(e.target.value)}
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
             {isLoading?"Loading":"Learn My Changes" }
            </Button>
          </div>


        </div>
      </div>
    </Card>
  );
};

export default EmailCampaigns;
