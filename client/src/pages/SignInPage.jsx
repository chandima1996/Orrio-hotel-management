import { SignIn } from "@clerk/clerk-react";
import { dark } from "@clerk/themes"; // 1. Dark theme එක import කරන්න
import { useTheme } from "@/components/theme-provider"; // 2. App එකේ theme එක ගන්න hook එක

const SignInPage = () => {
  const { theme } = useTheme(); // theme එක 'light' ද 'dark' ද කියලා ගන්නවා

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-12 px-4">
      <SignIn
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl="/"
        appearance={{
          // 3. Theme එක dark නම්, Clerk dark theme එක දාන්න
          baseTheme: theme === "dark" ? dark : undefined,
          elements: {
            rootBox: "shadow-xl rounded-xl",
            card: "backdrop-blur-md border border-white/10", // පොඩි styling fix එකක්
          },
        }}
      />
    </div>
  );
};

export default SignInPage;
