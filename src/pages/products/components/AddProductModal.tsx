import { commonApi } from "@/requests/common";
import { CreateProductData, productApi } from "@/requests/product";
import { ProductStatus, ProductType } from "@/types/product";
import { CloudArrowUpIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
  Button,
  addToast,
  Card,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";
import { useRef } from "react";
import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const statusOptions = [
  { label: "下架", value: ProductStatus.OFFLINE },
  { label: "上架", value: ProductStatus.ONLINE },
];

const typeOptions = [
  { label: "金卡套餐", value: ProductType.Gold },
  { label: "铂金套餐", value: ProductType.Platinum },
  { label: "钻石套餐", value: ProductType.Diamond },
  { label: "其他", value: ProductType.Other },
];

// 定义拖拽项的类型
const ItemTypes = {
  IMAGE: "image",
};

// 图片项组件
const ImageItem = ({ file, index, moveImage, onDelete }: { 
  file: File; 
  index: number; 
  moveImage: (dragIndex: number, hoverIndex: number) => void;
  onDelete: (index: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.IMAGE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.IMAGE,
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveImage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`relative group ${isDragging ? "opacity-50" : ""}`}
    >
      <img
        src={URL.createObjectURL(file)}
        alt={`预览 ${index}`}
        className="w-24 h-24 object-cover rounded cursor-move"
      />
      <button
        type="button"
        onClick={() => onDelete(index)}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 
                flex items-center justify-center w-5 h-5 text-xs font-bold"
        title="删除图片"
      >
        <XMarkIcon className="size-4" />
      </button>
    </div>
  );
};

export function AddProductModal({
  isOpen,
  onOpenChange,
  onSuccess,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  // 表单数据
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("次");
  const [status, setStatus] = useState(ProductStatus.OFFLINE);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const [type, setType] = useState(ProductType.Gold);
  // 创建一个文件输入引用，用于重置和触发文件选择
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validForm = () => {
    const newErrors: string[] = [];

    // 验证产品名称
    if (!name) {
      newErrors.push("产品名称不能为空");
    }

    // 验证产品描述
    if (!description) {
      newErrors.push("产品简介不能为空");
    }

    // 验证价格
    if (!price || Number.isNaN(parseFloat(price))) {
      newErrors.push("请检查价格");
    }

    // 验证单位
    if (!unit) {
      newErrors.push("单位不能为空");
    }

    // 验证图片
    if (imageFiles.length === 0) {
      newErrors.push("请上传至少一张产品图片");
    }

    return newErrors;
  };

  // 处理图片上传
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files);
      // 添加新图片到现有图片数组
      setImageFiles((prev) => [...prev, ...fileArray]);

      // 清空文件输入，以便下次可以选择相同的文件
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // 删除图片
  const handleDeleteImage = (indexToRemove: number) => {
    setImageFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  // 移动图片
  const moveImage = (dragIndex: number, hoverIndex: number) => {
    setImageFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      const [removed] = newFiles.splice(dragIndex, 1);
      newFiles.splice(hoverIndex, 0, removed);
      return newFiles;
    });
  };

  // 触发文件选择对话框
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async () => {
    const newErrors = validForm();
    if (newErrors.length > 0) {
      addToast({
        title: "错误",
        description: newErrors[0],
        color: "danger",
      });
      return;
    }
    try {
      setLoading(true);

      // 构建产品数据
      const productData: CreateProductData = {
        name,
        description,
        price: parseFloat(price),
        unit,
        status,
        type,
        images: [],
      };

      // 先上传图片
      if (imageFiles.length > 0) {
        setUploadLoading(true);
        const uploadPromises = imageFiles.map((file) =>
          commonApi.uploadImage(file)
        );
        const uploadResults = await Promise.all(uploadPromises);

        // 提取图片ID
        const imageIds = uploadResults.map((result) => result.file_id);
        productData.images = imageIds;
        setUploadLoading(false);

        // 创建产品
        const res = await productApi.createProduct(productData);
        console.log("create product res", res);

        addToast({
          title: "成功",
          description: "产品创建成功",
          color: "success",
        });
        onSuccess();
      }
    } catch (error) {
      console.error("创建产品失败", error);
      addToast({
        title: "错误",
        description: "产品创建失败",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>添加产品</ModalHeader>
        <ModalBody>
          <div className="max-w-2xl mt-4">
            <Card className="p-4">
              <div className="flex flex-col gap-4">
                <div>
                  <Input
                    label="产品名称"
                    labelPlacement="outside"
                    isRequired
                    placeholder="请输入产品名称"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="bordered"
                    className="w-full"
                    type="text"
                    validate={(value) => {
                      if (!value) {
                        return "产品名称不能为空";
                      }
                      return true;
                    }}
                  />
                </div>

                <div>
                  <Textarea
                    label="产品简介"
                    labelPlacement="outside"
                    isRequired
                    placeholder="请输入产品简介"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    variant="bordered"
                    className="w-full"
                    errorMessage={"产品简介不能为空"}
                    validate={(value) => {
                      if (!value) {
                        return "产品简介不能为空";
                      }
                      return true;
                    }}
                  />
                </div>

                <div className="">
                  <Select
                    placeholder="请选择产品类型"
                    label="产品类型"
                    labelPlacement="outside"
                    selectedKeys={[type.toString()]}
                    onChange={(e) => {
                      setType(parseInt(e.target.value));
                    }}
                    variant="bordered"
                  >
                    {typeOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        textValue={option.label}
                        className="hover:!bg-gray-100"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      label="价格"
                      isRequired
                      labelPlacement="outside"
                      type="number"
                      placeholder="请输入价格"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      variant="bordered"
                      className="w-full"
                      validate={(value) => {
                        if (!value) {
                          return "价格不能为空";
                        } else if (
                          Number.isNaN(parseFloat(value)) ||
                          parseFloat(value) <= 0
                        ) {
                          return "价格不正确";
                        }
                        return true;
                      }}
                    />
                  </div>

                  <div className="flex-1">
                    <Input
                      label="单位"
                      labelPlacement="outside"
                      placeholder="请输入单位，如：次、节、天"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      variant="bordered"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="">
                  <Select
                    placeholder="请选择状态"
                    label="状态"
                    labelPlacement="outside"
                    selectedKeys={[status.toString()]}
                    onChange={(e) => {
                      setStatus(parseInt(e.target.value));
                    }}
                    variant="bordered"
                  >
                    {statusOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        textValue={option.label}
                        className="hover:!bg-gray-100"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div>
                  {/* 隐藏真正的文件输入框 */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />

                  <div className="flex flex-col">
                    <label className="block text-sm font-medium mb-1">
                      产品图片 <span className="text-red-500">*</span>
                    </label>

                    {/* 显示当前上传的图片 */}
                    {imageFiles.length > 0 && (
                      <DndProvider backend={HTML5Backend}>
                        <div className="mt-2 flex gap-2 flex-wrap mb-3">
                          {imageFiles.map((file, index) => (
                            <ImageItem
                              key={index}
                              file={file}
                              index={index}
                              moveImage={moveImage}
                              onDelete={handleDeleteImage}
                            />
                          ))}
                        </div>
                      </DndProvider>
                    )}

                    {/* 自定义上传按钮 */}
                    <Button
                      variant="bordered"
                      color="primary"
                      onPress={triggerFileInput}
                      className="mt-1"
                    >
                      <CloudArrowUpIcon />
                      上传产品图片
                    </Button>
                    <small className="text-gray-500 mt-1">
                      支持 JPG、PNG 格式图片(可拖动排序)
                    </small>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            isLoading={loading || uploadLoading}
            onPress={handleSubmit}
            isDisabled={loading || uploadLoading}
          >
            添加
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
