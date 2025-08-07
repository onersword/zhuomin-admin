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
import { useState, useEffect } from "react";
import { UserCard } from "@/types/user";

interface EditCardModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
  userId: string;
  card: UserCard | null;
}

export default function EditCardModal({
  isOpen,
  onOpenChange,
  onSuccess,
  userId,
  card,
}: EditCardModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (card) {
      setTitle(card.title || "");
      setContent(card.content || "");
    }
  }, [card]);

  const handleConfirm = async () => {
    if (!card) {
      addToast({
        title: '错误',
        description: '会员卡信息不存在',
        color: 'danger',
      });
      return;
    }

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
      await userApi.updateUserCard(userId, card.id, { title, content });
      addToast({
        title: "成功",
        description: "会员卡更新成功",
        color: "success",
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update card:", error);
      addToast({
        title: "错误",
        description: "会员卡更新失败",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>编辑会员卡</ModalHeader>
            <ModalBody>
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
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={handleClose}>
                取消
              </Button>
              <Button 
                color="primary" 
                onPress={handleConfirm}
                isDisabled={!title.trim() || !content.trim()}
                isLoading={isLoading}
              >
                更新
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
} 