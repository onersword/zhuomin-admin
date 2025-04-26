import { useState } from "react";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Textarea,
  Select,
  SelectItem,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  CalendarDate,
  DateInput,
} from "@heroui/react";
import DefaultLayout from "@/layouts/default";
import Breadcrumb from "@/components/Breadcrumb";
import { getLocalTimeZone, parseDate, now } from "@internationalized/date";
import moment from "moment";

export default function CreateUser() {
  const [formData, setFormData] = useState({
    // 基本信息
    name: "",
    gender: "",
    nationality: "中国",
    birthDate: "",
    occupation: "",
    address: "",
    idNumber: "",
    emergencyContact: "",
    emergencyPhone: "",
    maritalStatus: "",
    insuranceTypes: [] as string[],

    // 健康信息
    height: "",
    weight: "",
    waistline: "",
    bloodType: "",
    rhType: "",
    pulse: "",
    medication: "无",
    medicationDetail: "",

    // 过敏史
    allergies: [] as string[],

    // 病史
    medicalHistory: [] as string[],
    hospitalizationHistory: "",

    // 生活习惯
    smokingHistory: [] as string[],
    exerciseHabits: [] as string[],
    dietaryHabits: [] as string[],

    // 睡眠质量
    sleepQuality: [] as string[],
    sleepHours: "7",
  });
  const [dateTime, setDateTime] = useState(parseDate("2024-04-04"));

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (field: string, value: string) => {
    setFormData((prev) => {
      const currentValues = prev[field as keyof typeof prev] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return {
        ...prev,
        [field]: newValues,
      };
    });
  };

  const handleDateTimeChange = (value: any) => {
    setDateTime(value);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 实现表单提交逻辑
    console.log("Form submitted:", formData);
  };

  const occupationOptions = [
    { label: "请选择职业", value: "" },
    { label: "医生", value: "医生" },
    { label: "教师", value: "教师" },
    { label: "工程师", value: "工程师" },
    { label: "公务员", value: "公务员" },
    { label: "销售", value: "销售" },
    { label: "学生", value: "学生" },
    { label: "自由职业", value: "自由职业" },
    { label: "其他", value: "其他" },
  ];

  const bloodTypeOptions = [
    { label: "选择血型", value: "" },
    { label: "A型", value: "A型" },
    { label: "B型", value: "B型" },
    { label: "AB型", value: "AB型" },
    { label: "O型", value: "O型" },
  ];

  const rhTypeOptions = [
    { label: "选择Rh血型", value: "" },
    { label: "Rh阳性", value: "Rh阳性" },
    { label: "Rh阴性", value: "Rh阴性" },
  ];

  return (
    <DefaultLayout>
      <div className="p-4">
        <Breadcrumb items={[{ path: "/users", text: "返回用户列表" }]} />

        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">卓敏医生集团健康档案采集</h1>

          <Form onSubmit={handleSubmit} className="space-y-8">
            {/* 基本信息部分 */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">基本信息</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <Input
                    label="姓名"
                    labelPlacement="outside"
                    variant="bordered"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="请输入姓名"
                    isRequired
                  />
                </div>

                <div className="mb-4">
                  <RadioGroup
                    label="性别"
                    orientation="horizontal"
                    isRequired
                    value={formData.gender}
                    onValueChange={(value) =>
                      handleInputChange("gender", value)
                    }
                  >
                    <Radio value="男">男</Radio>
                    <Radio value="女">女</Radio>
                  </RadioGroup>
                </div>

                <div className="mb-4">
                  <Input
                    label="国籍/籍贯"
                    labelPlacement="outside"
                    variant="bordered"
                    type="text"
                    value={formData.nationality}
                    onChange={(e) =>
                      handleInputChange("nationality", e.target.value)
                    }
                    placeholder="请输入国籍"
                    isRequired
                  />
                </div>

                <div className="mb-4">
                  <DatePicker
                    labelPlacement="outside"
                    className="max-w-sm"
                    label={"出生日期"}
                    value={dateTime}
                    onChange={(e) => handleDateTimeChange(e)}
                  />
                </div>

                <div className="mb-4">
                  <Select
                    label="职业"
                    labelPlacement="outside"
                    placeholder="请选择职业"
                    selectedKeys={[formData.occupation]}
                    onChange={(e) =>
                      handleInputChange("occupation", e.target.value)
                    }
                    variant="bordered"
                    isRequired
                  >
                    {occupationOptions.map((option) => (
                      <SelectItem key={option.value}>{option.label}</SelectItem>
                    ))}
                  </Select>
                </div>

                <div className="mb-4">
                  <Input
                    label="家庭地址"
                    labelPlacement="outside"
                    variant="bordered"
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="请输入家庭地址"
                  />
                </div>

                <div className="mb-4">
                  <Input
                    label="身份证号/护照号"
                    labelPlacement="outside"
                    variant="bordered"
                    type="text"
                    value={formData.idNumber}
                    onChange={(e) =>
                      handleInputChange("idNumber", e.target.value)
                    }
                    placeholder="请输入身份证号/护照号"
                    isRequired
                  />
                </div>

                <div className="mb-4">
                  <Input
                    label="紧急联系人/关系"
                    labelPlacement="outside"
                    variant="bordered"
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) =>
                      handleInputChange("emergencyContact", e.target.value)
                    }
                    placeholder="请输入紧急联系人姓名及关系"
                    isRequired
                  />
                </div>

                <div className="mb-4">
                  <Input
                    label="紧急联系人电话"
                    labelPlacement="outside"
                    variant="bordered"
                    type="text"
                    value={formData.emergencyPhone}
                    onChange={(e) =>
                      handleInputChange("emergencyPhone", e.target.value)
                    }
                    placeholder="请输入紧急联系人电话"
                    isRequired
                  />
                </div>

                <div className="mb-4">
                  <RadioGroup
                    label="婚姻状况"
                    orientation="horizontal"
                    isRequired
                    value={formData.maritalStatus}
                    onValueChange={(value) =>
                      handleInputChange("maritalStatus", value)
                    }
                  >
                    <Radio value="已婚">已婚</Radio>
                    <Radio value="未婚">未婚</Radio>
                    <Radio value="离异或丧偶">离异或丧偶</Radio>
                  </RadioGroup>
                </div>

                <div className="mb-4">
                  <CheckboxGroup
                    label="医疗保险类型"
                    orientation="horizontal"
                    value={formData.insuranceTypes}
                    onValueChange={(values) =>
                      handleInputChange("insuranceTypes", values)
                    }
                    isRequired
                  >
                    <Checkbox value="医保">医保</Checkbox>
                    <Checkbox value="自费">自费</Checkbox>
                    <Checkbox value="商保">商保</Checkbox>
                    <Checkbox value="其他">其他</Checkbox>
                  </CheckboxGroup>
                </div>
              </div>
            </Card>

            {/* 健康信息部分 */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">健康信息</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <Input
                    label="身高 (厘米)"
                    labelPlacement="outside"
                    variant="bordered"
                    type="number"
                    value={formData.height}
                    onChange={(e) =>
                      handleInputChange("height", e.target.value)
                    }
                    placeholder="请输入身高"
                  />
                </div>

                <div className="mb-4">
                  <Input
                    label="体重 (公斤)"
                    labelPlacement="outside"
                    variant="bordered"
                    type="number"
                    value={formData.weight}
                    onChange={(e) =>
                      handleInputChange("weight", e.target.value)
                    }
                    placeholder="请输入体重"
                  />
                </div>

                <div className="mb-4">
                  <Input
                    label="腰围 (厘米)"
                    labelPlacement="outside"
                    variant="bordered"
                    type="number"
                    value={formData.waistline}
                    onChange={(e) =>
                      handleInputChange("waistline", e.target.value)
                    }
                    placeholder="请输入腰围"
                  />
                </div>

                <div className="mb-4">
                  <Select
                    label="血型"
                    labelPlacement="outside"
                    placeholder="选择血型"
                    selectedKeys={[formData.bloodType]}
                    onChange={(e) =>
                      handleInputChange("bloodType", e.target.value)
                    }
                    variant="bordered"
                  >
                    {bloodTypeOptions.map((option) => (
                      <SelectItem key={option.value}>{option.label}</SelectItem>
                    ))}
                  </Select>
                </div>

                <div className="mb-4">
                  <Select
                    label="Rh血型"
                    labelPlacement="outside"
                    placeholder="选择Rh血型"
                    selectedKeys={[formData.rhType]}
                    onChange={(e) =>
                      handleInputChange("rhType", e.target.value)
                    }
                    variant="bordered"
                  >
                    {rhTypeOptions.map((option) => (
                      <SelectItem key={option.value}>{option.label}</SelectItem>
                    ))}
                  </Select>
                </div>

                <div className="mb-4">
                  <Input
                    label="脉搏 (次/分钟)"
                    labelPlacement="outside"
                    variant="bordered"
                    type="number"
                    value={formData.pulse}
                    onChange={(e) => handleInputChange("pulse", e.target.value)}
                    placeholder="请输入脉搏"
                  />
                </div>

                <div className="mb-4">
                  <RadioGroup
                    label="用药情况"
                    orientation="horizontal"
                    value={formData.medication}
                    onValueChange={(value) =>
                      handleInputChange("medication", value)
                    }
                  >
                    <Radio value="无">无</Radio>
                    <Radio value="有">有</Radio>
                  </RadioGroup>
                  {formData.medication === "有" && (
                    <Textarea
                      className="w-full mt-2"
                      value={formData.medicationDetail}
                      onChange={(e) =>
                        handleInputChange("medicationDetail", e.target.value)
                      }
                      placeholder="请描述您的用药情况(药物名称；剂量；复用频率)"
                      variant="bordered"
                    />
                  )}
                </div>
              </div>
            </Card>

            {/* 过敏史部分 */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">药物或食物过敏史</h2>
              <div className="mb-4">
                <CheckboxGroup
                  label="过敏史"
                  orientation="horizontal"
                  value={formData.allergies}
                  onValueChange={(values) =>
                    handleInputChange("allergies", values)
                  }
                  isRequired
                  className="grid grid-cols-2 md:grid-cols-3 gap-2"
                >
                  <Checkbox value="无">无</Checkbox>
                  <Checkbox value="头孢菌素">头孢菌素</Checkbox>
                  <Checkbox value="海鲜">海鲜</Checkbox>
                  <Checkbox value="坚果">坚果</Checkbox>
                  <Checkbox value="青霉素">青霉素</Checkbox>
                  <Checkbox value="磺胺类药物">磺胺类药物</Checkbox>
                  <Checkbox value="花粉">花粉</Checkbox>
                  <Checkbox value="牛奶">牛奶</Checkbox>
                  <Checkbox value="其他">其他</Checkbox>
                </CheckboxGroup>
              </div>
            </Card>

            {/* 病史部分 */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">病史</h2>
              <div className="mb-4">
                <CheckboxGroup
                  label="既往史"
                  orientation="horizontal"
                  value={formData.medicalHistory}
                  onValueChange={(values) =>
                    handleInputChange("medicalHistory", values)
                  }
                  isRequired
                  className="grid grid-cols-2 gap-2"
                >
                  <Checkbox value="无">无</Checkbox>
                  <Checkbox value="糖尿病">糖尿病</Checkbox>
                  <Checkbox value="高血压">高血压</Checkbox>
                  <Checkbox value="高血脂">高血脂</Checkbox>
                  <Checkbox value="高尿酸">高尿酸</Checkbox>
                  <Checkbox value="冠心病">冠心病</Checkbox>
                  <Checkbox value="脑卒中">脑卒中</Checkbox>
                  <Checkbox value="恶性肿瘤">恶性肿瘤</Checkbox>
                  <Checkbox value="慢性阻塞性肺疾病">慢性阻塞性肺疾病</Checkbox>
                  <Checkbox value="乙肝">乙肝</Checkbox>
                  <Checkbox value="心律失常">心律失常</Checkbox>
                  <Checkbox value="甲状腺疾病">甲状腺疾病</Checkbox>
                  <Checkbox value="肾脏疾病">肾脏疾病</Checkbox>
                  <Checkbox value="胃肠道疾病">胃肠道疾病</Checkbox>
                  <Checkbox value="精神疾病">精神疾病</Checkbox>
                  <Checkbox value="过敏史">过敏史</Checkbox>
                  <Checkbox value="脂肪肝">脂肪肝</Checkbox>
                  <Checkbox value="胆结石">胆结石</Checkbox>
                  <Checkbox value="肝脾肿">肝脾肿</Checkbox>
                  <Checkbox value="其他">其他</Checkbox>
                </CheckboxGroup>
              </div>

              <div className="mt-4">
                <Textarea
                  label="住院史"
                  labelPlacement="outside"
                  variant="bordered"
                  value={formData.hospitalizationHistory}
                  onChange={(e) =>
                    handleInputChange("hospitalizationHistory", e.target.value)
                  }
                  placeholder="无"
                  isRequired
                />
              </div>
            </Card>

            {/* 生活习惯部分 */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">生活习惯</h2>
              <div className="mb-4">
                <CheckboxGroup
                  label="吸烟饮酒史"
                  orientation="horizontal"
                  value={formData.smokingHistory}
                  onValueChange={(values) =>
                    handleInputChange("smokingHistory", values)
                  }
                  isRequired
                  className="grid grid-cols-2 gap-2"
                >
                  <Checkbox value="无">无</Checkbox>
                  <Checkbox value="长期吸烟">长期吸烟</Checkbox>
                  <Checkbox value="长期饮酒">长期饮酒</Checkbox>
                  <Checkbox value="戒烟戒酒史">戒烟戒酒史</Checkbox>
                </CheckboxGroup>
              </div>

              <div className="mt-4">
                <CheckboxGroup
                  label="运动习惯"
                  orientation="horizontal"
                  value={formData.exerciseHabits}
                  onValueChange={(values) =>
                    handleInputChange("exerciseHabits", values)
                  }
                  isRequired
                  className="grid grid-cols-2 gap-2"
                >
                  <Checkbox value="基本不运动">基本不运动</Checkbox>
                  <Checkbox value="每日步行">每日步行</Checkbox>
                  <Checkbox value="长跑">长跑</Checkbox>
                  <Checkbox value="游泳">游泳</Checkbox>
                  <Checkbox value="登山">登山</Checkbox>
                  <Checkbox value="其他">其他</Checkbox>
                </CheckboxGroup>
              </div>

              <div className="mt-4">
                <CheckboxGroup
                  label="饮食习惯"
                  orientation="horizontal"
                  value={formData.dietaryHabits}
                  onValueChange={(values) =>
                    handleInputChange("dietaryHabits", values)
                  }
                  isRequired
                  className="grid grid-cols-2 gap-2"
                >
                  <Checkbox value="三餐规律">三餐规律</Checkbox>
                  <Checkbox value="清淡">清淡</Checkbox>
                  <Checkbox value="偏咸">偏咸</Checkbox>
                  <Checkbox value="辛辣">辛辣</Checkbox>
                  <Checkbox value="喜甜食">喜甜食</Checkbox>
                  <Checkbox value="口味偏重">口味偏重</Checkbox>
                  <Checkbox value="应酬多">应酬多</Checkbox>
                  <Checkbox value="三餐不规律">三餐不规律</Checkbox>
                  <Checkbox value="其他">其他</Checkbox>
                </CheckboxGroup>
              </div>
            </Card>

            {/* 睡眠质量部分 */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">睡眠质量</h2>
              <div className="mb-4">
                <CheckboxGroup
                  label="睡眠质量"
                  orientation="horizontal"
                  value={formData.sleepQuality}
                  onValueChange={(values) =>
                    handleInputChange("sleepQuality", values)
                  }
                  isRequired
                  className="grid grid-cols-2 gap-2"
                >
                  <Checkbox value="好">好</Checkbox>
                  <Checkbox value="有失眠">有失眠</Checkbox>
                  <Checkbox value="有鼾症">有鼾症</Checkbox>
                </CheckboxGroup>
              </div>

              <div className="mt-4">
                <Input
                  label="睡眠时间"
                  labelPlacement="outside"
                  variant="bordered"
                  type="number"
                  value={formData.sleepHours}
                  onChange={(e) =>
                    handleInputChange("sleepHours", e.target.value)
                  }
                  placeholder="请输入平均每晚睡眠时间（小时）"
                  isRequired
                />
              </div>
            </Card>

            <div className="flex justify-center">
              <Button type="submit" color="primary" className="px-8 py-2">
                提交
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </DefaultLayout>
  );
}
