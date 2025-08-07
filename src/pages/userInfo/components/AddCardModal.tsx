import { userApi } from "@/requests/user";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Input,
  addToast,
} from "@heroui/react";
import { useState } from "react";
import { UserCard } from "@/types/user";

interface AddCardModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
  userId: string;
  hasExistingCard: boolean;
}

export default function AddCardModal({
  isOpen,
  onOpenChange,
  onSuccess,
  userId,
  hasExistingCard,
}: AddCardModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!title.trim() || !content.trim()) {
      addToast({
        title: '错误',
        description: '请填写完整的会员卡信息',
        color: 'danger',
      });
      return;
    }

    setIsLoading(true);
    try {
      await userApi.createUserCard(userId, { title, content });
      addToast({
        title: "成功",
        description: "会员卡创建成功",
        color: "success",
      });
      onSuccess();
      setTitle("");
      setContent("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create card:", error);
      addToast({
        title: "错误",
        description: "会员卡创建失败",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>添加会员卡</ModalHeader>
            <ModalBody>
              {hasExistingCard ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">每个用户只能创建一张会员卡</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Input
                    label="会员卡标题"
                    placeholder="请输入会员卡标题"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    isRequired
                  />
                  <Textarea
                    label="会员卡内容"
                    placeholder="请输入会员卡内容"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    isRequired
                    minRows={3}
                  />
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={handleClose}>
                取消
              </Button>
              {!hasExistingCard && (
                <Button 
                  color="primary" 
                  onPress={handleConfirm}
                  isDisabled={!title.trim() || !content.trim()}
                  isLoading={isLoading}
                >
                  创建
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
} 