import { LoginFormSkeleton } from "@/components/skeletons/login-skeleton";
import { SignUp, useSignIn } from "@clerk/react-router";

export default function SignUpPage() {
  const { isLoaded } = useSignIn();
  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-gradient-to-br from-sky-200 via-white to-orange-100 animate-gradient-slow">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md flex items-center justify-center">
            {isLoaded ? (
              <SignUp routing="path" path="/sign-up" signInUrl="/login" />
            ) : (
              <LoginFormSkeleton />
            )}
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/login.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
