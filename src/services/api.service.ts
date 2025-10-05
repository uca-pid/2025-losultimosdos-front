interface ValidationDetail {
  path: string;
  message: string;
}

export class ApiValidationError extends Error {
  public details: ValidationDetail[];
  public status?: number;

  constructor(details: ValidationDetail[], status?: number) {
    super("Validation failed " + status);
    this.details = details;
    this.status = status;
  }
}

export class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL;
  async post<T = any>(
    endpoint: string,
    body: Record<string, unknown>,
    token: string
  ): Promise<T> {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      "ngrok-skip-browser-warning": "1",
    };
    console.log("[POST Request Headers]", headers);
    const response = await fetch(this.baseUrl + endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      headers,
    });
    if (response.status >= 500) {
      console.log(response.body, response.status);
      throw new Error("Server error");
    } else if (response.status >= 400) {
      const { error, details } = await response.json();

      throw new ApiValidationError(details, response.status);
    }
    const data = await response.json();
    return data;
  }

  async get(endpoint: string, token?: string) {
    const headers = {
      Authorization: token ? "Bearer " + token : "",
      "ngrok-skip-browser-warning": "1",
    };
    const normalizedEndpoint = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;
    console.log("[GET Request Headers]", headers);
    console.log("[GET Request URL]", `${this.baseUrl}${normalizedEndpoint}`);
    const response = await fetch(`${this.baseUrl}${normalizedEndpoint}`, {
      method: "GET",
      headers,
    });
    if (response.status >= 500) {
      console.log(response.body, response.status);
      throw new Error("Server error");
    } else if (response.status >= 400) {
      const { error, details } = await response.json();
      throw new ApiValidationError(details, response.status);
    }
    const data = await response.json();
    return data;
  }

  async put(
    endpoint: string,
    body: Record<string, unknown>,
    token: string,
    additionalHeaders?: Record<string, string>
  ) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      "ngrok-skip-browser-warning": "1",
      ...additionalHeaders,
    };

    console.log("[PUT Request Headers]", headers);
    const response = await fetch(this.baseUrl + endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      headers,
    });
    if (response.status >= 500) {
      console.log(response.body, response.status);
      throw new Error("Server error");
    } else if (response.status >= 400) {
      const { error, details } = await response.json();
      throw new ApiValidationError(details, response.status);
    }
    return response;
  }

  async delete(endpoint: string, token: string) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      "ngrok-skip-browser-warning": "1",
    };
    console.log("[DELETE Request Headers]", headers);
    const response = await fetch(this.baseUrl + endpoint, {
      method: "DELETE",
      headers,
    });
    if (response.status >= 500) {
      console.log(response.body, response.status);
      throw new Error("Server error");
    } else if (response.status >= 400) {
      const { error, details } = await response.json();
      throw new ApiValidationError(details, response.status);
    }
    return response;
  }
}

const apiService = new ApiService();
export default apiService;
