import { SignUp } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { useTheme } from "@/components/theme-provider";

const SignUpPage = () => {
  const { theme } = useTheme();

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-12 px-4">
      <SignUp
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl="/"
        appearance={{
          baseTheme: theme === "dark" ? dark : undefined,
          elements: {
            rootBox: "shadow-xl rounded-xl",
            card: "backdrop-blur-md border border-white/10",
          },
        }}
      />
    </div>
  );
};

export default SignUpPage;
