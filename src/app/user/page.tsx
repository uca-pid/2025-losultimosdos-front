import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const UserPage = async () => {
  const { isAuthenticated, redirectToSignIn } = await auth();

  if (!isAuthenticated) return redirectToSignIn();

  const user = await currentUser();

  if (user?.publicMetadata.role !== "user") return redirect("/admin/classes");

  return redirect("/user/classes");
};

export default UserPage;
