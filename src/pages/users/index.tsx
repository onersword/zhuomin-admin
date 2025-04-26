import { Button, Tab, Tabs } from "@heroui/react";
import { useNavigate } from "react-router-dom";

import UserList from "./userList";


import DefaultLayout from "@/layouts/default";
import { UserStatus, UserStatusMap } from "@/types/user";
import { createContext, useCallback, useEffect, useState } from "react";
import { userApi } from "@/requests/user";
import { User } from "@/requests/user";


export const UserContext = createContext<{
  users: User[];
  loading: boolean;
  getUsers: () => void;
}>({
  users: [],
  loading: false,
  getUsers: () => {},
});

const getUserStatsMap = (str: string) => {
  return {
    '待审核': UserStatus.NeedReview,
    '已审核': UserStatus.Reviewd,
  }[str]
}

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(UserStatus.NeedReview);
  const getUsers = useCallback(() => {
    setLoading(true);
    userApi.getUsers().then((res: User[]) => {
      console.log("user list", res);
      if (res.length) {
        setUsers(res.filter((item) => item.status === 2));
      }
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <DefaultLayout>
      <div>
        <div className="pb-3">

        <Button
          color="primary"
          radius="sm"
          onPress={() => navigate("/users/create")}
        >
          创建健康档案
        </Button>
        </div>
        <div>
          <Tabs
            selectedKey={UserStatusMap[status]}
            variant="underlined"
            onSelectionChange={(key) => setStatus(getUserStatsMap(key as string) as UserStatus)}
          >
            <Tab key={UserStatusMap[UserStatus.NeedReview]} title="待审核">
              {/* <div className="flex items-center gap-2">已上架产品</div> */}
            </Tab>
            <Tab key={UserStatusMap[UserStatus.Reviewd]} title="已审核" />
          </Tabs>
          <div>
            <UserContext.Provider value={{ users, loading, getUsers }}>
              <UserList status={status} />
            </UserContext.Provider>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
