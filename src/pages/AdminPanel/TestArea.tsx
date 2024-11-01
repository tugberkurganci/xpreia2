import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle ,Button} from "./card.tsx";

import { ChevronDown } from "lucide-react";
import axiosInstance from '../../utils/axiosInterceptors';

interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  className?: string;
}

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

interface CollapsibleSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

type SectionType = 'learning' | 'guidelines' | 'html' | 'improvement' | '';
type TabType = 'basic' | 'advanced';

const TestArea: React.FC = () => {
  const [brandIdentity, setBrandIdentity] = useState<string>('');
  const [previousEmails, setPreviousEmails] = useState<string>('');
  const [templateEmails, setTemplateEmails] = useState<string>('');
  const [companyWebsite, setCompanyWebsite] = useState<string>('');
  const [otherInfo, setOtherInfo] = useState<string>('');
  const [personalizedLearning, setPersonalizedLearning] = useState<string>('');
  const [emailCampaignGuidelines, setEmailCampaignGuidelines] = useState<string>('');
  const [aiHtmlCreation, setAiHtmlCreation] = useState<string>('');
  const [continuousImprovement, setContinuousImprovement] = useState<string>('');
  
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [expandedSection, setExpandedSection] = useState<SectionType>('');
  const [showHtmlPreview, setShowHtmlPreview] = useState<boolean>(false);

  const fetchContent = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get('/guides/1');
      const content = response.data.content;
      
      const contentParts = content.split('|||');
      contentParts.forEach((part: string) => {
        const indexOfColon = part.indexOf(':');
        if (indexOfColon !== -1) {
          const key = part.slice(0, indexOfColon).trim();
          const value = part.slice(indexOfColon + 1).trim();
          
          switch (key) {
            case 'brandIdentity':
              setBrandIdentity(value);
              break;
            case 'previousEmails':
              setPreviousEmails(value);
              break;
            case 'templateEmails':
              setTemplateEmails(value);
              break;
            case 'companyWebsite':
              setCompanyWebsite(value);
              break;
            case 'otherInfo':
              setOtherInfo(value);
              break;
            case 'personalizedLearning':
              setPersonalizedLearning(value);
              break;
            case 'emailCampaignGuidelines':
              setEmailCampaignGuidelines(value);
              break;
            case 'aiHtmlCreation':
              setAiHtmlCreation(value);
              break;
            case 'continuousImprovement':
              setContinuousImprovement(value);
              break;
            default:
              break;
          }
        }
      });
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleUpdateContent = async (): Promise<void> => {
    const updatedContent = `brandIdentity:${brandIdentity} ||| previousEmails:${previousEmails} ||| templateEmails:${templateEmails} ||| companyWebsite:${companyWebsite} ||| otherInfo:${otherInfo} ||| personalizedLearning:${personalizedLearning} ||| emailCampaignGuidelines:${emailCampaignGuidelines} ||| aiHtmlCreation:${aiHtmlCreation} ||| continuousImprovement:${continuousImprovement}`;
    
    try {
      if(brandIdentity.length<3){ await axiosInstance.post('/guides', { 
        content: updatedContent, 
        guideType: "GeneralGuide" 
      });}else
      await axiosInstance.post('/guides/1', { 
        content: updatedContent, 
        guideType: "GeneralGuide" 
      });
      alert('Content successfully updated!');
    } catch (error) {
      console.error('Error updating content:', error);
      alert('An error occurred while updating the content.');
    }
  };

  const TextArea: React.FC<TextAreaProps> = ({ value, onChange, placeholder, className }) => (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32 ${className || ''}`}
      maxLength={2000}
    />
  );



  const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg ${
        isActive 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );

  const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, isExpanded, onToggle, children }) => (
    <div className="border rounded-lg mb-4">
      <button
        onClick={onToggle}
        className="w-full p-4 flex justify-between items-center bg-gray-50 rounded-t-lg"
      >
        <span className="font-medium">{title}</span>
        <ChevronDown 
          className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>
      {isExpanded && (
        <div className="p-4 border-t">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">General Guide Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex space-x-4">
            <TabButton 
              isActive={activeTab === 'basic'} 
              onClick={() => setActiveTab('basic')}
            >
              Basic Information
            </TabButton>
            <TabButton 
              isActive={activeTab === 'advanced'} 
              onClick={() => setActiveTab('advanced')}
            >
              Advanced Settings
            </TabButton>
          </div>

          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="font-medium">Brand Identity</label>
                <TextArea
                  value={brandIdentity}
                  onChange={(e) => setBrandIdentity(e.target.value)}
                  placeholder="Enter brand identity details..."
                />
              </div>

              <div className="space-y-2">
                <label className="font-medium">Previous Emails Sent</label>
                <TextArea
                  value={previousEmails}
                  onChange={(e) => setPreviousEmails(e.target.value)}
                  placeholder="Enter previous email examples..."
                />
              </div>

              <div className="space-y-2">
                <label className="font-medium">Template Emails</label>
                <TextArea
                  value={templateEmails}
                  onChange={(e) => setTemplateEmails(e.target.value)}
                  placeholder="Enter template emails..."
                />
              </div>

              <div className="space-y-2">
                <label className="font-medium">Company Website</label>
                <TextArea
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  placeholder="Enter company website URL..."
                />
              </div>

              <div className="space-y-2">
                <label className="font-medium">Any Other Info</label>
                <TextArea
                  value={otherInfo}
                  onChange={(e) => setOtherInfo(e.target.value)}
                  placeholder="Enter any additional information..."
                />
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-4">
              <CollapsibleSection
                title="Personalized Learning and AI Training"
                isExpanded={expandedSection === 'learning'}
                onToggle={() => setExpandedSection(expandedSection === 'learning' ? '' : 'learning')}
              >
                <TextArea
                  value={personalizedLearning}
                  onChange={(e) => setPersonalizedLearning(e.target.value)}
                  placeholder="Enter personalized learning details..."
                />
              </CollapsibleSection>

              <CollapsibleSection
                title="Email Campaign Guidelines"
                isExpanded={expandedSection === 'guidelines'}
                onToggle={() => setExpandedSection(expandedSection === 'guidelines' ? '' : 'guidelines')}
              >
                <TextArea
                  value={emailCampaignGuidelines}
                  onChange={(e) => setEmailCampaignGuidelines(e.target.value)}
                  placeholder="Enter campaign guidelines..."
                />
              </CollapsibleSection>

              <CollapsibleSection
                title="AI-Driven HTML Email Creation"
                isExpanded={expandedSection === 'html'}
                onToggle={() => setExpandedSection(expandedSection === 'html' ? '' : 'html')}
              >
                <div className="space-y-4">
                  <div className="flex justify-end space-x-4">
                    <TabButton 
                      isActive={!showHtmlPreview} 
                      onClick={() => setShowHtmlPreview(false)}
                    >
                      Edit HTML
                    </TabButton>
                    <TabButton 
                      isActive={showHtmlPreview} 
                      onClick={() => setShowHtmlPreview(true)}
                    >
                      Preview
                    </TabButton>
                  </div>
                  
                  {showHtmlPreview ? (
                    <div className="border rounded-md p-4 min-h-64 bg-white">
                      <div dangerouslySetInnerHTML={{ __html: aiHtmlCreation }} />
                    </div>
                  ) : (
                    <TextArea
                      value={aiHtmlCreation}
                      onChange={(e) => setAiHtmlCreation(e.target.value)}
                      placeholder="Enter HTML code here..."
                      className="min-h-64 font-mono"
                    />
                  )}
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                title="Continuous Improvement and AI Learning"
                isExpanded={expandedSection === 'improvement'}
                onToggle={() => setExpandedSection(expandedSection === 'improvement' ? '' : 'improvement')}
              >
                <TextArea
                  value={continuousImprovement}
                  onChange={(e) => setContinuousImprovement(e.target.value)}
                  placeholder="Enter continuous improvement details..."
                />
              </CollapsibleSection>
            </div>
          )}

          <Button 
            onClick={handleUpdateContent} 
            className="w-full mt-6"
          >
            Update Content
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestArea;