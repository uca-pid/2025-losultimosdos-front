import apiService from "@/services/api.service";
import { UsersClassesTable } from "@/components/classes/users-table";
import { GymClass } from "@/types";
import { FullClasses } from "@/components/classes/full-classes";

const UserPage = async () => {
  const response = (await apiService.get("/classes")) as {
    classes: GymClass[];
  };
  const classes = response.classes.sort((a, b) => a.id - b.id);
  const fullClasses = classes.filter((c) => c.users.length >= c.capacity);

  return (
    <div className="container mx-auto space-y-4 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold">Clases Disponibles</h1>
      </div>
      <UsersClassesTable
        classes={classes.filter((c) => c.users.length < c.capacity) || []}
      />
      {fullClasses.length > 0 && <FullClasses fullClasses={fullClasses} />}
    </div>
  );
};

export default UserPage;
