import Sidebar from "@/components/sidebar";
import { Header } from "@/components/header";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" bg-white relative flex flex-col h-screen mx-auto max-w-7xl">
      <Header />
      <div className="w-[200px] bg-default-600 text-white bottom-0 absolute left-0 top-16 z-[2]">
        <Sidebar />
      </div>
      <div className="relative">
        <main className="ml-[200px]  p-[30px] flex-grow  border border-red-500">
          {children}
        </main>
      </div>
    </div>
  );
}
