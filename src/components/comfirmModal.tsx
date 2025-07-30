import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { useState } from "react";

export const ComfirmModal = ({
  isOpen,
  onClose,
  content,
  onConfirm,
}: {
  isOpen: boolean;
  content: string;
  onClose?: () => void;
  onConfirm?: (props: { close: () => void }) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async (close: () => void) => {
    if (onConfirm) {
      try {
        setIsLoading(true);
        await onConfirm({ close }); // 外部处理 onConfirm 结果
      } finally {
        setIsLoading(false); // 无论成功或失败，恢复加载状态
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader>删除确认</ModalHeader>
            <ModalBody>
              <p>{content}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={close}>
                取消
              </Button>
              <Button
                color="primary"
                isDisabled={isLoading}
                isLoading={isLoading}
                onPress={() => handleConfirm(close)}
              >
                确定
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
