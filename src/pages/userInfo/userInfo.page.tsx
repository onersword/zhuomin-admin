import { Button, Tab, Tabs } from "@heroui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProductList from "./productList";
import Notes from "./notes";
import Reminds from "./reminds";
import Files from "./files";

import DefaultLayout from "@/layouts/default";
import { NumberIcon, PhoneIcon } from "@/components/icons";
import Breadcrumb from "@/components/Breadcrumb";
import { userApi } from "@/requests/user";

export default function UserInfoPage() {
  const { id: userId } = useParams();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("products");

  if (!userId) {
    return <div>用户ID不存在</div>;
  }

  useEffect(() => {
    userApi.getUserById(userId).then((res) => {
      setUserInfo(res);
    });
  }, [userId]);

  return (
    <DefaultLayout>
      <div>
        <Breadcrumb items={[{ path: "/users", text: "返回用户列表" }]} />
        <div className="py-5">
          <div className=" bg-[#F4F4F4] shadow-md rounded p-5">
            <h2 className="text-[27px]  mb-2">{userInfo?.name}</h2>
            <div className="flex justify-between items-center">
              <div className="flex justify-between gap-5">
                <div className="text-gray-600 flex items-center gap-2">
                  <NumberIcon className="text-gray-600" />
                  <p>
                    档案编号：
                    <span className="text-black font-semibold">
                      {userInfo?.fid}
                    </span>
                  </p>
                </div>
                <div className="text-gray-600 flex items-center gap-2">
                  <PhoneIcon className="text-gray-600" />
                  <p>
                    手机号：
                    <span className="text-black font-semibold">
                      {userInfo?.phoneNumber}
                    </span>
                  </p>
                </div>
              </div>
              <div className="actions flex gap-2">
                <Button
                  className="text-[#413B3B] bg-white"
                  color="default"
                  size="sm"
                  onPress={() => {}}
                >
                  查看健康档案
                </Button>
                {/* <Button
                  color="default"
                  className="text-[#413B3B] bg-white"
                  size="sm"
                  onPress={() => {}}
                >
                  更新健康档案
                </Button> */}
              </div>
            </div>
          </div>

          <div className="mt-5">
            <Tabs
              className="pb-5"
              selectedKey={activeTab}
              variant="underlined"
              onSelectionChange={(key) => setActiveTab(key as string)}
            >
              <Tab key="products" title="已购产品" />
              <Tab key="notes" title="健康小结" />
              <Tab key="files" title="体检报告" />
              <Tab key="reminds" title="预约管理" />
            </Tabs>
            {activeTab === "products" && <ProductList userId={userId} />}
            {activeTab === "notes" && <Notes userId={userId} />}
            {activeTab === "files" && <Files userId={userId} />}
            {activeTab === "reminds" && <Reminds userId={userId} />}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
