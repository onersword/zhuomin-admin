import DefaultLayout from "@/layouts/default";
import Breadcrumb from "@/components/Breadcrumb";
import { readCsv } from "@/utils/readCsv";
import { useState } from "react";
import CsvUserList from "./csvUserList";
import TestPDF from "./testPDF";

export default function CreateUser() {
  const [parsedData, setParsedData] = useState<Record<string, string>[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await readCsv(file);
      setParsedData(data);
      console.log('CSV文件解析成功', data);
    } catch (error) {
      console.error('Error parsing CSV:', error);
    }
  };

  return (
    <DefaultLayout>
      <div>
        <Breadcrumb items={[{ path: "/users", text: "返回用户列表" }]} />
        <div className="p-4">
          <div className="mb-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          
          {parsedData.length > 0 && <CsvUserList userList={parsedData} />}
          <TestPDF />
        </div>
      </div>
    </DefaultLayout>
  );
}
