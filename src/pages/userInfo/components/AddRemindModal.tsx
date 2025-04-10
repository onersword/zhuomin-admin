import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import { useState } from "react";
import {
  now,
  getLocalTimeZone,
  parseDate,
  CalendarDate,
} from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import moment from "moment";
interface AddRemindModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (data: {
    title: string;
    description: string;
    remindAt: string;
  }) => void;
}

export default function AddRemindModal({
  isOpen,
  onOpenChange,
  onConfirm,
}: AddRemindModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [remindAt, setRemindAt] = useState("");
  const [dateTime, setDateTime] = useState(now(getLocalTimeZone()));
  let formatter = useDateFormatter({ dateStyle: "full" });

  const handleConfirm = () => {
    onConfirm({ title, description, remindAt });
    setTitle("");
    setDescription("");
    setRemindAt("");
  };

  const handleDateTimeChange = (value: any) => {
    let date = value.toDate(getLocalTimeZone());

    console.log("date", date);
    console.log("moment", moment(date).format("YYYY-MM-DD HH:mm:ss"));
    console.log("date", formatter.format(date));
    console.log("remindAt", moment(date).toISOString());
    setRemindAt(moment(date).toISOString());
    setDateTime(value);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>添加提醒</ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <Input
              label="标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              label="描述"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <DatePicker
              hourCycle={24}
              hideTimeZone
              showMonthAndYearPickers
              value={dateTime}
              onChange={handleDateTimeChange}
              label="提醒时间"
              variant="bordered"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={() => onOpenChange(false)}
          >
            取消
          </Button>
          <Button color="primary" onPress={handleConfirm}>
            确认
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
