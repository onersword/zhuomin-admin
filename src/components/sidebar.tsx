
import { useEffect, useState } from "react";
import { useLocation} from "react-router-dom";
import { Link, cn } from "@heroui/react";
// Define menu items
const menuItems = [
  {
    title: "用户管理",
    key: "users",
    path: "/users",
  },
  {
    title: "产品管理",
    key: "products",
    path: "/products",
  },
];

export default function Sidebar() {
  const [activeKey, setActiveKey] = useState("users");
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split("/")[0] || "users";
    setActiveKey(path);
  }, [location.pathname]);

  return (
    <div className="">
      <nav className="pt-4 pl-[10px]">
        {menuItems.map((item) => (
          <Link
            key={item.key}
            href={item.path}
            className={cn(
              "px-4 h-[55px] flex items-center justify-center",
              "rounded-[5px] rounded-r-none text-[18px] text-white",
              activeKey === item.key ? "bg-white text-black" : ""
            )}

          >
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
