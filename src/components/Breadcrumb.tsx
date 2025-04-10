import { Link } from "react-router-dom";
import { BackIcon } from "./icons/BackIcon";

export interface BreadcrumbItem {
  path: string;
  text: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm text-gray-500 py-2">
      {items.map((item, index) => (
        <div key={item.path}>
          <Link
            to={item.path}
            className="hover:text-primary text-primary text-[18px]"
          >
            <div className="flex justify-start items-center gap-[10px]">
              <BackIcon size={21} className="text-white" fill="#4A3AFF" />

              {item.text}
            </div>
          </Link>
        </div>
      ))}
    </nav>
  );
}
