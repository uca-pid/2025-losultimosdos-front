import { LoginFormSkeleton } from "@/components/skeletons/login-skeleton";
import { SignIn, useSignIn } from "@clerk/react-router";

export default function LoginPage() {
  const { isLoaded } = useSignIn();

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
            {isLoaded ? (
              <SignIn routing="path" path="/login" signUpUrl="/sign-up" />
            ) : (
              <LoginFormSkeleton />
            )}
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
