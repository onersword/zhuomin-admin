import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import UserList from "./userList";
import { useEffect } from "react";
import { userApi } from "@/requests/user";

export default function UsersPage() {

  return (
    <DefaultLayout>
      <div>
        <div className="border-b border-gray-200 pb-6">
          <Button color="primary" radius="sm">创建账户&nbsp;|&nbsp;上传用户档案&nbsp;csv格式</Button>
        </div>

        <div className="mt-4">
          <div className="text-[27px]  text-black" >用户列表</div>
        </div>
        <UserList />

      </div>
    </DefaultLayout>
  );
}
