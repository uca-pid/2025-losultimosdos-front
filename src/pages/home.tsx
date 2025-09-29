import { ClassesTable } from "@/components/classes-table";
import { UserClassesTable } from "@/components/user-classes-table";
import Layout from "@/components/layout";
import { useUser } from "@clerk/clerk-react";

export default function Page() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <Layout><div>Cargando...</div></Layout>;
  }

  // Ajusta esto según cómo guardes el rol
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <Layout>
      {isAdmin ? <ClassesTable /> : <UserClassesTable />}
    </Layout>
  );
}
