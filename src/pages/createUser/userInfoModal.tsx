import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
} from "@heroui/react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  BlobProvider,
  Font,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

import { userApi } from "@/requests/user";

interface UserInfoModalProps {
  userInfo: Record<string, any> | undefined;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess?: () => void;
}

// Register fallback font
Font.register({
  family: "Noto Sans SC",
  src: "/fonts/NotoSansSC-Regular.ttf",
});

// PDF styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 40,
    fontFamily: "Noto Sans SC",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderBottomStyle: "solid",
    paddingVertical: 8,
    marginBottom: 4,
  },
  label: {
    width: "30%",
    fontSize: 12,
    color: "#000",
  },
  value: {
    flex: 1,
    fontSize: 12,
    color: "#000",
  },
  dashedValue: {
    flex: 1,
    fontSize: 12,
    color: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#666",
    borderBottomStyle: "dashed",
  }
});

// PDF Document component
const MyDocument = ({ data }: { data: any }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {Object.entries(data).map(([key, value], index) => (
          <View style={styles.row} key={index}>
            <Text style={styles.label}>{key}</Text>
            <Text style={String(value) === "----" ? styles.dashedValue : styles.value}>
              {String(value || "----")}
            </Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default function UserInfoModal({
  userInfo,
  isOpen,
  onOpenChange,
  onSuccess,
}: UserInfoModalProps) {
  const [height, setHeight] = useState<number>(500);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const maxHeight = window.innerHeight * 0.8;

    setHeight(maxHeight);
  }, []);

  const handleApprove = async () => {
    if (!pdfBlob || !userInfo) return;

    setIsLoading(true);
    try {
      const formData = new FormData();

      formData.append("file", pdfBlob, `${uuidv4()}.pdf`);

      const res = await userApi.uploadFile(formData);
      const fileId = res.fileid;

      await userApi.createRecord({
        pdfUrl: fileId,
        name: userInfo.name,
        phoneNumber: userInfo.phoneNumber,
        idCard: userInfo.idCard,
        forms: userInfo.forms,
      });

      addToast({
        title: "成功",
        description: "健康档案数据添加成功",
        color: "success",
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error("上传失败", error);
      addToast({
        title: "失败",
        description: error.message,
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} size="5xl" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>审核健康档案</ModalHeader>
            <ModalBody>
              {userInfo && (
                <div className="space-y-2">
                  <PDFViewer height={height} width="100%">
                    <MyDocument data={userInfo.forms} />
                  </PDFViewer>
                  <BlobProvider document={<MyDocument data={userInfo.forms} />}>
                    {({ blob }) => {
                      if (blob) {
                        setPdfBlob(blob);
                      }

                      return null;
                    }}
                  </BlobProvider>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" isDisabled={isLoading} onPress={onClose}>
                关闭
              </Button>
              <Button
                color="primary"
                isDisabled={!pdfBlob || isLoading}
                isLoading={isLoading}
                onPress={handleApprove}
              >
                审核通过
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
