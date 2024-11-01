import { useState, useRef, useEffect, ChangeEvent, DragEvent } from 'react';
import axiosInstance from '../utils/axiosInterceptors';
import { useSelector } from 'react-redux';
import { Loader2, Upload, X, FileText, Trash2 } from 'lucide-react';
import "./TraningData.css"

interface Document {
  id: string;
  name: string;
  vectorStoreId: string;
  fileType: string;
  uploadDate: string;
  size: number;
}

interface UploadedFile {
  file: File;
  name: string;
  content: string;
  size: number;
  uploadDate: Date;
  type: string;
}

const TrainingDataUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [existingDocuments, setExistingDocuments] = useState<Document[]>([]);
  const [category, setCategory] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [additionalInfo, setAdditionalInfo] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<string>('');
  const [error, setError] = useState<string>('');
  const auth = useSelector((state: any) => state.auth);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fileType && auth.id) {
      fetchExistingDocuments();
    }
  }, [fileType]);

  const fetchExistingDocuments = async () => {
    try {
      const response = await axiosInstance.get(`/documnts/filter`, {
        params: {
          userId: auth.id,
          fileType: fileType
        }
      });
      setExistingDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError('Failed to fetch existing documents');
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    const allowedFiles = files.filter(file =>
      file.type === 'text/plain' ||
      file.name.endsWith('.txt') ||
      file.name.endsWith('.doc') ||
      file.name.endsWith('.xlsx') ||
      (fileType.includes("Email") && file.name.endsWith('.eml'))
    );

    const newFiles: UploadedFile[] = [];

    for (const file of allowedFiles) {
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
        setError(`Failed to read file ${file.name}`);
      }
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleTrainAI = async () => {
    setIsLoading(true);
    setError('');
    try {
      const formData = new FormData();

      formData.append('file', uploadedFiles[0]?.file);
      formData.append('fileType', fileType);
      formData.append('additionalInfo', additionalInfo);
      formData.append('userId', auth.id);
      formData.append('isAdmin', auth.role);

      await axiosInstance.post('/assistants/upload', formData);
      await fetchExistingDocuments();
      setUploadedFiles([]);
      setAdditionalInfo('');

    } catch (error: any) {
      console.error('Error training AI:', error);
      setError('Failed to train AI: ' + (error.response?.data || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDocument = async (vectorStoreId: string) => {
    setIsDeleting(vectorStoreId);
    setError('');
    try {
      await axiosInstance.delete(`/documnts/vector-store/${vectorStoreId}`);
      await fetchExistingDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      setError('Failed to delete document');
    } finally {
      setIsDeleting('');
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName));
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 p-6">
        <h2 className="text-2xl font-bold text-gray-800">AI Training Data Upload</h2>
      </div>

      <div className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setFileType('');
                }}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Category</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Email Campaigns">Email Campaigns</option>
              </select>
            </div>

            {category && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File Type</label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Type</option>
                  {category === 'Customer Service' && (
                    <>
                      <option value="brandIdentity">Brand Identity</option>
                      <option value="previousEmailsSent">Previous Emails Sent</option>
                      <option value="templateEmails">Template Emails</option>
                      <option value="companyWebsite">Company Website</option>
                      <option value="otherInfo">Any Other Info</option>
                    </>
                  )}
                  {category === 'Email Campaigns' && (
                    <>
                      <option value="brandIdentity">Brand Identity</option>
                      <option value="previousSuccessfulCampaigns">Previous Successful Campaigns</option>
                      <option value="companyInfo">Company Information</option>
                      <option value="customerAvatar">Customer Avatar</option>
                      <option value="productInfo">Product Information</option>
                      <option value="otherInfo">Any Other Info</option>
                    </>
                  )}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Enter any additional info..."
            />
          </div>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'
            }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            accept={
              fileType === 'previousEmailsSent'
                ? '.txt,.doc,.eml,.xlsx'
                : fileType === 'otherInfo'
                  ? '.txt,.doc,'
                  : '.txt,.doc'
            } className="hidden"
          />
          <div className="space-y-4">
            <Upload className="w-12 h-12 mx-auto text-gray-400" />
            <div>
              <p className="text-gray-600">
                Drag and drop {fileType === "previousEmailsSent"
                  ? "TXT, DOC, or EML XLSX files"
                  : fileType === "otherInfo"
                    ? "TXT, DOC, or XLSX files"
                    : "TXT or DOC files"} here or              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Choose Files
              </button>

            </div>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Uploaded Files</h3>
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <FileText className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB • Uploaded {file.uploadDate.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(file.name)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {existingDocuments.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Existing Documents</h3>
            <div className="space-y-2">
              {existingDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <FileText className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-500">
                        Type: {doc.fileType} • FileName :{doc.name} • {(doc.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteDocument(doc.vectorStoreId)}
                    disabled={isDeleting === doc.vectorStoreId}
                    className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isDeleting === doc.vectorStoreId ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleTrainAI}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Train AI'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingDataUpload;