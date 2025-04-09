import Breadcrumb from "@/components/Breadcrumb";
import DefaultLayout from "@/layouts/default";

export default function UserInfoPage() {
  return (
    <DefaultLayout>
      <div>
        <Breadcrumb items={[{ path: "/users", text: "返回用户列表" }]} />
        UserInfoPage
      </div>
    </DefaultLayout>
  );
}
