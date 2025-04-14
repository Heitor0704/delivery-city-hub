
import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-600 to-orange-500">
      <div className="w-full max-w-md p-8 space-y-8 animate-fade-in">
        <AuthForm />
        <div className="text-center text-white/80 text-sm mt-6">
          <p>Versão Demo - Credenciais de acesso:</p>
          <ul className="mt-2">
            <li>Proprietário: owner@fomex.com / 123456</li>
            <li>Gerente: manager@fomex.com / 123456</li>
            <li>Administrador: admin@fomex.com / 123456</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
