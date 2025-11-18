import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser();
  const { isAuthenticated, redirectToSignIn } = await auth();

  if (!isAuthenticated) return redirectToSignIn();

  const isAdmin = user?.publicMetadata?.role === "admin";
  const isUser = user?.publicMetadata?.role === "user";
  const isMedibook = user?.publicMetadata?.role === "medibook";

  if (isAdmin) return redirect("/admin/classes");
  if (isUser) return redirect("/user/classes");
  if (isMedibook) return redirect("/medibook/api-key");

  return redirect("/");
}
