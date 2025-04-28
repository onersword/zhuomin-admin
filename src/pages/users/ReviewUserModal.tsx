import { User, userApi } from "@/requests/user";
import {
  addToast,
  Button,
  Card,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useEffect, useState } from "react";

export function ReviewUserModal({
  isOpen,
  onOpenChange,
  user,
  onSuccess,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user: User;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const reviewUserPass = async () => {
    setLoading(true);
    const res = await userApi.updateUser(user.id, {
      status: 2,
    });
    console.log('res', res);
    addToast({
      title: '审核通过',
      description: '用户审核通过',
      color: 'success',
    });
    onSuccess();
    onOpenChange(false);
  }

  const rejectUser= async () => {
    const res = await userApi.deleteUser(user.id);
    if (res.status === 200) {
      onOpenChange(false);
    }
    addToast({
      title: '审核不通过',
      description: '用户审核不通过，已删除用户信息',
      color: 'danger',
    });
    onSuccess();
    onOpenChange(false);
  }

  const getUserInfo = async () => {
    const res = await userApi.getUserById(user.id);
    console.log('res', res);
    setUserInfo(res);
  }
  useEffect(() => {
    getUserInfo().then();
  }, [user]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside" size="4xl">
      <ModalContent>
        <ModalHeader className="border-b border-gray-300">审核用户</ModalHeader>
        <ModalBody>
            <div className="flex flex-col">

            {(userInfo?.forms || []).map((item, index) => (
                <div className="grid grid-cols-5 items-center border-b border-gray-300 py-4 " key={index}>
                  <div className="col-span-1 w-[400px]">
                    <span className="text-sm font-medium text-gray-500">
                      {item.label}
                    </span>
                  </div>
                  <div className="col-span-4">
                    <p className="text-base font-semibold">{item.value}</p>
                  </div>
                </div>
            ))}
            </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onPress={rejectUser} isDisabled={loading}>审核不通过(删除用户信息)</Button>
          <Button color="primary" onPress={reviewUserPass} isDisabled={loading} isLoading={loading}>审核通过</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
