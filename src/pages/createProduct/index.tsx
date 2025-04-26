import Breadcrumb from "@/components/Breadcrumb";
import DefaultLayout from "@/layouts/default";
import { Button, Card, Input, Select, SelectItem, Textarea, useDisclosure } from "@heroui/react";
import React, { useState } from "react";
import { CreateProductData, productApi } from "@/requests/product";
import { ProductStatus } from "@/types/product";
import { commonApi } from "@/requests/common";
import { useNavigate } from "react-router-dom";

export function CreateProductPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<CreateProductData>({
    name: "",
    description: "",
    price: 0,
    unit: "次",
    status: ProductStatus.OFFLINE,
    images: []
  });
  const [valid, setValid] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleInputChange = (key: keyof CreateProductData, value: any) => {
    setProduct((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files);
      setImageFiles(fileArray);
    }
  };


  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // 先上传图片
      if (imageFiles.length > 0) {
        setUploadLoading(true);
        const uploadPromises = imageFiles.map(file => commonApi.uploadImage(file));
        const uploadResults = await Promise.all(uploadPromises);
        
        // 提取图片ID
        const imageIds = uploadResults.map(result => result.file_id);
        
        // 更新产品数据中的图片列表
        const productWithImages = { ...product, images: imageIds };
        setUploadLoading(false);
        
        // 创建产品
        const res = await productApi.createProduct(productWithImages);
        console.log('create product res', res);
        // navigate("/products");
      } else {
        // // 创建无图片的产品
        // await productApi.createProduct(product);
        // navigate("/products");
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
                value={product.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                variant="bordered"
                className="w-full"
              />
            </div>
            
            <div>
              <Textarea
                label="产品简介"
                labelPlacement="outside"
                isRequired
                placeholder="请输入产品简介"
                value={product.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                variant="bordered"
                className="w-full"
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
                  value={product.price.toString()}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  variant="bordered"
                  className="w-full"
                />
              </div>
              
              <div className="flex-1">
                <Input
                  label="单位"
                  labelPlacement="outside"
                  placeholder="请输入单位，如：次、节、天"
                  value={product.unit}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
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
                selectedKeys={[product.status.toString()]}
                onChange={(e) => {
                  handleInputChange("status", parseInt(e.target.value));
                }}
                variant="bordered"
                className="w-full"
              >
                <SelectItem key="0" textValue="下架">
                  下架
                </SelectItem>
                <SelectItem key="1" textValue="上架">
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
                isDisabled={!valid}
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
