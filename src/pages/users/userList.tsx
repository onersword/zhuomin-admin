import { useCallback, useContext, useEffect, useState } from "react";
import {
  Button,
  Pagination,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import { usePagination } from "@/hooks/usePagination";
import { User, userApi } from "@/requests/user";
import { UserStatus } from "@/types/user";
import { UserContext } from ".";
const columns = [
  {
    label: "档案编号",
    key: "fid",
  },
  {
    label: "姓名",
    key: "name",
  },
  {
    label: "手机号",
    key: "phoneNumber",
  },
  {
    label: "创建时间",
    key: "createdAt",
  },
  {
    label: "操作",
    key: "actions",
  },
];

export default function UserList({ status }: { status: UserStatus }) {
  console.log("status", status);
  const [users, setUsers] = useState<User[]>([]);
  const rowsPerPage = 20;
  const navigate = useNavigate();
  const { users: allUsers, loading, getUsers } = useContext(UserContext);
  const { currentPage, setCurrentPage, currentPageData, totalPages } =
    usePagination({
      data: users,
      pageSize: rowsPerPage,
    });

  useEffect(() => {
    setUsers(allUsers.filter((user) => user.status === status));
  }, [allUsers, status]);

  const deleteUser = useCallback((id: string) => {
    userApi.deleteUser(id).then((res) => {
      console.log("delete user", res);
      getUsers();
    });
  }, []);
  const renderCell = useCallback((user: User, columnKey: string) => {
    const cellValue = getKeyValue(user, columnKey);

    switch (columnKey) {
      case "createdAt":
        return moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
      case "actions":
        return (
          <div className="flex gap-2">
            <Button
              color="primary"
              size="sm"
              onPress={() => navigate(`/users/${user.id}`)}
            >
              管理
            </Button>
            <Button
              color="danger"
              size="sm"
              onPress={() => deleteUser(user.id)}
            >
              删除
              </Button>
          </div>
        );
      default:
        return <div>{cellValue}</div>;
    }
  }, []);


  return (
    <Table
      aria-label="Example table with client side pagination"
      bottomContent={
        <div className="flex w-full justify-center">
          {!loading && users.length > 0 && (
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
          <TableColumn key={column.key}>{column.label}</TableColumn>
        ))}
      </TableHeader>
      <TableBody items={currentPageData}>
        {(item: User) => (
          <TableRow key={item.id} className="hover:bg-gray-100">
            {(columnKey) => (
              <TableCell key={columnKey}>
                {renderCell(item, columnKey as any)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
