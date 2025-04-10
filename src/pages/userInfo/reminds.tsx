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
import AddRemindModal from "./components/AddRemindModal";

const columns = [
  {
    label: "标题",
    key: "title",
    align: "start" as const,
  },
  {
    label: "描述",
    key: "description",
    align: "start" as const,
  },
  {
    label: "提醒时间",
    key: "remindAt",
    width: 200,
    align: "end" as const,
  },
  {
    label: "更新时间",
    key: "updatedAt",
    width: 200,
    align: "end" as const,
  },
];

export default function Reminds({ userId }: { userId: string }) {
  const [reminds, setReminds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const { currentPage, setCurrentPage, currentPageData, totalPages } =
    usePagination({
      data: reminds,
      pageSize: 20,
    });

  const handleAddRemind = async (data: { title: string; description: string; remindAt: string }) => {
    try {
      console.log("data", data);
      await userApi.createUserReminder(userId, data);
      getReminds();
    } catch (error) {
      console.error('Failed to create reminder:', error);
    }
  };

  const renderCell = useCallback((item: any, columnKey: string) => {
    switch (columnKey) {
      case "title":
        return <div className="line-clamp-1">{item.title}</div>;
      case "description":
        return <div className="line-clamp-1">{item.description}</div>;
      case "remindAt":
        return (
          <div className="tabular-nums">
            {moment(item.remindAt).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        );
      case "updatedAt":
        return (
          <div className="tabular-nums">
            {moment(item.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        );
    }
  }, []);

  const getReminds = () => {
    setLoading(true);
    userApi.getUserReminders(userId).then((res) => {
      setReminds(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    getReminds();
  }, []);

  return (
    <>
      <Table
        aria-label="Example table with client side pagination"
        topContent={
          <div className="flex w-full justify-start">
            <Button 
              color="primary" 
              size="sm" 
              onPress={() => setAddModalOpen(true)}
            >
              添加提醒
            </Button>
          </div>
        }
        bottomContent={
          <div className="flex w-full justify-center">
            {!loading && reminds.length > 0 && (
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

      <AddRemindModal
        isOpen={addModalOpen}
        onOpenChange={setAddModalOpen}
        onConfirm={handleAddRemind}
      />
    </>
  );
}
