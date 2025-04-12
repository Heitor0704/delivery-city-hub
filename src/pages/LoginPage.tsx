
import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center auth-gradient">
      <div className="w-full max-w-md p-8 space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Delivery City Hub</h1>
          <p className="mt-2 text-white/80">Gerenciamento completo para o seu sistema de delivery</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
