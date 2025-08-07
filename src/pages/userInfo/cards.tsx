import {
  Button,
  Pagination,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  addToast,
  cn,
} from "@heroui/react";
import { Table } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";

import AddCardModal from "./components/AddCardModal";
import EditCardModal from "./components/EditCardModal";

import { userApi } from "@/requests/user";
import { usePagination } from "@/hooks/usePagination";
import { useModal } from "heroui-modal-provider";
import { ComfirmModal } from "@/components/comfirmModal";
import { UserCard } from "@/types/user";

const columns = [
  {
    label: "会员卡标题",
    key: "title",
    align: "start" as const,
  },
  {
    label: "会员卡内容",
    key: "content",
    align: "start" as const,
  },
  {
    label: "操作",
    key: "actions",
    width: 150,
    align: "end" as const,
  },
];

export default function Cards({ userId }: { userId: string }) {
  const [cards, setCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<UserCard | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { currentPage, setCurrentPage, currentPageData, totalPages } =
    usePagination({
      data: cards,
      pageSize: 20,
    });

  const { showModal } = useModal();

  const onDelete = (id: string) => {
    showModal(ComfirmModal, {
      content: "确定要删除这张会员卡吗？此操作不可恢复。",
      onConfirm: async (props) => {
        try {
          await userApi.deleteUserCard(id);
          addToast({
            title: "成功",
            description: "删除成功",
            color: "success",
          });
          props.close();
          getCards();
        } catch (error) {
          console.error("Failed to delete card:", error);
        }
      },
    });
  };

  const onEdit = (card: UserCard) => {
    setSelectedCard(card);
    setEditModalOpen(true);
  };

  const renderCell = useCallback((item: UserCard, columnKey: string) => {
    switch (columnKey) {
      case "title":
        return <div className="line-clamp-1 font-medium">{item.title}</div>;
      case "content":
        return <div className="line-clamp-2 text-gray-600">{item.content}</div>;
      case "actions":
        return (
          <div className="flex gap-2 justify-end">
            <Button
              color="primary"
              size="sm"
              variant="light"
              onPress={() => onEdit(item)}
            >
              编辑
            </Button>
            <Button
              color="danger"
              size="sm"
              variant="light"
              onPress={() => onDelete(item.id)}
            >
              删除
            </Button>
          </div>
        );
    }
  }, []);

  const getCards = () => {
    setLoading(true);
    userApi
      .getUserCards(userId)
      .then((res) => {
        setCards(res);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to get cards:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getCards();
  }, [userId]);

  return (
    <>
      <Table
        aria-label="会员卡列表"
        bottomContent={
          <div className="flex w-full justify-center">
            {!loading && cards.length > 0 && (
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
              className={cn(cards.length >= 1 && "cursor-not-allowed")}
              color="primary"
              size="sm"
              onPress={() => setAddModalOpen(true)}
              isDisabled={cards.length >= 1}
            >
              添加会员卡
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
          {(item: UserCard) => (
            <TableRow key={item.id} className="hover:bg-gray-100">
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey as any)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AddCardModal
        isOpen={addModalOpen}
        onSuccess={getCards}
        onOpenChange={setAddModalOpen}
        userId={userId}
        hasExistingCard={cards.length >= 1}
      />

      <EditCardModal
        isOpen={editModalOpen}
        onSuccess={getCards}
        onOpenChange={setEditModalOpen}
        userId={userId}
        card={selectedCard}
      />
    </>
  );
}
