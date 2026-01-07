import { Outlet, Link, useLocation } from 'react-router-dom';
import { useUIStore } from '../store/ui.store.js';
import { Button } from '../components/ui/button.jsx';
import { Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils.js';

export const AppLayout = () => {
  const { theme, toggleTheme } = useUIStore();
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/projects" className="text-2xl font-bold hover:opacity-80 transition-opacity">
              TaskBoard
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                to="/projects"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground",
                  location.pathname.startsWith('/projects') 
                    ? "text-foreground" 
                    : "text-muted-foreground"
                )}
              >
                Projeler
              </Link>
              <Link
                to="/users"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground",
                  location.pathname.startsWith('/users') 
                    ? "text-foreground" 
                    : "text-muted-foreground"
                )}
              >
                Üyeler
              </Link>
            </nav>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun /> : <Moon />}
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

