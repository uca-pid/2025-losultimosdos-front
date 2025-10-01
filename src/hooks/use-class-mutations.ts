import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GymClass } from "@/types";
import { useAuth } from "@clerk/nextjs";
import apiService from "@/services/api.service";
import { toast } from "react-hot-toast";

interface MutationContext {
  prevUserClasses?: GymClass[];
  prevClasses?: GymClass[];
}

export const useEnrollClass = (userId: string, onSuccess?: () => void) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<GymClass, Error, GymClass, MutationContext>({
    mutationFn: async (classItem: GymClass) => {
      const token = await getToken();
      const response = await apiService.post<{ class: GymClass }>(
        `/admin/class/${classItem.id}/enroll`,
        { userId },
        token!
      );
      return response.class;
    },

    onMutate: async (classItem) => {
      await queryClient.cancelQueries({ queryKey: ["userClasses", userId] });
      await queryClient.cancelQueries({ queryKey: ["classes"] });

      const prevUserClasses = queryClient.getQueryData<GymClass[]>([
        "userClasses",
        userId,
      ]);
      const prevClasses = queryClient.getQueryData<GymClass[]>(["classes"]);

      queryClient.setQueryData<GymClass[]>(
        ["userClasses", userId],
        (old = []) => [...old, classItem]
      );

      queryClient.setQueryData<GymClass[]>(["classes"], (old = []) =>
        old.map((c) =>
          c.id === classItem.id
            ? { ...c, enrolled: c.enrolled + 1, users: [...c.users, userId] }
            : c
        )
      );

      toast.success("Clase asignada correctamente");
      onSuccess?.();
      return { prevUserClasses, prevClasses };
    },

    onError: (err, classItem, context) => {
      if (context?.prevUserClasses) {
        queryClient.setQueryData(
          ["userClasses", userId],
          context.prevUserClasses
        );
      }
      if (context?.prevClasses) {
        queryClient.setQueryData(["classes"], context.prevClasses);
      }
      toast.error("Error al asignar la clase");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userClasses", userId] });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};

export const useUnenrollClass = (userId: string) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<GymClass, Error, GymClass, MutationContext>({
    mutationFn: async (classItem: GymClass) => {
      const token = await getToken();
      const response = await apiService.post(
        `/admin/class/${classItem.id}/unenroll`,
        { userId },
        token!
      );
      return response.class as GymClass;
    },

    onMutate: async (classItem) => {
      await queryClient.cancelQueries({ queryKey: ["userClasses", userId] });
      await queryClient.cancelQueries({ queryKey: ["classes"] });

      const prevUserClasses = queryClient.getQueryData<GymClass[]>([
        "userClasses",
        userId,
      ]);
      const prevClasses = queryClient.getQueryData<GymClass[]>(["classes"]);

      queryClient.setQueryData<GymClass[]>(
        ["userClasses", userId],
        (old = []) => old.filter((c) => c.id !== classItem.id)
      );

      queryClient.setQueryData<GymClass[]>(["classes"], (old = []) =>
        old.map((c) =>
          c.id === classItem.id
            ? {
                ...c,
                enrolled: c.enrolled - 1,
                users: c.users.filter((u) => u !== userId),
              }
            : c
        )
      );

      toast.success("Clase desasignada correctamente");

      return { prevUserClasses, prevClasses };
    },

    onError: (err, classItem, context) => {
      if (context?.prevUserClasses) {
        queryClient.setQueryData(
          ["userClasses", userId],
          context.prevUserClasses
        );
      }
      if (context?.prevClasses) {
        queryClient.setQueryData(["classes"], context.prevClasses);
      }
      toast.error("Error al desasignar la clase");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userClasses", userId] });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};
