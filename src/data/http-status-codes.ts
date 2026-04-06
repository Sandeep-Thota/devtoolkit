export interface StatusCode {
  code: number
  name: string
  description: string
  category: string
}

export const statusCodes: StatusCode[] = [
  { code: 100, name: "Continue", description: "Server received request headers, client should proceed", category: "1xx Informational" },
  { code: 101, name: "Switching Protocols", description: "Server is switching protocols as requested", category: "1xx Informational" },
  { code: 200, name: "OK", description: "Request succeeded", category: "2xx Success" },
  { code: 201, name: "Created", description: "Request succeeded and a new resource was created", category: "2xx Success" },
  { code: 202, name: "Accepted", description: "Request accepted for processing, but not yet completed", category: "2xx Success" },
  { code: 204, name: "No Content", description: "Request succeeded but no content to return", category: "2xx Success" },
  { code: 206, name: "Partial Content", description: "Server is delivering only part of the resource", category: "2xx Success" },
  { code: 301, name: "Moved Permanently", description: "Resource has been permanently moved to a new URL", category: "3xx Redirection" },
  { code: 302, name: "Found", description: "Resource temporarily located at a different URL", category: "3xx Redirection" },
  { code: 304, name: "Not Modified", description: "Resource has not been modified since last request", category: "3xx Redirection" },
  { code: 307, name: "Temporary Redirect", description: "Temporary redirect preserving the HTTP method", category: "3xx Redirection" },
  { code: 308, name: "Permanent Redirect", description: "Permanent redirect preserving the HTTP method", category: "3xx Redirection" },
  { code: 400, name: "Bad Request", description: "Server cannot process the request due to client error", category: "4xx Client Error" },
  { code: 401, name: "Unauthorized", description: "Authentication is required and has failed or not been provided", category: "4xx Client Error" },
  { code: 403, name: "Forbidden", description: "Server understood request but refuses to authorize it", category: "4xx Client Error" },
  { code: 404, name: "Not Found", description: "Server cannot find the requested resource", category: "4xx Client Error" },
  { code: 405, name: "Method Not Allowed", description: "Request method is not supported for the resource", category: "4xx Client Error" },
  { code: 408, name: "Request Timeout", description: "Server timed out waiting for the request", category: "4xx Client Error" },
  { code: 409, name: "Conflict", description: "Request conflicts with the current state of the server", category: "4xx Client Error" },
  { code: 410, name: "Gone", description: "Resource is no longer available and will not be available again", category: "4xx Client Error" },
  { code: 413, name: "Payload Too Large", description: "Request entity is larger than server is willing to process", category: "4xx Client Error" },
  { code: 415, name: "Unsupported Media Type", description: "Server does not support the media type of the request", category: "4xx Client Error" },
  { code: 422, name: "Unprocessable Entity", description: "Request was well-formed but semantically erroneous", category: "4xx Client Error" },
  { code: 429, name: "Too Many Requests", description: "User has sent too many requests in a given time", category: "4xx Client Error" },
  { code: 500, name: "Internal Server Error", description: "Server encountered an unexpected condition", category: "5xx Server Error" },
  { code: 502, name: "Bad Gateway", description: "Server received invalid response from upstream server", category: "5xx Server Error" },
  { code: 503, name: "Service Unavailable", description: "Server is not ready to handle the request", category: "5xx Server Error" },
  { code: 504, name: "Gateway Timeout", description: "Server did not receive a timely response from upstream", category: "5xx Server Error" },
]
