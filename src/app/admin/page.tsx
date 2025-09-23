import CreateClassSheet from "@/components/classes/create-class";
import apiService from "@/services/api.service";
import AdminTable from "@/components/classes/admin-table";

const AdminPage = async () => {
  const response = await apiService.get("/classes");
  const classes = response.classes;

  return (
    <div className="container mx-auto space-y-4 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold">Clases Disponibles</h1>
        <CreateClassSheet />
      </div>
      <AdminTable classes={classes || []} />
    </div>
  );
};

export default AdminPage;
