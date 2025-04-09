import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
} from "@heroui/react";
import { useEffect } from "react";

export function UserInfo({
  userInfo,
  onClose: onCloseCallback,
  open,
}: {
  userInfo: Record<string, any> | undefined;
  onClose: () => void;
  open: boolean;
}) {
  const { isOpen, onOpen, onOpenChange, onClose: closeModal } = useDisclosure();

  const onClose = () => {
    onCloseCallback();
    closeModal();
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    onOpen();
  }, [open]);
  if (!userInfo) {
    return;
  }
  console.log("userInfo", userInfo);

  return (
    <Modal isOpen={isOpen} size="5xl" onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">健康档案</ModalHeader>
            <ModalBody>
              {Object.keys(userInfo).map((key) => (
                <div>
                  <div>{key}</div>
                  <div>{userInfo[key]}</div>
                </div>
              ))}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
