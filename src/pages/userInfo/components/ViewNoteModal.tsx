import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface ViewNoteModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  note: {
    content: string;
    updatedAt: string;
  };
}

export default function ViewNoteModal({
  isOpen,
  onOpenChange,
  note,
}: ViewNoteModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>查看健康小结</ModalHeader>
            <ModalBody>
              <div className="whitespace-pre-wrap">{note.content}</div>
              <div className="text-sm text-gray-500 mt-2">
                更新时间: {note.updatedAt}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                关闭
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
} 