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

import AddRemindModal from "./components/AddRemindModal";
import DeleteRemindModal from "./components/DeleteRemindModal";

import { userApi } from "@/requests/user";
import { usePagination } from "@/hooks/usePagination";

const columns = [
  {
    label: "标题",
    key: "title",
    align: "start" as const,
  },
  // {
  //   label: "描述",
  //   key: "description",
  //   align: "start" as const,
  // },
  {
    label: "提醒时间",
    key: "remindAt",
    width: 200,
    align: "end" as const,
  },

  {
    label: "操作",
    key: "actions",
    width: 200,
    align: "end" as const,
  },
];

export default function Reminds({ userId }: { userId: string }) {
  const [reminds, setReminds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRemind, setSelectedRemind] = useState<any>(null);

  const { currentPage, setCurrentPage, currentPageData, totalPages } =
    usePagination({
      data: reminds,
      pageSize: 20,
    });

  const handleAddRemind = async (data: {
    title: string;
    description: string;
    remindAt: string;
  }) => {
    try {
      console.log("data", data);
      data.description = "xxx";
      await userApi.createUserReminder(userId, data);
      setAddModalOpen(false);
      addToast({
        title: "成功",
        description: "提醒添加成功",
        color: "success",
      });
      getReminds();
    } catch (error) {
      console.error("Failed to create reminder:", error);
      addToast({
        title: "错误",
        description: "提醒添加失败",
        color: "danger",
      });
    }
  };

  const handleDeleteRemind = async () => {
    if (!selectedRemind) return;
    try {
      await userApi.deleteUserReminder(selectedRemind.id);
      addToast({
        title: "成功",
        description: "提醒删除成功",
        color: "success",
      });
      getReminds();
    } catch (error) {
      addToast({
        title: "错误",
        description: "提醒删除失败",
      });
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
      case "actions":
        return (
          <div className="flex gap-2 justify-end">
            <Button
              color="danger"
              size="sm"
              onPress={() => {
                setSelectedRemind(item);
                setDeleteModalOpen(true);
              }}
            >
              删除
            </Button>
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

      <AddRemindModal
        isOpen={addModalOpen}
        onConfirm={handleAddRemind}
        onOpenChange={setAddModalOpen}
      />

      <DeleteRemindModal
        isOpen={deleteModalOpen}
        onConfirm={handleDeleteRemind}
        onOpenChange={setDeleteModalOpen}
      />
    </>
  );
}
