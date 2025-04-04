import React, { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import { User, userApi } from "@/requests/user";
import { usePagination } from "@/hooks/usePagination";
import { Button } from "@heroui/button";

export const users = [
  {
    key: "1",
    name: "Tony Reichert",
    role: "CEO",
    status: "Active",
  },
  {
    key: "2",
    name: "Zoey Lang",
    role: "Technical Lead",
    status: "Paused",
  },
  {
    key: "3",
    name: "Jane Fisher",
    role: "Senior Developer",
    status: "Active",
  },
  {
    key: "4",
    name: "William Howard",
    role: "Community Manager",
    status: "Vacation",
  },
  {
    key: "5",
    name: "Emily Collins",
    role: "Marketing Manager",
    status: "Active",
  },
  {
    key: "6",
    name: "Brian Kim",
    role: "Product Manager",
    status: "Active",
  },
  {
    key: "7",
    name: "Laura Thompson",
    role: "UX Designer",
    status: "Active",
  },
  {
    key: "8",
    name: "Michael Stevens",
    role: "Data Analyst",
    status: "Paused",
  },
  {
    key: "9",
    name: "Sophia Nguyen",
    role: "Quality Assurance",
    status: "Active",
  },
  {
    key: "10",
    name: "James Wilson",
    role: "Front-end Developer",
    status: "Vacation",
  },
  {
    key: "11",
    name: "Ava Johnson",
    role: "Back-end Developer",
    status: "Active",
  },
  {
    key: "12",
    name: "Isabella Smith",
    role: "Graphic Designer",
    status: "Active",
  },
  {
    key: "13",
    name: "Oliver Brown",
    role: "Content Writer",
    status: "Paused",
  },
  {
    key: "14",
    name: "Lucas Jones",
    role: "Project Manager",
    status: "Active",
  },
  {
    key: "15",
    name: "Grace Davis",
    role: "HR Manager",
    status: "Active",
  },
  {
    key: "16",
    name: "Elijah Garcia",
    role: "Network Administrator",
    status: "Active",
  },
  {
    key: "17",
    name: "Emma Martinez",
    role: "Accountant",
    status: "Vacation",
  },
  {
    key: "18",
    name: "Benjamin Lee",
    role: "Operations Manager",
    status: "Active",
  },
  {
    key: "19",
    name: "Mia Hernandez",
    role: "Sales Manager",
    status: "Paused",
  },
  {
    key: "20",
    name: "Daniel Lewis",
    role: "DevOps Engineer",
    status: "Active",
  },
  {
    key: "21",
    name: "Amelia Clark",
    role: "Social Media Specialist",
    status: "Active",
  },
  {
    key: "22",
    name: "Jackson Walker",
    role: "Customer Support",
    status: "Active",
  },
  {
    key: "23",
    name: "Henry Hall",
    role: "Security Analyst",
    status: "Active",
  },
  {
    key: "24",
    name: "Charlotte Young",
    role: "PR Specialist",
    status: "Paused",
  },
  {
    key: "25",
    name: "Liam King",
    role: "Mobile App Developer",
    status: "Active",
  },
];

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
  const [users, setUsers] = React.useState<User[]>([]);
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
