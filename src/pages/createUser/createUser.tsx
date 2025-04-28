import { FormEvent, useState } from "react";
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
  addToast,
} from "@heroui/react";
import DefaultLayout from "@/layouts/default";
import Breadcrumb from "@/components/Breadcrumb";
import { getLocalTimeZone, parseDate, now } from "@internationalized/date";
import moment from "moment";
import { userApi } from "@/requests/user";

// 下拉选择框选项配置
const selectOptions = {
  occupation: [
    { label: "请选择职业", value: "" },
    { label: "医生", value: "医生" },
    { label: "教师", value: "教师" },
    { label: "工程师", value: "工程师" },
    { label: "公务员", value: "公务员" },
    { label: "销售", value: "销售" },
    { label: "学生", value: "学生" },
    { label: "自由职业", value: "自由职业" },
    { label: "其他", value: "其他" },
  ],
  bloodType: [
    { label: "选择血型", value: "" },
    { label: "A型", value: "A型" },
    { label: "B型", value: "B型" },
    { label: "AB型", value: "AB型" },
    { label: "O型", value: "O型" },
  ],
  rhType: [
    { label: "选择Rh血型", value: "" },
    { label: "Rh阳性", value: "Rh阳性" },
    { label: "Rh阴性", value: "Rh阴性" },
  ],
};

// 复选框选项配置
const checkboxOptions = {
  insurance: [
    { label: "医保", value: "医保" },
    { label: "自费", value: "自费" },
    { label: "商保", value: "商保" },
    { label: "其他", value: "其他" },
  ],
  allergies: [
    { label: "无", value: "无" },
    { label: "头孢菌素", value: "头孢菌素" },
    { label: "海鲜", value: "海鲜" },
    { label: "坚果", value: "坚果" },
    { label: "青霉素", value: "青霉素" },
    { label: "磺胺类药物", value: "磺胺类药物" },
    { label: "花粉", value: "花粉" },
    { label: "牛奶", value: "牛奶" },
    { label: "其他", value: "其他" },
  ],
  medicalHistory: [
    { label: "无", value: "无" },
    { label: "糖尿病", value: "糖尿病" },
    { label: "高血压", value: "高血压" },
    { label: "高血脂", value: "高血脂" },
    { label: "高尿酸", value: "高尿酸" },
    { label: "冠心病", value: "冠心病" },
    { label: "脑卒中", value: "脑卒中" },
    { label: "恶性肿瘤", value: "恶性肿瘤" },
    { label: "慢性阻塞性肺疾病", value: "慢性阻塞性肺疾病" },
    { label: "乙肝", value: "乙肝" },
    { label: "心律失常", value: "心律失常" },
    { label: "甲状腺疾病", value: "甲状腺疾病" },
    { label: "肾脏疾病", value: "肾脏疾病" },
    { label: "胃肠道疾病", value: "胃肠道疾病" },
    { label: "精神疾病", value: "精神疾病" },
    { label: "过敏史", value: "过敏史" },
    { label: "脂肪肝", value: "脂肪肝" },
    { label: "胆结石", value: "胆结石" },
    { label: "肝脾肿", value: "肝脾肿" },
    { label: "其他", value: "其他" },
  ],
  smokingHistory: [
    { label: "无", value: "无" },
    { label: "长期吸烟", value: "长期吸烟" },
    { label: "长期饮酒", value: "长期饮酒" },
    { label: "戒烟戒酒史", value: "戒烟戒酒史" },
  ],
  exerciseHabits: [
    { label: "基本不运动", value: "基本不运动" },
    { label: "每日步行", value: "每日步行" },
    { label: "长跑", value: "长跑" },
    { label: "游泳", value: "游泳" },
    { label: "登山", value: "登山" },
    { label: "其他", value: "其他" },
  ],
  dietaryHabits: [
    { label: "三餐规律", value: "三餐规律" },
    { label: "清淡", value: "清淡" },
    { label: "偏咸", value: "偏咸" },
    { label: "辛辣", value: "辛辣" },
    { label: "喜甜食", value: "喜甜食" },
    { label: "口味偏重", value: "口味偏重" },
    { label: "应酬多", value: "应酬多" },
    { label: "三餐不规律", value: "三餐不规律" },
    { label: "其他", value: "其他" },
  ],
  sleepQuality: [
    { label: "好", value: "好" },
    { label: "有失眠", value: "有失眠" },
    { label: "有鼾症", value: "有鼾症" },
  ],
};

// 单选框选项配置
const radioOptions = {
  gender: [
    { label: "男", value: "男" },
    { label: "女", value: "女" },
  ],
  maritalStatus: [
    { label: "已婚", value: "已婚" },
    { label: "未婚", value: "未婚" },
    { label: "离异或丧偶", value: "离异或丧偶" },
  ],
  medication: [
    { label: "无", value: "无" },
    { label: "有", value: "有" },
  ],
};

const handleSelectVauleNo = (values: string[], noLable = "无") => {
  const noIndex = values.indexOf(noLable);
  if (noIndex === -1) {
    return values;
  }
  if (noIndex === 0 && values.length > 1) {
    return values.filter((value) => value !== noLable);
  }
  if (noIndex === values.length - 1) {
    return values.filter((value) => value === noLable);
  }
  return values;
};

export default function CreateUser() {
  // 基本信息
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [createDate, setCreateDate] = useState(parseDate("2024-04-04"));
  const [birthDate, setBirthDate] = useState<CalendarDate | undefined>();
  const [nationality, setNationality] = useState("中国");
  const [occupation, setOccupation] = useState("");
  const [address, setAddress] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [insuranceTypes, setInsuranceTypes] = useState<string[]>([]);

  // 健康信息
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [waistline, setWaistline] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [rhType, setRhType] = useState("");
  const [pulse, setPulse] = useState("");
  const [medication, setMedication] = useState("无");
  const [medicationDetail, setMedicationDetail] = useState("");

  // 过敏史
  const [allergies, setAllergies] = useState<string[]>([]);

  // 病史
  const [medicalHistory, setMedicalHistory] = useState<string[]>([]);
  const [hospitalizationHistory, setHospitalizationHistory] = useState("");

  // 生活习惯
  const [smokingHistory, setSmokingHistory] = useState<string[]>([]);
  const [exerciseHabits, setExerciseHabits] = useState<string[]>([]);
  const [dietaryHabits, setDietaryHabits] = useState<string[]>([]);

  // 睡眠质量
  const [sleepQuality, setSleepQuality] = useState<string[]>([]);
  const [sleepHours, setSleepHours] = useState("7");


  const handleDateTimeChange = (value: any) => {
    setBirthDate(value);
    // 更新出生日期
    // if (value) {
    //   const date = value.toString();
    //   setBirthDate(date);
    // }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", e);
    const data = [];
    //基本信息
    data.push({ label: "建档日期", value: createDate.toString() });
    data.push({ label: "姓名", value: name });
    data.push({ label: "手机号", value: phoneNumber });
    data.push({ label: "性别", value: gender });
    data.push({ label: "国籍/籍贯", value: nationality });
    if (!birthDate) {
      return;

    }
    data.push({ label: "出生日期", value: birthDate.toString() });
    data.push({
      label: "职业",
      value: occupation,
    });
    data.push({ label: "地址", value: address });
    data.push({ label: "身份证号/护照号", value: idNumber });
    data.push({ label: "紧急联系人/关系", value: emergencyContact });
    data.push({ label: "紧急联系人电话", value: emergencyPhone });
    data.push({ label: "婚姻状况", value: maritalStatus });

    // 医疗保险类型
    data.push({
      label: "医疗保险类型",
      value: insuranceTypes.join(","),
    });
    // 基本信息结束

    // 健康信息
    if (height) {
      data.push({ label: "身高", value: height + "cm" });
    }
    if (weight) {
      data.push({ label: "体重", value: weight + "kg" });
    }
    if (waistline) {
      data.push({ label: "腰围", value: waistline + "cm" });
    }
    if (bloodType) {
      data.push({
        label: "血型",
        value: bloodType,
      });
    }
    if (rhType) {
      data.push({
        label: "Rh血型",
        value: rhType,
      });
    }
    if (pulse) {
      data.push({ label: "脉搏", value: pulse + "次/分" });
    }
    const medicationObj = {
      label: "用药情况",
      value: "无",
    };
    if (medication === "有") {
      medicationObj.value = medicationDetail || "无";
    }
    data.push(medicationObj);
    // 过敏史
    data.push({
      label: "过敏史",
      value: allergies.join(","),
    });

    // 既往史
    data.push({
      label: "既往史",
      value: medicalHistory.join(","),
    });

    data.push({ label: "住院史", value: hospitalizationHistory || "无" });

    // 生活习惯
    data.push({
      label: "吸烟饮酒史",
      value: smokingHistory.join(","),
    });

    data.push({
      label: "运动习惯",
      value: exerciseHabits.join(","),
    });

    data.push({
      label: "饮食习惯",
      value: dietaryHabits.join(","),
    });

    data.push({
      label: "睡眠质量",
      value: sleepQuality.join(","),
    });

    data.push({ label: "睡眠时间", value: sleepHours + "小时" });

    // TODO: 实现表单提交逻辑
    console.log("Form submitted:", data);
    try {
      const res = await userApi.createRecord({
        name,
        phoneNumber,
        idCard: idNumber,
        forms: data,
      });
      addToast({
        title: "建档成功",
        description: "建档成功",
        color: "success",
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb items={[{ path: "/users", text: "返回用户列表" }]} />

      <Form onSubmit={handleSubmit} className="space-y-8 mt-4">
        {/* 基本信息部分 */}
        <Card className="p-6" fullWidth>
          <h2 className="text-xl font-semibold mb-4">基本信息</h2>
          <div className="flex flex-col gap-4">
            <div className="mb-4 ">
              <DatePicker
                labelPlacement="outside"
                className="max-w-sm"
                label={"建档日期"}
                value={createDate}
                onChange={(e) => setCreateDate(e as any)}
                errorMessage="请选择建档日期"
              />
            </div>
            <div className="mb-4 ">
              <Input
                label="姓名"
                labelPlacement="outside"
                variant="bordered"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入姓名"
                isRequired
                errorMessage="请输入姓名"
              />
            </div>

            <div className="mb-4 ">
              <Input
                label="手机号"
                labelPlacement="outside"
                variant="bordered"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="请输入手机号"
                isRequired
                errorMessage="请输入手机号"
              />
            </div>

            <div className="mb-4 w-[300px]">
              <RadioGroup
                label="性别"
                orientation="horizontal"
                isRequired
                value={gender}
                onValueChange={(value) => setGender(value)}
                classNames={{
                  wrapper: "grid grid-cols-2 gap-4",
                }}
                errorMessage="请选择性别"
              >
                {radioOptions.gender.map((option) => (
                  <Radio
                    className="border border-gray-300 rounded-md py-1 px-2 m-0  !max-w-full text-sm"
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </Radio>
                ))}
              </RadioGroup>
            </div>

            <div className="mb-4 ">
              <Input
                label="国籍/籍贯"
                labelPlacement="outside"
                variant="bordered"
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="请输入国籍"
                isRequired
                errorMessage="请输入国籍"
              />
            </div>

            <div className="mb-4 ">
              <DatePicker
                labelPlacement="outside"
                className="max-w-sm"
                label={"出生日期"}
                value={birthDate}
                onChange={(e) => handleDateTimeChange(e)}
                errorMessage="请选择出生日期"
              />
            </div>

            <div className="mb-4">
              <Select
                label="职业"
                labelPlacement="outside"
                placeholder="请选择职业"
                selectedKeys={[occupation]}
                onChange={(e) => setOccupation(e.target.value)}
                variant="bordered"
                isRequired
                errorMessage="请选择职业"
              >
                {selectOptions.occupation.map((option) => (
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
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="请输入家庭地址"
                errorMessage="请输入家庭地址"
              />
            </div>

            <div className="mb-4">
              <Input
                label="身份证号/护照号"
                labelPlacement="outside"
                variant="bordered"
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="请输入身份证号/护照号"
                isRequired
                errorMessage="请输入身份证号/护照号"
              />
            </div>

            <div className="mb-4">
              <Input
                label="紧急联系人/关系"
                labelPlacement="outside"
                variant="bordered"
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="请输入紧急联系人姓名及关系"
                isRequired
                errorMessage="请输入紧急联系人姓名及关系"
              />
            </div>

            <div className="mb-4">
              <Input
                label="紧急联系人电话"
                labelPlacement="outside"
                variant="bordered"
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="请输入紧急联系人电话"
                isRequired
                errorMessage="请输入紧急联系人电话"
              />
            </div>

            <div className="mb-4">
              <RadioGroup
                label="婚姻状况"
                orientation="horizontal"
                isRequired
                value={maritalStatus}
                onValueChange={(value) => setMaritalStatus(value)}
                classNames={{
                  wrapper: "grid grid-cols-3 gap-4",
                }}
                errorMessage="请选择婚姻状况"
              >
                {radioOptions.maritalStatus.map((option) => (
                  <Radio
                    className="border border-gray-300 rounded-md py-1 px-2 m-0  !max-w-full text-sm"
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </Radio>
                ))}
              </RadioGroup>
            </div>

            <div className="mb-4">
              <CheckboxGroup
                label="医疗保险类型"
                orientation="horizontal"
                value={insuranceTypes}
                onValueChange={(values) => setInsuranceTypes(values)}
                isRequired
                classNames={{
                  wrapper: "grid grid-cols-3 gap-4",
                }}
                errorMessage="请选择医疗保险类型"
              >
                {checkboxOptions.insurance.map((option) => (
                  <Checkbox
                    className="border border-gray-300 rounded-md py-1 px-2 m-0  !max-w-full text-sm"
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </div>
          </div>
        </Card>

        {/* 健康信息部分 */}
        <Card className="p-6" fullWidth>
          <h2 className="text-xl font-semibold mb-4">健康信息</h2>
          <div className="flex flex-col gap-4">
            <div className="mb-4">
              <Input
                label="身高 (厘米)"
                labelPlacement="outside"
                variant="bordered"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="请输入身高"
                errorMessage="请输入身高"
              />
            </div>

            <div className="mb-4">
              <Input
                label="体重 (公斤)"
                labelPlacement="outside"
                variant="bordered"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="请输入体重"
                errorMessage="请输入体重"
              />
            </div>

            <div className="mb-4">
              <Input
                label="腰围 (厘米)"
                labelPlacement="outside"
                variant="bordered"
                type="number"
                value={waistline}
                onChange={(e) => setWaistline(e.target.value)}
                placeholder="请输入腰围"
                errorMessage="请输入腰围"
              />
            </div>

            <div className="mb-4">
              <Select
                label="血型"
                labelPlacement="outside"
                placeholder="选择血型"
                selectedKeys={[bloodType]}
                onChange={(e) => setBloodType(e.target.value)}
                variant="bordered"
                errorMessage="请选择血型"
              >
                {selectOptions.bloodType.map((option) => (
                  <SelectItem key={option.value}>{option.label}</SelectItem>
                ))}
              </Select>
            </div>

            <div className="mb-4">
              <Select
                label="Rh血型"
                labelPlacement="outside"
                placeholder="选择Rh血型"
                selectedKeys={[rhType]}
                onChange={(e) => setRhType(e.target.value)}
                variant="bordered"
                errorMessage="请选择Rh血型"
              >
                {selectOptions.rhType.map((option) => (
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
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
                placeholder="请输入脉搏"
                errorMessage="请输入脉搏"
              />
            </div>

            <div className="mb-4">
              <RadioGroup
                label="用药情况"
                orientation="horizontal"
                value={medication}
                onValueChange={(value) => setMedication(value)}
                errorMessage="请选择用药情况"
              >
                {radioOptions.medication.map((option) => (
                  <Radio key={option.value} value={option.value}>
                    {option.label}
                  </Radio>
                ))}
              </RadioGroup>
              {medication === "有" && (
                <Textarea
                  className="w-full mt-2"
                  value={medicationDetail}
                  onChange={(e) => setMedicationDetail(e.target.value)}
                  placeholder="请描述您的用药情况(药物名称；剂量；复用频率)"
                  variant="bordered"
                  errorMessage="请描述您的用药情况(药物名称；剂量；复用频率)"
                />
              )}
            </div>
          </div>
        </Card>

        {/* 过敏史部分 */}
        <Card className="p-6" fullWidth>
          <h2 className="text-xl font-semibold mb-4">药物或食物过敏史</h2>
          <div className="mb-4">
            <CheckboxGroup
              label="过敏史"
              orientation="horizontal"
              value={allergies}
              onValueChange={(values) =>
                setAllergies(handleSelectVauleNo(values, "无"))
              }
              isRequired
              classNames={{
                wrapper: "grid grid-cols-2 md:grid-cols-3 gap-2",
              }}
              errorMessage="请选择过敏史"
            >
              {checkboxOptions.allergies.map((option) => (
                <Checkbox
                  className="border border-gray-300 rounded-md py-1 px-2 m-0  !max-w-full text-sm"
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>
        </Card>

        {/* 病史部分 */}
        <Card className="p-6" fullWidth>
          <h2 className="text-xl font-semibold mb-4">病史</h2>
          <div className="mb-4">
            <CheckboxGroup
              label="既往史"
              orientation="horizontal"
              value={medicalHistory}
              onValueChange={(values) =>
                setMedicalHistory(handleSelectVauleNo(values, "无"))
              }
              isRequired
              classNames={{
                wrapper: "grid grid-cols-3 gap-4",
              }}
              errorMessage="请选择既往史"
            >
              {checkboxOptions.medicalHistory.map((option) => (
                <Checkbox
                  className="border border-gray-300 rounded-md py-1 px-2 m-0  !max-w-full text-sm"
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>

          <div className="mt-4">
            <Textarea
              label="住院史"
              labelPlacement="outside"
              variant="bordered"
              value={hospitalizationHistory}
              onChange={(e) => setHospitalizationHistory(e.target.value)}
              placeholder="无"
              isRequired
              errorMessage="请输入住院史"
            />
          </div>
        </Card>

        {/* 生活习惯部分 */}
        <Card className="p-6" fullWidth>
          <h2 className="text-xl font-semibold mb-4">生活习惯</h2>
          <div className="mb-4">
            <CheckboxGroup
              label="吸烟饮酒史"
              orientation="horizontal"
              value={smokingHistory}
              onValueChange={(values) =>
                setSmokingHistory(handleSelectVauleNo(values, "无"))
              }
              classNames={{
                wrapper: "grid grid-cols-3 gap-4",
              }}
              isRequired
              errorMessage="请选择吸烟饮酒史"
            >
              {checkboxOptions.smokingHistory.map((option) => (
                <Checkbox
                  className="border border-gray-300 rounded-md py-1 px-2 m-0  !max-w-full text-sm"
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>

          <div className="mt-4">
            <CheckboxGroup
              label="运动习惯"
              orientation="horizontal"
              value={exerciseHabits}
              onValueChange={(values) =>
                setExerciseHabits(handleSelectVauleNo(values, "基本不运动"))
              }
              isRequired
              classNames={{
                wrapper: "grid grid-cols-3 gap-4",
              }}
              errorMessage="请选择运动习惯"
            >
              {checkboxOptions.exerciseHabits.map((option) => (
                <Checkbox
                  className="border border-gray-300 rounded-md py-1 px-2 m-0  !max-w-full"
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>

          <div className="mt-4">
            <CheckboxGroup
              label="饮食习惯"
              orientation="horizontal"
              value={dietaryHabits}
              onValueChange={(values) => setDietaryHabits(values)}
              isRequired
              classNames={{
                wrapper: "grid grid-cols-3 gap-4",
              }}
              errorMessage="请选择饮食习惯"
            >
              {checkboxOptions.dietaryHabits.map((option) => (
                <Checkbox
                  className="border border-gray-300 rounded-md py-1 px-2 m-0  !max-w-full text-sm"
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>
        </Card>

        {/* 睡眠质量部分 */}
        <Card className="p-6" fullWidth>
          <h2 className="text-xl font-semibold mb-4">睡眠质量</h2>
          <div className="mb-4">
            <CheckboxGroup
              label="睡眠质量"
              orientation="horizontal"
              value={sleepQuality}
              onValueChange={(values) => {
                setSleepQuality(handleSelectVauleNo(values, "好"));
              }}
              isRequired
              classNames={{
                wrapper: "grid grid-cols-3 gap-4",
              }}
              errorMessage="请选择睡眠质量"
            >
              {checkboxOptions.sleepQuality.map((option) => (
                <Checkbox
                  className="border border-gray-300 rounded-md py-1 px-2 m-0  !max-w-full text-sm"
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>

          <div className="mt-4">
            <Input
              label="睡眠时间"
              labelPlacement="outside"
              variant="bordered"
              type="number"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              placeholder="请输入平均每晚睡眠时间（小时）"
              isRequired
              errorMessage="请输入平均每晚睡眠时间（小时）"
            />
          </div>
        </Card>

        <div className="flex justify-end gap-4 w-full">
          <Button type="reset" variant="bordered" className="px-8 py-2">
            重置
          </Button>
          <Button type="submit" color="primary" className="px-8 py-2">
            提交
          </Button>
        </div>
      </Form>
    </DefaultLayout>
  );
}
