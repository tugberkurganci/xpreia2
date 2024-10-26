import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import axiosInstance from '../utils/axiosInterceptors';
import { useSelector } from 'react-redux';


const TrainingDataUpload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [fileType, setFileType] = useState<string>('');
  const [additionalInfo, setAdditionalInfo] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const auth = useSelector((state:any) => state.auth);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]): Promise<void> => {
    const textFiles = files.filter(file =>
      file.type === 'text/plain' || file.name.endsWith('.txt')
    );

    const newFiles: any[] = [];

    for (const file of textFiles) {
      try {
        const text = await file.text();
        newFiles.push({
          file,
          name: file.name,
          content: text,
          size: file.size,
          uploadDate: new Date(),
          type: fileType,
        });
      } catch (error) {
        console.error(`Error reading file ${file.name}:`, error);
      }
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleTrainAI = async (): Promise<void> => {
    try {
      const formData = new FormData();
      if (uploadedFiles.length > 0) {
        formData.append('file', uploadedFiles[0].file);
        formData.append('fileType', fileType);
        formData.append('additionalInfo', additionalInfo);
        formData.append('userId',auth.id); // Include userId
        formData.append('isAdmin', auth.role); // Include isAdmin
      } else {
        alert('No files uploaded.');
        return;
      }

      const response = await axiosInstance.post('/assistants/upload', formData);
      alert('AI training initiated successfully: ' + response.data);
    setUploadedFiles([])
    } catch (error: any) {
      console.error('Error training AI:', error);
      alert('Failed to initiate AI training: ' + (error.response?.data || error.message));
    }
  };

  const handleRemoveFile = (fileName: string): void => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName));
  };

  return (
    <div className="training-section">
      <h2 className="text-2xl font-semibold mb-4">AI Training Data</h2>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`drag-drop-area ${isDragging ? 'dragging' : ''}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept=".txt"
          className="hidden"
        />
        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            Drag and drop TXT files here or
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="primary"
          >
            Choose Files
          </button>
        </div>
      </div>

   {  auth.role==="USER" && <div className="mb-4">
        <label className="block mb-2">Select File Type:</label>
        <select 
          value={fileType} 
          onChange={(e) => setFileType(e.target.value)} 
          className="border border-gray-300 rounded p-2"
        >
          <option value="">--Select Type--</option>
          <option value="productProfile">Product Profile</option>
          <option value="brandIdentity">Brand Identity</option>
          <option value="examplesOfGoodEmails">Examples of Good Emails</option>
          <option value="customerAvatar">Customer Avatar</option>
          <option value="otherInfo">Any Other Info</option>
        </select>
      </div>}

      <div className="mb-4">
        <label className="block mb-2">Additional Information:</label>
        <input 
          type="text" 
          value={additionalInfo} 
          onChange={(e) => setAdditionalInfo(e.target.value)} 
          className="border border-gray-300 rounded p-2 w-full" 
          placeholder="Enter any additional info related to the file type..."
        />
      </div>

      <button onClick={handleTrainAI} className="primary mt-4">
        Train AI
      </button>

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files mt-4">
          <h3 className="text-lg font-semibold mb-2">Uploaded Training Files:</h3>
          <div className="space-y-2">
            {uploadedFiles.map((file: any) => (
              <div key={file.name} className="uploaded-file">
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    Size: {(file.size / 1024).toFixed(2)} KB | 
                    Uploaded: {file.uploadDate.toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveFile(file.name)}
                  className="danger"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingDataUpload;
