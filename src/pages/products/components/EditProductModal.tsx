import { Product } from "@/requests/product";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

export default function EditProductModal({
  isOpen,
  onOpenChange,
  product,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product: Product;
}) {
  return (
    
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>编辑产品</ModalHeader>
            <ModalBody>
              <div>EditProduct</div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                关闭
              </Button>
              <Button color="primary" onPress={onClose}>
                保存
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}