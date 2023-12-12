import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios';
import type { ResponseModel, UploadFileItemModel, UploadRequestConfig } from '@/utils/axiosService/types';
import { HttpCodeConfig } from '@/utils/axiosService/httpCode.ts';

class AxiosService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_APP_BASE_URL,
      timeout: 5 * 1000 // 请求超时时间
    });

    this.axiosInstance.interceptors.request.use(
      this.handleRequestConfig,
      this.handleRequestError,
      {
        synchronous: false, //是否同步
        runWhen: ((config: InternalAxiosRequestConfig) => {
          console.log(config);
          // do something
          // if return true, axios will execution interceptor method
          return true
        })
      }
    );

    this.axiosInstance.interceptors.response.use(
      this.handleResponse,
      this.handleResponseError,
    );

  }

  private handleRequestConfig = (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么，例如加入token
    return config;
  };

  private handleRequestError = (error: AxiosError) => {
    // 对请求错误做些什么
    console.error(error); // for debug
    return Promise.reject(error);
  };

  private handleResponse = (response: AxiosResponse<ResponseModel>): ResponseModel['data'] => {
    const { data } = response
    const { code } = data
    // 对响应数据做点什么，例如解析返回的数据
    if (code) {
      if (code != HttpCodeConfig.success) {
        switch (code) {
          case HttpCodeConfig.notFound:
            // the method to handle this code
            break;
          case HttpCodeConfig.noPermission:
            // the method to handle this code
            break;
          default:
            break;
        }
        return Promise.reject(data.message)
      } else {
        return data
      }
    } else {
      return Promise.reject('Error! code missing!')
    }
  };

  private handleResponseError = (error: unknown) => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }

  request<T = any>(config: AxiosRequestConfig): Promise<ResponseModel<T>> {
    /**
     * TODO: execute other methods according to config
     */
    return new Promise((resolve, reject) => {
      this.axiosInstance.request<ResponseModel<T>>(config)
        .then((res: AxiosResponse['data']) => {
          resolve(res as ResponseModel<T>);
        })
        .catch((err) => {
          // do something
          reject(err)
        })
    })
  }

  get<T = any>(config: AxiosRequestConfig): Promise<ResponseModel<T>> {
    return this.request({ method: 'GET', ...config })
  }
  post<T = any>(config: AxiosRequestConfig): Promise<ResponseModel<T>> {
    return this.request({ method: 'POST', ...config })
  }
  put<T = any>(config: AxiosRequestConfig): Promise<ResponseModel<T>> {
    return this.request({ method: 'PUT', ...config })
  }
  delete<T = any>(config: AxiosRequestConfig): Promise<ResponseModel<T>> {
    return this.request({ method: 'DELETE', ...config })
  }

  upload<T = string>(fileItem: UploadFileItemModel, config?: UploadRequestConfig): Promise<ResponseModel<T>> | null {
    if (!import.meta.env.VITE_UPLOAD_URL) return null

    const fd = new FormData()
    fd.append(fileItem.name, fileItem.value)
    let configCopy: UploadRequestConfig
    if (!config) {
      configCopy = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    } else {
      config.headers!['Content-Type'] = 'multipart/form-data'
      configCopy = config
    }
    return this.request({ url: import.meta.env.VITE_UPLOAD_URL, data: fd, ...configCopy })
  }

}

const axiosService = new AxiosService();
export { axiosService };
