"use client";

import { Sede, User } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { ALL_ROLES } from "@/lib/roles";
import {
  useUserRoleMutation,
  useUserPlanMutation,
  useUserSedeMutation,
} from "@/hooks/use-user-mutations";
import { UserAvatar } from "./user-avatar";
import { UserInfo } from "./user-info";
import { UserRolePlanSelector } from "./user-role-plan-selector";
import UserSedeSelector from "./user-sede-selector";
import apiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

const ALL_PLANS = ["basic", "premium"] as const;

interface UserDataCardProps {
  user: User;
}

const UserDataCard = ({ user }: UserDataCardProps) => {
  const isMobile = useIsMobile();
  const { mutate: updateRole, isPending: isUpdatingRole } = useUserRoleMutation(
    user.id
  );
  const { mutate: updatePlan, isPending: isUpdatingPlan } = useUserPlanMutation(
    user.id
  );
  const { mutate: updateSede, isPending: isUpdatingSede } = useUserSedeMutation(
    user.id
  );
  const { data: sedes } = useQuery({
    queryKey: ["sedes"],
    queryFn: async () => {
      const response = await apiService.get("/sedes");
      return response.sedes as Sede[];
    },
  });

  const handleSedeChange = (newSede: { id: number; name: string }) => {
    if (newSede.id === user.sedeId) return;
    updateSede(newSede.id);
  };

  const handleRoleChange = (newRole: string) => {
    if (newRole === user.role) return;
    updateRole(newRole);
  };

  const handlePlanChange = (newPlan: "basic" | "premium") => {
    if (newPlan === user.plan) return;
    updatePlan(newPlan);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos del Usuario</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={isMobile ? "space-y-4" : "flex flex-col md:flex-row gap-6"}
        >
          <UserAvatar
            imageUrl={user.imageUrl}
            firstName={user.firstName}
            isMobile={isMobile}
          />

          <div className={isMobile ? "" : "flex-1 space-y-4"}>
            <UserInfo
              firstName={user.firstName}
              lastName={user.lastName}
              email={user.email}
              id={user.id}
              isMobile={isMobile}
            />

            <div className="space-y-4 flex flex-col md:flex-row md:items-start md:gap-4 mt-2">
              <UserRolePlanSelector
                type="role"
                currentValue={user.role}
                options={ALL_ROLES}
                isUpdating={isUpdatingRole}
                onValueChange={handleRoleChange}
              />

              <UserRolePlanSelector<"basic" | "premium">
                type="plan"
                currentValue={user.plan}
                options={ALL_PLANS}
                isUpdating={isUpdatingPlan}
                onValueChange={handlePlanChange}
              />

              <UserSedeSelector
                currentValue={{
                  id: user.sedeId,
                  name:
                    sedes?.find((sede) => sede.id === user.sedeId)?.name || "",
                }}
                options={
                  sedes?.map((sede) => ({
                    id: sede.id,
                    name: sede.name,
                  })) || []
                }
                isUpdating={isUpdatingSede}
                onValueChange={handleSedeChange}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDataCard;
