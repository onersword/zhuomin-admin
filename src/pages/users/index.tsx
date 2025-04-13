import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";

import UserList from "./userList";

import DefaultLayout from "@/layouts/default";
export default function UsersPage() {
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <div>
        <div className="border-b border-gray-200 pb-6">
          <Button
            color="primary"
            radius="sm"
            onClick={() => navigate("/users/create")}
          >
            创建账户&nbsp;|&nbsp;上传用户档案&nbsp;csv格式
          </Button>
        </div>

        <div className="mt-4">
          <div className="text-[27px]  text-black">用户列表</div>
        </div>
        <UserList />
      </div>
    </DefaultLayout>
  );
}
