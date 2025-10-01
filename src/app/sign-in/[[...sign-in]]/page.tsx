import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const { isAuthenticated } = await auth();

  if (isAuthenticated) return redirect("/");

  return (
    <div
      className={[
        "grid min-h-svh lg:grid-cols-2",
        "bg-gradient-to-br from-sky-200 via-white to-orange-100",
        "dark:bg-gradient-to-r dark:from-[#2A7B9B] dark:via-[#57C785] dark:to-[#EDDD53]",
        "animate-gradient-slow",
      ].join(" ")}
    >
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md flex flex-col items-center justify-center gap-6">
            <h1 className="text-5xl font-extrabold tracking-tight text-center text-black dark:text-white">
              GymCloud
            </h1>
            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              forceRedirectUrl={"/user/classes"}
            />
          </div>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <img
          src="/login.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
