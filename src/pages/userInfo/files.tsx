import { usePagination } from "@/hooks/usePagination";
import { userApi } from "@/requests/user";
import {
  Button,
  Pagination,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Table } from "@heroui/react";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";

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

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <>
      <Table
        aria-label="文件列表"
        topContent={
          <div className="flex w-full justify-start">
            <Button 
              color="primary" 
              size="sm" 
              onPress={() => {}}
            >
              上传体检报告
            </Button>
          </div>
        }
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
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn
              key={column.key}
              width={column.width}
              align={column.align ?? ("start" as any)}
            >
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody
          items={currentPageData}
          isLoading={loading}
          emptyContent="暂无数据"
        >
          {(item: any) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey as any)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

    </>
  );
}
