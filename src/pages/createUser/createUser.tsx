import { useState, useRef } from "react";

import CsvUserList from "./csvUserList";

import DefaultLayout from "@/layouts/default";
import Breadcrumb from "@/components/Breadcrumb";
import { readCsv } from "@/utils/readCsv";
import { CSVUser } from "@/types/user";
import { Input } from "@heroui/react";
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";

export default function CreateUser() {
  const [parsedData, setParsedData] = useState<CSVUser[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    try {
      const data = await readCsv(file);
      setParsedData(data as unknown as CSVUser[]);
      console.log("CSV文件解析成功", data);
    } catch (error) {
      console.error("Error parsing CSV:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      handleFileUpload(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <DefaultLayout>
      <div>
        <Breadcrumb items={[{ path: "/users", text: "返回用户列表" }]} />
        <div className="p-4">
          <div className="mb-4">
            <div 
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
                isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-300 hover:border-primary'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <CloudArrowUpIcon className={`w-[100px] h-[100px] mb-4 ${
                isDragging ? 'text-primary' : 'text-gray-400'
              }`} />
              <p className="text-gray-500">点击或拖拽文件到此处上传</p>
              <p className="text-sm text-gray-400 mt-2">支持 .csv 格式</p>
              <Input
                ref={fileInputRef}
                className="hidden"
                accept=".csv"
                type="file"
                onChange={handleFileInputChange}
              />
            </div>
          </div>

          {parsedData.length > 0 && <CsvUserList userList={parsedData} />}
        </div>
      </div>
    </DefaultLayout>
  );
}
