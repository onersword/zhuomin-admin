import Breadcrumb from "@/components/Breadcrumb";
import DefaultLayout from "@/layouts/default";
import { Button, Card, Input, Select, SelectItem, Textarea, useDisclosure } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { CreateProductData, productApi } from "@/requests/product";
import { ProductStatus } from "@/types/product";
import { commonApi } from "@/requests/common";
import { useNavigate } from "react-router-dom";

// 表单验证错误类型
interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  unit?: string;
  images?: string;
}

export function CreateProductPage() {
  const navigate = useNavigate();
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
  const [errors, setErrors] = useState<FormErrors>({});

  // const validForm = () => {
  //   const newErrors: FormErrors = {};
    
  //   // 验证产品名称
  //   if (!name) {
  //     newErrors.name = "产品名称不能为空";
  //   }
    
  //   // 验证产品描述
  //   if (!description) {
  //     newErrors.description = "产品简介不能为空";
  //   }
    
  //   // 验证价格
  //   if (!price) {
  //     newErrors.price = "价格不能为空";
  //   } else if (parseFloat(price) <= 0) {
  //     newErrors.price = "价格必须大于0";
  //   }
    
  //   // 验证单位
  //   if (!unit) {
  //     newErrors.unit = "单位不能为空";
  //   }
    
  //   // 验证图片
  //   if (imageFiles.length === 0) {
  //     newErrors.images = "请上传至少一张产品图片";
  //   }
    
  //   return newErrors;

  // }


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files);
      setImageFiles(fileArray);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // 构建产品数据
      const productData: CreateProductData = {
        name,
        description,
        price: parseFloat(price),
        unit,
        status,
        images: []
      };
      
      // 先上传图片
      if (imageFiles.length > 0) {
        setUploadLoading(true);
        const uploadPromises = imageFiles.map(file => commonApi.uploadImage(file));
        const uploadResults = await Promise.all(uploadPromises);
        
        // 提取图片ID
        const imageIds = uploadResults.map(result => result.file_id);
        productData.images = imageIds;
        setUploadLoading(false);
        
        // 创建产品
        const res = await productApi.createProduct(productData);
        console.log('create product res', res);
        navigate("/products");
      }
    } catch (error) {
      console.error("创建产品失败", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb items={[{ path: "/products", text: "返回产品列表" }]} />
      <div className="max-w-2xl mt-4">
        <Card className="p-4">
          <h1 className="text-xl font-bold mb-4">创建新产品</h1>
          
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
                    return '产品名称不能为空';
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
                errorMessage={'产品简介不能为空'}
                validate={(value) => {
                  if (!value) {
                    return '产品简介不能为空';
                  }
                  return true;
                }}
              />
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
                      return '价格不能为空';
                    } else if (Number.isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
                      return '价格不正确';
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
                  errorMessage={errors.unit}
                  isInvalid={!!errors.unit}
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
                <SelectItem key="0" textValue="下架" className="hover:!bg-gray-100" >
                  下架
                </SelectItem>
                <SelectItem key="1" textValue="上架" className="hover:!bg-gray-100">
                  上架
                </SelectItem>
              </Select>
            </div>
            
            <div>
              <Input
                label="产品图片"
                isRequired
                labelPlacement="outside"
                type="file"
                multiple
                onChange={handleImageChange}
                errorMessage={errors.images}
                isInvalid={!!errors.images}
              />
              
              {imageFiles.length > 0 && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`预览 ${index}`}
                        className="w-24 h-24 object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-center items-center gap-2 pt-4">
              <Button
              fullWidth
                color="primary"
                isLoading={loading || uploadLoading}
                onPress={handleSubmit}
                isDisabled={loading || uploadLoading }
              >
                创建产品
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DefaultLayout>
  );
}
