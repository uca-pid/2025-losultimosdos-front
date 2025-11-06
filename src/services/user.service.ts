import { ApiService } from "./api.service";
import { User } from "@/types";

class UserService {
  private readonly apiService = new ApiService();

  async getUser(userId: string, token: string | null) {
    if (!token) {
      throw new Error("No authentication token available");
    }

    const data = await this.apiService.get(`/admin/users/${userId}`, token);
    const userData = data.user as User;

    return userData;
  }

  async getAllUsers(token: string | null) {
    if (!token) {
      throw new Error("No authentication token available");
    }

    const data = await this.apiService.get("/admin/users", token);
    return data.users as User[];
  }

  async getAllUsersBySede(token: string | null, sedeId: number) {
    if (!token) {
      throw new Error("No authentication token available");
    }

    const data = await this.apiService.get(
      `/admin/users?sedeId=${sedeId}`,
      token
    );
    return data.users as User[];
  }

  async updateUserRole(userId: string, role: string, token: string | null) {
    if (!token) {
      throw new Error("No authentication token available");
    }

    await this.apiService.put(`/admin/users/${userId}/role`, { role }, token);
    return true;
  }

  async updateUserPlan(
    userId: string,
    plan: "basic" | "premium",
    token: string | null
  ) {
    if (!token) {
      throw new Error("No authentication token available");
    }

    await this.apiService.put(`/admin/users/${userId}/plan`, { plan }, token);
    return true;
  }
}

export default new UserService();
