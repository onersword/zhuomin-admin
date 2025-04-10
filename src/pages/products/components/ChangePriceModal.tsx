import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { useState } from "react";

interface ChangePriceModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (newPrice: number) => void;
  oldPrice: number;
}

export default function ChangePriceModal({
  isOpen,
  onOpenChange,
  onConfirm,
  oldPrice,
}: ChangePriceModalProps) {
  const [newPrice, setNewPrice] = useState<string>(oldPrice.toString());

  const handleConfirm = () => {
    onConfirm(Number(newPrice));
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>更改价格</ModalHeader>
            <ModalBody>
              <Input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="请输入新价格"
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