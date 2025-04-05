import {
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  TableBody,
  Table,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { Pagination } from "@heroui/pagination";
import { usePagination } from "@/hooks/usePagination";

const columns = [
  {
    key: "档案编号",
    label: "档案编号",
  },
  {
    key: '姓名',
    label: '姓名',
  },
  {
    key: '电话',
    label: '电话'
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
  console.log("user list", userList);
  const { currentPage, setCurrentPage, currentPageData, totalPages } =
    usePagination({
      data: userList,
      pageSize: 10,
    });
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
        {(item: any) => (
          <TableRow key={item["编号"]}>
            {columns.map((column) => (
              <TableCell key={column.key}>
                {column.key === "handle" ? (
                  <Button color="primary">审核</Button>
                ) : (
                  item[column.key]
                )}
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
