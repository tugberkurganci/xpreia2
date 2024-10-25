import React, { useState } from 'react';
import axiosInstance from './../utils/axiosInterceptors';
import { Card, CardHeader, Button } from 'react-bootstrap';
import { FiRefreshCw } from 'react-icons/fi';
import { BiDownload } from 'react-icons/bi';

const EmailCampaigns: React.FC = () => {
  const [emailType, setEmailType] = useState<string>('');
  const [productProfile, setProductProfile] = useState<string>('');
  const [aiTemplate, setAiTemplate] = useState<string>('');
  const [generatedCampaign, setGeneratedCampaign] = useState<string>('');
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const emailTypes = [
    { id: 1, name: 'Product' },
    { id: 2, name: 'Informational/News' },
    { id: 3, name: 'Community' },
    { id: 4, name: 'Sales' }
  ];

  const productProfiles = [
    { id: 1, name: 'Tech Product' },
    { id: 2, name: 'Fashion Item' }
  ];

  const aiTemplates = [
    { id: 1, name: 'Professional Announcement' },
    { id: 2, name: 'Community Update' }
  ];

  const handleGenerateHtml = async () => {
    const campaignInput = `Generate html with this generated Campaing Content ${generatedCampaign}}`;
    try {
      const response = await axiosInstance.post('/assistants', { userId: 1, chatId: 1, userMessage: campaignInput });
     console.log(response.data)
      await  setGeneratedHtml(response.data);

      handleDownloadHtml();
    } catch (error) {
      console.error('Error generating campaign:', error);
      alert('Failed to generate campaign.');
    }
  };

  
  const handleGenerateCampaign = async () => {
    debugger
    const campaignInput = `Email Type: ${emailType}, Product Profile: ${productProfile}, AI Template: ${aiTemplate}`;
    try {
      const response = await axiosInstance.post('/assistants', { userId: 1, chatId: 1, userMessage: campaignInput });
      setGeneratedCampaign(response.data);
    } catch (error) {
      console.error('Error generating campaign:', error);
      alert('Failed to generate campaign.');
    }
  };

  const handleDownloadHtml = () => {
    // HTML içeriğini oluşturuyoruz
 
    
    // HTML içeriğini bir dosya olarak indirmek için Blob ve URL.createObjectURL kullanıyoruz
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Kullanıcıya dosyayı indirmesi için bir bağlantı oluşturuyoruz
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email_campaign.html'; // İndirilirken kullanılacak dosya adı
    document.body.appendChild(a);
    a.click(); // Bağlantıya tıklıyoruz
    document.body.removeChild(a); // Bağlantıyı kaldırıyoruz
    URL.revokeObjectURL(url); // Oluşturulan URL'yi serbest bırakıyoruz
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
        </div>
      </div>
    </Card>
  );
};

export default EmailCampaigns;
