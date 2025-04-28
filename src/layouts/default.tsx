import Sidebar from "@/components/sidebar";
import { Header } from "@/components/header";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white h-screen overflow-hidden">
      {/* Fixed header */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <Header />
      </div>
      
      {/* Fixed sidebar */}
      <div className="fixed top-16 left-0 w-[200px] h-[calc(100vh-64px)] bg-[#52525B] text-white z-[2]">
        <Sidebar />
      </div>
      
      {/* Scrollable main content */}
      <main className="ml-[200px] mt-16 h-[calc(100vh-64px)] overflow-auto p-[30px]">
        {children}
      </main>
    </div>
  );
}
