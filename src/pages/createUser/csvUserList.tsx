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
import { useCallback, useState } from "react";
import UserInfoModal from "./userInfoModal";
import { userApi } from "@/requests/user";
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  console.log("user list", userList);
  const onReview = (userInfo: CSVUser) => {
    setCurrenUserInfo(userInfo);
    setIsOpen(true);
  };

  const handleApprove = async (pdfBlob: Blob) => {
    // 这里可以调用上传接口
    console.log("PDF Blob:", pdfBlob);
    // 例如：
    const formData = new FormData();
    formData.append("file", pdfBlob, "health_record.pdf");
    try {
      const res = await userApi.uploadFile(formData);
      console.log("res", res);
      const fileId = res.fileid;
      const recordRes = await userApi.createRecord({
        pdfUrl: fileId,
        name: currentUserInfo?.name,
        phone: currentUserInfo?.phoneNumber,
        idCard: currentUserInfo?.idCard,
        forms: currentUserInfo?.forms,
      });
      console.log("recordRes", recordRes);
    } catch (error) {
      console.error("上传失败", error);
    }
  };

  const renderCell = useCallback((item: CSVUser, columnKey: string) => {
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
  }, []);

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
            <TableColumn
              key={column.key}
              width={column.width}
              align={column.align ?? ("start" as const)}
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
        userInfo={currentUserInfo}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onApprove={handleApprove}
      />
    </>
  );
}
