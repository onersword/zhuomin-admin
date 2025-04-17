import {
  Button,
  Pagination,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  addToast,
} from "@heroui/react";
import { Table } from "@heroui/react";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";

import UploadFileModal from "./components/UploadFileModal";

import { userApi } from "@/requests/user";
import { usePagination } from "@/hooks/usePagination";

const columns = [
  {
    label: "文件名称",
    key: "name",
    align: "start" as const,
  },
  {
    label: "更新时间",
    key: "updatedAt",
    width: 200,
    align: "end" as const,
  },
  {
    label: "操作",
    key: "actions",
    width: 100,
    align: "end" as const,
  },
];

export default function Files({ userId }: { userId: string }) {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const { currentPage, setCurrentPage, currentPageData, totalPages } =
    usePagination({
      data: files,
      pageSize: 20,
    });

  const renderCell = useCallback((item: any, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return <div className="line-clamp-1">{item.name}</div>;
      case "updatedAt":
        return (
          <div className="tabular-nums">
            {moment(item.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        );
      case "actions":
        return (
          <div className="flex gap-2 justify-end">
            <Button
              color="primary"
              size="sm"
              onPress={() => {
                window.open(item.url, "_blank");
              }}
            >
              查看
            </Button>
          </div>
        );
    }
  }, []);

  const getFiles = () => {
    setLoading(true);
    userApi.getUserFiles(userId).then((res) => {
      setFiles(res);
      setLoading(false);
    });
  };

  const handleUploadFile = async (file: File) => {
    try {
      const formData = new FormData();

      formData.append("file", file);

      await userApi.uploadUserFile(userId, formData);
      addToast({
        title: "成功",
        description: "文件上传成功",
      });
      getFiles(); // Refresh the file list
    } catch (error) {
      addToast({
        title: "错误",
        description: "文件上传失败",
      });
    }
  };

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <>
      <Table
        aria-label="文件列表"
        bottomContent={
          <div className="flex w-full justify-center">
            {!loading && files.length > 0 && (
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={currentPage}
                total={totalPages}
                onChange={(page: number) => setCurrentPage(page)}
              />
            )}
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
        topContent={
          <div className="flex w-full justify-start">
            <Button
              color="primary"
              size="sm"
              onPress={() => setUploadModalOpen(true)}
            >
              上传体检报告
            </Button>
          </div>
        }
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn
              key={column.key}
              align={column.align ?? ("start" as any)}
              width={column.width}
            >
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody
          emptyContent="暂无数据"
          isLoading={loading}
          items={currentPageData}
        >
          {(item: any) => (
            <TableRow key={item.id} className="hover:bg-gray-100">
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey as any)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <UploadFileModal
        isOpen={uploadModalOpen}
        onConfirm={handleUploadFile}
        onOpenChange={setUploadModalOpen}
      />
    </>
  );
}
