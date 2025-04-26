import {
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
  Button,
} from "@heroui/react";

export function AddProductModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>添加产品</ModalHeader>
        <ModalBody>
          <Input type="text" placeholder="请输入产品名称" />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={() => {}}>
            添加
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
