
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center space-y-5 max-w-md mx-auto px-4">
        <h1 className="text-6xl font-bold text-delivery-primary">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Página não encontrada</h2>
        <p className="text-gray-500">A página que você está procurando não existe ou foi movida.</p>
        <Button asChild className="mt-4 bg-delivery-primary hover:bg-delivery-dark">
          <Link to="/">Voltar para o início</Link>
        </Button>
      </div>
    </div>
  );
}
