import { Spinner } from "@heroui/react";

export default function LoadingData() {
  return (
    <div className="flex justify-center items-center h-full min-h-[200px] w-full">
      <Spinner color="primary" />
    </div>
  );
}
