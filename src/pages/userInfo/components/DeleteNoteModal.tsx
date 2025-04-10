import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface DeleteNoteModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
}

export default function DeleteNoteModal({
  isOpen,
  onOpenChange,
  onConfirm,
}: DeleteNoteModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>删除确认</ModalHeader>
            <ModalBody>
              <p>确定要删除这条健康小结吗？此操作不可恢复。</p>
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