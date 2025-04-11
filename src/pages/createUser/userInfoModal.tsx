import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
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

interface UserInfoModalProps {
  userInfo: Record<string, any> | undefined;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onApprove?: (pdfBlob: Blob) => void;
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
    backgroundColor: "#E4E4E4",
    padding: 30,
    fontFamily: "Noto Sans SC",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Noto Sans SC",
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
    fontFamily: "Noto Sans SC",
  },
});

// PDF Document component
const MyDocument = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>健康档案</Text>
        {Object.entries(data).map(([key, value]) => (
          <Text key={key} style={styles.text}>
            {key}: {value}
          </Text>
        ))}
      </View>
    </Page>
  </Document>
);

export default function UserInfoModal({
  userInfo,
  isOpen,
  onOpenChange,
  onApprove,
}: UserInfoModalProps) {
  const [height, setHeight] = useState<number>(500);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const maxHeight = window.innerHeight * 0.8;
    setHeight(maxHeight);
  }, []);

  const handleApprove = () => {
    if (pdfBlob && onApprove) {
      onApprove(pdfBlob);
    }
    onOpenChange(false);
  };

  return (
    <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>审核健康档案</ModalHeader>
            <ModalBody>
              {userInfo && (
                <div className="space-y-2">
                  <PDFViewer width="100%" height={height}>
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
              <Button color="danger" onPress={onClose}>
                关闭
              </Button>
              <Button 
                color="primary" 
                onPress={handleApprove}
                isDisabled={!pdfBlob}
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
