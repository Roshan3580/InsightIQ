const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface QueryRequest {
  query: string;
  dataset_id?: number;
}

export interface QueryResponse {
  success: boolean;
  query: string;
  sql?: string;
  data: any[];
  query_type: string;
  visualization_type: string;
  explanation?: string;
  execution_time: number;
  confidence: number;
  error?: string;
}

export interface Dataset {
  id: number;
  name: string;
  description: string;
  row_count: number;
  column_count: number;
  schema: any;
  sample_data: any;
  created_at: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  dataset: Dataset;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Query endpoints
  async processQuery(request: QueryRequest): Promise<QueryResponse> {
    return this.request<QueryResponse>('/query', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getQueryHistory(limit: number = 10): Promise<any> {
    return this.request(`/query/history?limit=${limit}`);
  }

  async getQueryDetails(queryId: number): Promise<any> {
    return this.request(`/query/${queryId}`);
  }

  // Upload endpoints
  async uploadCSV(
    file: File,
    datasetName: string,
    description: string = ''
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dataset_name', datasetName);
    formData.append('description', description);

    const url = `${this.baseUrl}/upload/csv`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }

  async getDatasets(): Promise<{ success: boolean; datasets: Dataset[] }> {
    return this.request('/datasets');
  }

  async getDatasetDetails(datasetId: number): Promise<any> {
    return this.request(`/datasets/${datasetId}`);
  }

  async deleteDataset(datasetId: number): Promise<any> {
    return this.request(`/datasets/${datasetId}`, {
      method: 'DELETE',
    });
  }

  // Dashboard endpoints
  async getDashboards(): Promise<any> {
    return this.request('/dashboards');
  }

  async getDashboardDetails(dashboardId: number): Promise<any> {
    return this.request(`/dashboards/${dashboardId}`);
  }

  async createDashboard(name: string, description: string = '', isPublic: boolean = false): Promise<any> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('is_public', isPublic.toString());

    const url = `${this.baseUrl}/dashboards`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create dashboard failed:', error);
      throw error;
    }
  }

  async addWidgetToDashboard(
    dashboardId: number,
    title: string,
    widgetType: string,
    queryId: number,
    positionX: number = 0,
    positionY: number = 0,
    width: number = 6,
    height: number = 4,
    config: any = {}
  ): Promise<any> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('widget_type', widgetType);
    formData.append('query_id', queryId.toString());
    formData.append('position_x', positionX.toString());
    formData.append('position_y', positionY.toString());
    formData.append('width', width.toString());
    formData.append('height', height.toString());
    formData.append('config', JSON.stringify(config));

    const url = `${this.baseUrl}/dashboards/${dashboardId}/widgets`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Add widget failed:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService(); 