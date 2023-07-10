import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
axios.defaults.withCredentials = true
class Ajax {
  private instance: AxiosInstance

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)

    this.instance.interceptors.request.use(this.handleRequest, Promise.reject)
    this.instance.interceptors.response.use(this.handleResponse, Promise.reject)
  }

  private handleRequest(config: AxiosRequestConfig): InternalAxiosRequestConfig {
    // 在这里可以添加一些请求前的处理，例如添加token到header      
    // 添加授权令牌
    debugger
    if (config.headers) {
      config.headers['Cookie'] = 'sessionid=52q1lw28tf8aztw5lohj42vj34amioi5; csrftoken=N4P5c8ytqVy1GbAcfQGkW9rW5zqgVo5efxbjxYsi6UsImITblLqzBdkBtRalSsk9'
      config.headers['Referer'] = 'http://localhost:8081/'
      config.headers['Origin'] = 'http://localhost:8081/'
    }
    return config as InternalAxiosRequestConfig
  }
  private handleResponse({ data, status }: AxiosResponse): any {
    // 在这里可以添加一些请求后的处理，例如错误处理
    // 检查错误状态码
    if (status >= 400) {
      throw new Error(data.message)
    }
    return data
  }

  public request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.instance.request(config)
  }

  public get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, { params, ...config })
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }

  // 可以按需添加其他http方法，例如put, delete等
}

export default new Ajax({
  baseURL: 'http://192.168.0.102:8080/', // 这里填写你的api地址
  timeout: 10000, // 请求超时时间
  withCredentials: true, // 允许携带cookie
})