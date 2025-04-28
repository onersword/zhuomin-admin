import { Product, productApi } from "@/requests/product";
import { addToast, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

export function DeleteProductModal({
  isOpen,
  onOpenChange,
  product,
  onConfirm,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  product: Product;
}) {
  const handleConfirm = () => {
    productApi.deleteProduct(product.id).then(() => {
      addToast({
        title: '删除成功',
        description: '产品已删除',
        color: 'success',
      });
      onConfirm();

      onOpenChange(false);
    });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
             <ModalHeader>删除确认</ModalHeader>
            <ModalBody>
              <p>确定要删除这个产品「{product.name}」吗？此操作不可恢复。</p>
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
