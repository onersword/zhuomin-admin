import { Button, Modal, ModalContent, ModalHeader,  } from "@heroui/react";

export default function UserInfo(props: { userInfo: any }) {
  const { userInfo } = props;
  return (
    <Modal >
      <ModalContent>
        <ModalHeader>
          userInfo
        </ModalHeader>
      </ModalContent>
    </Modal>
  );
}
