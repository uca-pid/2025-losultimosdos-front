"use client";

import { User } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { ALL_ROLES } from "@/lib/roles";
import {
  useUserRoleMutation,
  useUserPlanMutation,
} from "@/hooks/use-user-mutations";
import { UserAvatar } from "./user-avatar";
import { UserInfo } from "./user-info";
import { UserRolePlanSelector } from "./user-role-plan-selector";

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

            <div className="space-y-4">
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
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDataCard;
