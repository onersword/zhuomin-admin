import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
} from "@heroui/react";
import { useState } from "react";

interface UploadFileModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (file: File) => void;
}

export default function UploadFileModal({
  isOpen,
  onOpenChange,
  onConfirm,
}: UploadFileModalProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        addToast({
          title: '错误',
          description: '请上传PDF文件',
          type: 'error',
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleConfirm = () => {
    if (file) {
      onConfirm(file);
      setFile(null);
      onOpenChange(false);
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
                <input
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