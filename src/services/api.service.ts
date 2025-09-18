export class ApiValidationError extends Error {
  public field: string;
  public status?: number;

  constructor(message: string, field: string, status?: number) {
    super(message);
    this.field = field;
    this.status = status;
  }
}

export class ApiService {
  private baseUrl = import.meta.env.VITE_API_URL;
  async post(endpoint: string, body: Record<string, unknown>, token: string) {
    const response = await fetch(this.baseUrl + endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (response.status >= 500) {
      console.log(response.body, response.status);
      throw new Error("Server error");
    } else if (response.status >= 400) {
      const { message, field } = await response.json();
      throw new ApiValidationError(message, field, response.status);
    }
    return response;
  }

  async get(endpoint: string, token: string) {
    const response = await fetch(this.baseUrl + endpoint, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (response.status >= 500) {
      console.log(response.body, response.status);
      throw new Error("Server error");
    } else if (response.status >= 400) {
      const { message, field } = await response.json();
      throw new ApiValidationError(message, field);
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
      ...additionalHeaders,
    };

    const response = await fetch(this.baseUrl + endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: headers,
    });
    if (response.status >= 500) {
      console.log(response.body, response.status);
      throw new Error("Server error");
    } else if (response.status >= 400) {
      const { message, field } = await response.json();
      throw new ApiValidationError(message, field);
    }
    return response;
  }

  async delete(endpoint: string, token: string) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };
    const response = await fetch(this.baseUrl + endpoint, {
      method: "DELETE",
      headers: headers,
    });
    if (response.status >= 500) {
      console.log(response.body, response.status);
      throw new Error("Server error");
    } else if (response.status >= 400) {
      const { message, field } = await response.json();
      throw new ApiValidationError(message, field);
    }
    return response;
  }
}

const apiService = new ApiService();
export default apiService;
