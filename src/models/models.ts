export interface TaskRequest {
  projectId?: number;  
  title?: string;
    description?: string;
    createdDate?: string;
    status?: string;
  }
  
  export interface TaskResponse {
    id: number;
    title: string;
    description: string;
    createdDate: string;
    status: string;
  }
  
  export interface ProjectRequest {
    projectName: string;
    startDate: string;
    endDate: string;
  }
  
  export interface ProjectResponse {
    id: number;
    projectName: string;
    startDate: string;
    endDate: string;
  }
  