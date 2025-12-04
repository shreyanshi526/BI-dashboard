import Axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

class CoreAPIService {
  private readonly axiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = Axios.create({ baseURL });

    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.headers['device_type'] = 'web';
        return config;
      },
      (error: AxiosError) =>
        Promise.reject(error instanceof Error ? error : new Error(String(error))),
    );
  }

  private readonly responseData = <T>(response: AxiosResponse<any>): T => {
    if (!response || !response.data) {
      return null as T;
    }

    const responseData = response.data;

    if (typeof responseData === 'object' && responseData !== null && 'data' in responseData) {
      const extractedData = responseData.data;
      if (extractedData !== undefined && extractedData !== null) {
        return extractedData as T;
      }
      return responseData as T;
    }

    return responseData as T;
  };

  private readonly handleError = async (error: AxiosError): Promise<never> => {
    throw error;
  };

  async get<T>(url: string, params: Record<string, unknown> = {}): Promise<T> {
    return this.axiosInstance
      .get<T>(url, { params })
      .then((response) => this.responseData<T>(response))
      .catch(this.handleError);
  }

  async post<T>(
    url: string,
    data: Record<string, unknown> = {},
    config: AxiosRequestConfig = {},
    raw: boolean = false,
  ): Promise<T | AxiosResponse<T>> {
    return this.axiosInstance
      .post<T>(url, data, config)
      .then((res) => (raw ? res : this.responseData<T>(res)))
      .catch(this.handleError);
  }

  async put<T>(url: string, data: Record<string, unknown> = {}): Promise<T> {
    return this.axiosInstance
      .put<T>(url, data)
      .then((response) => this.responseData<T>(response))
      .catch(this.handleError);
  }

  async patch<T>(url: string, data: Record<string, unknown> = {}): Promise<T> {
    return this.axiosInstance
      .patch<T>(url, data)
      .then((response) => this.responseData<T>(response))
      .catch(this.handleError);
  }

  async delete<T>(url: string, data: Record<string, unknown> = {}): Promise<T> {
    return this.axiosInstance
      .delete<T>(url, { data })
      .then((response) => this.responseData<T>(response))
      .catch(this.handleError);
  }
}

export default CoreAPIService;
