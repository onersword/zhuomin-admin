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

interface EditNoteModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  note: {
    id: string;
    content: string;
  };
  onConfirm: (id: string, newContent: string) => void;
}

export default function EditNoteModal({
  isOpen,
  onOpenChange,
  note,
  onConfirm,
}: EditNoteModalProps) {
  const [newContent, setNewContent] = useState(note.content);

  const handleConfirm = () => {
    onConfirm(note.id, newContent);
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>编辑笔记</ModalHeader>
            <ModalBody>
              <Textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="请输入笔记内容"
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