import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";

import UserList from "./userList";

import DefaultLayout from "@/layouts/default";
export default function UsersPage() {
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <Button
        color="primary"
        radius="sm"
        onPress={() => navigate("/users/create")}
      >
        创建健康档案
      </Button>
      <div>
        <div className="mt-4 mb-2">
          <div className="text-[27px]  text-black">用户列表</div>
        </div>
        <UserList />
      </div>
    </DefaultLayout>
  );
}
