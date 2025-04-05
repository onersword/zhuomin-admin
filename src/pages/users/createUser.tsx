import DefaultLayout from "@/layouts/default";
import Breadcrumb from "@/components/Breadcrumb";

export default function CreateUser() {
  return (
    <DefaultLayout>
      <div>
        <Breadcrumb items={[{ path: "/users", text: "返回用户列表" }]} />
        <div>CreateUser</div>
      </div>
    </DefaultLayout>
  );
}
