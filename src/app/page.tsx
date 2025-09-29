import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser();
  const { isAuthenticated, redirectToSignIn } = await auth();

  if (!isAuthenticated) return redirectToSignIn();

  const isAdmin = user?.publicMetadata?.role === "admin";

  if (isAdmin) {
    return redirect("/admin");
  } else {
    return redirect("/user");
  }
}
