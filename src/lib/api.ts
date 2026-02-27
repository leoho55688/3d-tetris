import axios, { type AxiosResponse, AxiosError } from 'axios'
import { Ok, Err, type Result } from '../utils/result'

/**
 * Makes a GET request to a specified URL using axios.
 *
 * @template T The expected type of the response data.
 * @param {string} url The URL to make the GET request to.
 * @param {Record<string, any>} [params] Optional query parameters to include in the request.
 * @returns {Promise<Result<T, AxiosError>>} A promise that resolves with a Result type.
 */
export async function get<T>(
  url: string,
  params?: Record<string, any>
): Promise<Result<T, AxiosError>> {
  try {
    const response: AxiosResponse<T> = await axios.get(url, { params })
    return Ok(response.data)
  } catch (error) {
    const axiosError = error as AxiosError
    if (axiosError.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', axiosError.response.data)
      console.error('Status:', axiosError.response.status)
      console.error('Headers:', axiosError.response.headers)
    } else if (axiosError.request) {
      // The request was made but no response was received
      console.error('No response received:', axiosError.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', axiosError.message)
    }
    return Err(axiosError)
  }
}
