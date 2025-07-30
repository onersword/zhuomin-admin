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

import ViewNoteModal from "./components/ViewNoteModal";
import EditNoteModal from "./components/EditNoteModal";
import DeleteNoteModal from "./components/DeleteNoteModal";
import AddNoteModal from "./components/AddNoteModal";

import { userApi } from "@/requests/user";
import { usePagination } from "@/hooks/usePagination";

const columns = [
  {
    label: "内容",
    key: "content",
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
    width: 250,
    align: "end" as const,
  },
];

export default function Notes({ userId }: { userId: string }) {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const { currentPage, setCurrentPage, currentPageData, totalPages } =
    usePagination({
      data: notes,
      pageSize: 20,
    });

  const handleEditNote = async (id: string, newContent: string) => {
    try {
      await userApi.updateUserNote(userId, id, { content: newContent });
      getNotes();
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedNote) return;
    try {
      await userApi.deleteUserNote(userId, selectedNote.id);
      getNotes();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleAddNote = async (content: string) => {
    try {
      await userApi.createUserNote(userId, { content });
      getNotes();
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const renderCell = useCallback((item: any, columnKey: string) => {
    switch (columnKey) {
      case "content":
        return <div className="line-clamp-1">{item.content}</div>;
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
                setSelectedNote(item);
                setViewModalOpen(true);
              }}
            >
              查看
            </Button>
            <Button
              color="primary"
              size="sm"
              onPress={() => {
                setSelectedNote(item);
                setEditModalOpen(true);
              }}
            >
              编辑
            </Button>
            <Button
              color="danger"
              size="sm"
              onPress={() => {
                setSelectedNote(item);
                setDeleteModalOpen(true);
              }}
            >
              删除
            </Button>
          </div>
        );
    }
  }, []);

  const getNotes = () => {
    setLoading(true);
    userApi.getUserNotes(userId).then((res) => {
      setNotes(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <>
      <Table
        aria-label="Example table with client side pagination"
        bottomContent={
          <div className="flex w-full justify-center">
            {!loading && notes.length > 0 && (
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
              添加健康小结
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

      {selectedNote && (
        <>
          <ViewNoteModal
            isOpen={viewModalOpen}
            note={selectedNote}
            onOpenChange={setViewModalOpen}
          />
          <EditNoteModal
            isOpen={editModalOpen}
            note={selectedNote}
            onConfirm={handleEditNote}
            onOpenChange={setEditModalOpen}
          />
          <DeleteNoteModal
          content="确定要删除这条健康小结吗？此操作不可恢复。"
            isOpen={deleteModalOpen}
            onConfirm={handleDeleteNote}
            onOpenChange={setDeleteModalOpen}
          />
        </>
      )}

      <AddNoteModal
        userId={userId}
        isOpen={addModalOpen}
        onSuccess={getNotes}
        onOpenChange={setAddModalOpen}
      />
    </>
  );
}
