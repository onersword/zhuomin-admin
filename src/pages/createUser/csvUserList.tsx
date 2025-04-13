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
import { useCallback, useState } from "react";

import UserInfoModal from "./userInfoModal";

import { usePagination } from "@/hooks/usePagination";
import { CSVUser } from "@/types/user";

const columns = [
  {
    key: "name",
    label: "姓名",
  },
  {
    key: "phoneNumber",
    label: "电话",
  },
  {
    key: "idCard",
    label: "身份证号/护照号",
  },
  {
    key: "options",
    label: "操作",
    align: "end" as const,
    width: 150,
  },
];

export default function CsvUserList({ userList }: { userList: CSVUser[] }) {
  const [currentUserInfo, setCurrenUserInfo] = useState<CSVUser | undefined>();
  const [currentUserIndex, setCurrentUserIndex] = useState<number>(-1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filteredUserList, setFilteredUserList] = useState<CSVUser[]>(userList);

  const onReview = (userInfo: CSVUser) => {
    const index = userList.findIndex((user) => user.name === userInfo.name);

    setCurrenUserInfo(userInfo);
    setCurrentUserIndex(index);
    setIsOpen(true);
  };

  const handleSuccess = () => {
    if (currentUserIndex !== -1) {
      setFilteredUserList((prev) => {
        const newList = [...prev];
        const indexToRemove = newList.findIndex(
          (user) => user.name === userList[currentUserIndex].name,
        );

        if (indexToRemove !== -1) {
          newList.splice(indexToRemove, 1);
        }

        return newList;
      });
    }
  };

  const renderCell = useCallback(
    (item: CSVUser, columnKey: string) => {
      switch (columnKey) {
        case "name":
          return <div>{item.name}</div>;
        case "phoneNumber":
          return <div className="tabular-nums">{item.phoneNumber}</div>;
        case "idCard":
          return <div className="tabular-nums">{item.idCard}</div>;
        case "options":
          return (
            <Button color="primary" size="sm" onPress={() => onReview(item)}>
              审核
            </Button>
          );

        default:
          return <div />;
      }
    },
    [userList],
  );

  const { currentPage, setCurrentPage, currentPageData, totalPages } =
    usePagination({
      data: filteredUserList,
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
            <TableColumn
              key={column.key}
              align={column.align ?? ("start" as const)}
              width={column.width}
            >
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody items={currentPageData}>
          {(item: CSVUser) => (
            <TableRow key={item.name}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {renderCell(item, column.key)}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <UserInfoModal
        isOpen={isOpen}
        userInfo={currentUserInfo}
        onOpenChange={setIsOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}
