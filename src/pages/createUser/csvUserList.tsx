import {
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  TableBody,
  Table,
  Button,
  Pagination,
} from "@heroui/react";
import { usePagination } from "@/hooks/usePagination";
import { useState } from "react";
import UserInfoModal from "./userInfoModal";

const columns = [
  {
    key: "档案编号",
    label: "档案编号",
  },
  {
    key: "姓名",
    label: "姓名",
  },
  {
    key: "电话",
    label: "电话",
  },

  {
    key: "handle",
    label: "操作",
  },
];
export default function CsvUserList({
  userList,
}: {
  userList: Record<string, any>[];
}) {
  const [currentUserInfo, setCurrenUserInfo] = useState<
    Record<string, any> | undefined
  >();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  console.log("user list", userList);
  const onReview = (userInfo: Record<string, any>) => {
    setCurrenUserInfo(userInfo);
    setIsOpen(true);
  };
  const { currentPage, setCurrentPage, currentPageData, totalPages } =
    usePagination({
      data: userList,
      pageSize: 10,
    });
  return (
    <>
      <Table
        aria-label="Example table with client side pagination"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={currentPage}
              total={totalPages}
              onChange={(page: number) => setCurrentPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody items={currentPageData}>
          {(item: any) => (
            <TableRow key={item["编号"]}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.key === "handle" ? (
                    <Button color="primary" onPress={() => onReview(item)}>
                      审核
                    </Button>
                  ) : (
                    item[column.key]
                  )}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <UserInfoModal 
        userInfo={currentUserInfo} 
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
}
