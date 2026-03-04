import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: Crumb[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const location = useLocation();

  return (
    <nav className="flex items-center text-sm text-gray-500 gap-1.5 mb-4">
      <Link to="/" className="hover:text-primary-600 transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          {item.href && item.href !== location.pathname ? (
            <Link to={item.href} className="hover:text-primary-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
