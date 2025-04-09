import { useEffect, useState } from "react";
import { User, userApi } from "@/requests/user";
import { Button, Pagination, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@heroui/react";
import { usePagination } from "@/hooks/usePagination";


const columns = [
  {
    label: "档案编号",
    key: "documentId",
  },
  {
    label: "姓名",
    key: "name",
  },
  {
    label: "手机号",
    key: "phone",
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

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const rowsPerPage = 4;

  const {
    currentPage,
    setCurrentPage,
    currentPageData,
    totalPages,
  } = usePagination({
    data: users,
    pageSize: rowsPerPage,
  });

  useEffect(() => {
    userApi.getUsers().then((res: User[]) => {
      console.log("user list", res);
      if (res) {
        setUsers(res);
      }
    });
  }, []);

  return (
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
        {(item: User) => (
          <TableRow key={item.id}>
            {columns.map((column) => (
              <TableCell key={column.key}>
                {column.key === "actions" ? (
                  <Button color="primary">
                    管理
                  </Button>
                ) : (
                  getKeyValue(item, column.key as keyof User)
                )}
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
