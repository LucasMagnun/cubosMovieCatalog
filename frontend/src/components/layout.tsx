import { Film, LogOut } from "lucide-react";
import type React from "react";
import { useAuth } from "../contexts/auth-context";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  console.log(user);

  return (
    <div className="min-h-screen">
      <header className=" shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Film className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-primary">
                Meu Catálogo de Filmes
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-primary">
                Olá, {user?.username || "Usuário"}
              </span>
              <ModeToggle />
              <Button
                onClick={logout}
                className="flex items-center"
                variant={"outline"}
              >
                <LogOut className="h-5 w-5 mr-1" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
