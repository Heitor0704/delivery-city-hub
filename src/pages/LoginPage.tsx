
import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-600 to-orange-500">
      <div className="w-full max-w-md p-8 space-y-8 animate-fade-in">
        <AuthForm />
      </div>
    </div>
  );
}
