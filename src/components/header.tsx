import { Button } from "@heroui/button";
export const Header = () => {
  return (
    <div className="h-16 bg-[#4A3AFF]  w-full flex justify-between items-center px-5">
      <p className="text-[28px] text-white font-[400]">卓敏健康管理后台程序</p>
      <div className="flex items-center gap-4">
        <Button color="primary" variant="flat">退出</Button>
      </div>
    </div>
  );
};
