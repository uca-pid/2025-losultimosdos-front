import { ApiKey } from "@/types";
import apiService from "./api.service";

const API_KEY_ENDPOINT = "/api-keys";

class ApiKeyService {
  // Generate a new API key
  async generateApiKey(token: string): Promise<ApiKey> {
    try {
      // TODO: Replace with actual backend call when implemented
      const response = await apiService.post<ApiKey>(
        API_KEY_ENDPOINT,
        {},
        token
      );
      return response;
    } catch (error) {
      console.error("Error generating API key:", error);
      throw error;
    }
  }

  // Get current API key
  async getApiKey(token: string): Promise<ApiKey | null> {
    try {
      // TODO: Replace with actual backend call when implemented
      const response = await apiService.get(API_KEY_ENDPOINT, token);
      return response;
    } catch (error) {
      console.error("Error fetching API key:", error);
      throw error;
    }
  }

  // Regenerate an existing API key
  async regenerateApiKey(keyId: string, token: string): Promise<ApiKey> {
    try {
      // TODO: Replace with actual backend call when implemented
      const response = await apiService.put<ApiKey>(
        `${API_KEY_ENDPOINT}/${keyId}/regenerate`,
        {},
        token
      );
      return response;
    } catch (error) {
      console.error("Error regenerating API key:", error);
      throw error;
    }
  }

  // Disable/Enable an API key
  async toggleApiKeyStatus(
    keyId: string,
    isActive: boolean,
    token: string
  ): Promise<ApiKey> {
    try {
      // TODO: Replace with actual backend call when implemented
      const response = await apiService.put<ApiKey>(
        `${API_KEY_ENDPOINT}/${keyId}`,
        { isActive },
        token
      );
      return response;
    } catch (error) {
      console.error("Error toggling API key status:", error);
      throw error;
    }
  }

  // Delete an API key
  async deleteApiKey(keyId: string, token: string): Promise<void> {
    try {
      // TODO: Replace with actual backend call when implemented
      await apiService.delete(`${API_KEY_ENDPOINT}/${keyId}`, token);
    } catch (error) {
      console.error("Error deleting API key:", error);
      throw error;
    }
  }
}

const apiKeyService = new ApiKeyService();
export default apiKeyService;
