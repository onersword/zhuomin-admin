import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
  Input,
} from "@heroui/react";
import { useState } from "react";
import { userApi } from "@/requests/user";

interface UploadFileModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
  userId: string;
}

export default function UploadFileModal({
  isOpen,
  onOpenChange,
  onSuccess,
  userId,
}: UploadFileModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        addToast({
          title: '错误',
          description: '请上传PDF文件',
          color: 'danger',
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleConfirm = async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      await userApi.uploadUserFile(userId, formData);
      addToast({
        title: "成功",
        description: "文件上传成功",
        color: "success",
      });
      onSuccess();
      setFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to upload file:", error);
      addToast({
        title: "错误",
        description: "文件上传失败",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>上传体检报告</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-500">请选择PDF格式的体检报告文件</p>
                <Input
                  placeholder="请选择PDF格式的体检报告文件"
                  title="请选择PDF格式的体检报告文件"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-white
                    hover:file:bg-primary/90"
                />
                {file && (
                  <p className="text-sm text-gray-600">
                    已选择文件: {file.name}
                  </p>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                取消
              </Button>
              <Button 
                color="primary" 
                onPress={handleConfirm}
                isDisabled={!file}
                isLoading={isLoading}
              >
                上传
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
} 