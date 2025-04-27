import { User } from "@/requests/user";
import {
  Button,
  Card,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

export function ReviewUserModal({
  isOpen,
  onOpenChange,
  user,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user: User;
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>审核用户</ModalHeader>
        <ModalBody>
          <Card>
            {(user.forms || []).map((item, index) => (
              <div className="flex flex-col gap-4" key={index}>
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-3">
                    <span className="text-sm font-medium text-gray-500">
                      {item.label}
                    </span>
                  </div>
                  <div className="col-span-9">
                    <p className="text-base font-semibold">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button color="danger">审核不通过(删除用户信息)</Button>
          <Button color="primary">审核通过</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
