import { User } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userService from "@/services/user.service";
import { toast } from "react-hot-toast";

export const useUserRoleMutation = (userId: string) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRole: string) => {
      const token = await getToken();
      return userService.updateUserRole(userId, newRole, token!);
    },
    onMutate: async (newRole) => {
      await queryClient.cancelQueries({ queryKey: ["users", userId] });
      const prevUser = queryClient.getQueryData<User>(["users", userId]);
      queryClient.setQueryData(["users", userId], (oldData: User) => {
        return { ...oldData, role: newRole };
      });
      queryClient.setQueryData<User[]>(
        ["users"],
        (oldData: User[] | undefined) => {
          return (
            oldData?.map((user) =>
              user.id === userId
                ? { ...user, role: newRole as "admin" | "user" }
                : user
            ) ?? []
          );
        }
      );

      toast.success("Rol actualizado correctamente", { id: "update-role" });
      return { prevUser };
    },
    onError: (_error, _newRole, context) => {
      if (context?.prevUser) {
        queryClient.setQueryData(["users", userId], context.prevUser);
      }
      toast.error("Error al actualizar el rol del usuario", {
        id: "update-role",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUserPlanMutation = (userId: string) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPlan: "basic" | "premium") => {
      const token = await getToken();
      return userService.updateUserPlan(userId, newPlan, token!);
    },
    onMutate: async (newPlan) => {
      await queryClient.cancelQueries({ queryKey: ["users", userId] });
      const prevUser = queryClient.getQueryData<User>(["users", userId]);
      queryClient.setQueryData(["users", userId], (oldData: User) => {
        return { ...oldData, plan: newPlan };
      });
      queryClient.setQueryData<User[]>(
        ["users"],
        (oldData: User[] | undefined) => {
          return (
            oldData?.map((user) =>
              user.id === userId
                ? { ...user, plan: newPlan as "basic" | "premium" }
                : user
            ) ?? []
          );
        }
      );
      toast.success("Plan actualizado correctamente", { id: "update-plan" });
      return { prevUser };
    },
    onError: (_error, _newPlan, context) => {
      if (context?.prevUser) {
        queryClient.setQueryData(["users", userId], context.prevUser);
      }
      toast.error("Error al actualizar el plan del usuario", {
        id: "update-plan",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
