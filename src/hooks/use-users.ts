import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import userService from "@/services/user.service";

export const useUsers = () => {
  const { isLoaded, getToken } = useAuth();

  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const data = await userService.getAllUsers(token);
      return data;
    },
    enabled: isLoaded, // Only run query when auth is loaded
  });
};
