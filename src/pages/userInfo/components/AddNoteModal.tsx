import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
} from "@heroui/react";
import { useState } from "react";

interface AddNoteModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (content: string) => void;
}

export default function AddNoteModal({
  isOpen,
  onOpenChange,
  onConfirm,
}: AddNoteModalProps) {
  const [content, setContent] = useState("");

  const handleConfirm = () => {
    onConfirm(content);
    setContent("");
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>添加健康小结</ModalHeader>
            <ModalBody>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="请输入健康小结内容"
                minRows={5}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                取消
              </Button>
              <Button color="primary" onPress={handleConfirm}>
                确定
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
} 