import { useEffect, useState } from "react";
import { User, userApi } from "@/requests/user";
import { Button, Pagination, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@heroui/react";
import { usePagination } from "@/hooks/usePagination";
import { useNavigate } from "react-router-dom";


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

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const rowsPerPage = 20;
  const navigate = useNavigate();
  const {
    currentPage,
    setCurrentPage,
    currentPageData,
    totalPages,
  } = usePagination({
    data: users,
    pageSize: rowsPerPage,
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    userApi.getUsers().then((res: User[]) => {
      console.log("user list", res);
      if (res.length) {
        setUsers(res.filter((item) => item.status === 2))
      }
      setLoading(false);
    });
  }, []);

  return (
    <Table
      aria-label="Example table with client side pagination"
      bottomContent={
        <div className="flex w-full justify-center">
          {!loading && (
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
          <TableRow key={item.id}>
            {columns.map((column) => (
              <TableCell key={column.key}>
                {column.key === "actions" ? (
                  <Button color="primary" onPress={() => navigate(`/users/${item.id}`)}>
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
