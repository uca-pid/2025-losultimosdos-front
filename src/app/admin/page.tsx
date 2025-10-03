import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const AdminPage = async () => {
  const { isAuthenticated, redirectToSignIn } = await auth();

  if (!isAuthenticated) return redirectToSignIn();

  const user = await currentUser();

  if (user?.publicMetadata.role !== "admin") return redirect("/user/classes");

  return redirect("/admin/classes");
};

export default AdminPage;
