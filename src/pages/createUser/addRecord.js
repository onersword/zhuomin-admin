const { request } = require('../../utils/request')
Page({
  data: {
    phoneNumber: '',
    recordDate: '2025-04-25',
    name: '',
    genderOptions: [{ value: '男', checked: false }, { value: '女', checked: false }],
    gender: '',
    nationality: '中国',
    birthDate: '',
    occupations: ['医生', '教师', '工程师', '公务员', '销售', '学生', '自由职业', '其他'],
    occupationIndex: -1,
    phone: '',
    address: '',
    idNumber: '',
    emergencyContact: '',
    emergencyPhone: '',
    maritalStatus: '',
    maritalStatusOptions: [{ value: '已婚', checked: false }, { value: '未婚', checked: false }, { value: '离异或丧偶', checked: false }],
    // 医疗保险类型
    insuranceTypes: ['医保'],
    insuranceOptions: [{
      value: '医保', checked: false
    }, {
      value: '自费', checked: false
    }, {
      value: '商保', checked: false
    }, {
      value: '其他', checked: false
    }],
    // 健康信息
    height: '',
    weight: '',
    waistline: '',
    bloodTypes: ['A型', 'B型', 'AB型', 'O型'],
    bloodTypeIndex: -1,
    rhTypes: ['Rh阳性', 'Rh阴性'],
    rhTypeIndex: -1,
    pulse: '',
    medication: '无',
    medicationOptions: [{ value: '无', checked: false }, { value: '有', checked: false }],
    medicationDetail: '',
    // 过敏史
    allergyOptions: [{
      value: '无', checked: false
    },
    {
      value: '头孢菌素', checked: false
    },
    {
      value: '海鲜', checked: false
    },
    {
      value: '坚果', checked: false
    },
    {
      value: '青霉素', checked: false
    },
    {
      value: '磺胺类药物', checked: false
    },
    {
      value: '花粉', checked: false
    },
    {
      value: '牛奶', checked: false
    },
    {
      value: '其他', checked: false
    }
    ],
    // 既往史
    medicalHistoryOptions: [
      { value: '无', checked: false },
      { value: '糖尿病', checked: false },
      { value: '高血压', checked: false },
      { value: '高血脂', checked: false },
      { value: '高尿酸', checked: false },
      { value: '冠心病', checked: false },
      { value: '脑卒中', checked: false },
      { value: '恶性肿瘤', checked: false },
      { value: '慢性阻塞性肺疾病', checked: false },
      { value: '乙肝', checked: false },
      { value: '心律失常', checked: false },
      { value: '甲状腺疾病', checked: false },
      { value: '肾脏疾病', checked: false },
      { value: '胃肠道疾病', checked: false },
      { value: '精神疾病', checked: false },
      { value: '过敏史', checked: false },
      { value: '脂肪肝', checked: false },
      { value: '胆结石', checked: false },
      { value: '肝脾肿', checked: false },
      { value: '其他', checked: false }
    ],
    // 住院史
    hospitalizationHistory: '',
    // 生活习惯
    smokingOptions: [
      { value: '无', checked: false },
      { value: '长期吸烟', checked: false },
      { value: '长期饮酒', checked: false },
      { value: '戒烟戒酒史', checked: false }
    ],

    // 运动习惯
    exerciseOptions: [
      { value: '基本不运动', checked: false },
      { value: '每日步行', checked: false },
      { value: '长跑', checked: false },
      { value: '游泳', checked: false },
      { value: '登山', checked: false },
      { value: '其他', checked: false }
    ],

    // 饮食习惯
    dietaryOptions: [
      { value: '三餐规律', checked: false },
      { value: '清淡', checked: false },
      { value: '偏咸', checked: false },
      { value: '辛辣', checked: false },
      { value: '喜甜食', checked: false },
      { value: '口味偏重', checked: false },
      { value: '应酬多', checked: false },
      { value: '三餐不规律', checked: false },
      { value: '其他', checked: false }
    ],

    // 睡眠质量
    sleepQualityOptions: [
      { value: '好', checked: false },
      { value: '有失眠', checked: false },
      { value: '有鼾症', checked: false }
    ],

    // 睡眠时间
    sleepHours: '7',
  },

  onLoad: function (options) {
    // 页面加载时的初始化
    this.getRecordInfo()
  },

  getRecordInfo: async function () {
    const data = await request({
      path: '/api/records',
      method: 'GET'
    })
    console.log('获取健康档案信息:', data)
    if (data.userInfo.phoneNumber) {
      this.setData({
        phoneNumber: data.userInfo.phoneNumber
      })
    }
  },

  // 日期选择器变化事件
  onDateChange: function (e) {
    this.setData({
      recordDate: e.detail.value
    });
  },

  // 姓名输入事件
  onNameInput: function (e) {
    this.setData({
      name: e.detail.value
    });
  },

  // 性别选择事件
  onGenderSelect: function (e) {
    const items = this.data.genderOptions
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }

    this.setData({
      genderOptions: items
    })
  },

  // 国籍/籍贯输入事件
  onNationalityInput: function (e) {
    this.setData({
      nationality: e.detail.value
    });
  },

  // 出生日期选择事件
  onBirthDateChange: function (e) {
    this.setData({
      birthDate: e.detail.value
    });
  },

  // 职业选择事件
  onOccupationChange: function (e) {
    this.setData({
      occupationIndex: e.detail.value
    });
  },

  // 手机号码输入事件
  onPhoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },

  // 地址输入事件
  onAddressInput: function (e) {
    this.setData({
      address: e.detail.value
    });
  },

  // 获取位置信息
  getLocation: function () {
    const that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              that.chooseLocation();
            },
            fail() {
              wx.showToast({
                title: '请授权位置信息',
                icon: 'none'
              });
            }
          });
        } else {
          that.chooseLocation();
        }
      }
    });
  },

  chooseLocation: function () {
    const that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          address: res.address
        });
      },
      fail: function () {
        wx.showToast({
          title: '获取位置失败',
          icon: 'none'
        });
      }
    });
  },

  // 身份证号/护照号输入事件
  onIdNumberInput: function (e) {
    this.setData({
      idNumber: e.detail.value
    });
  },

  // 紧急联系人输入事件
  onEmergencyContactInput: function (e) {
    this.setData({
      emergencyContact: e.detail.value
    });
  },

  // 紧急联系人电话输入事件
  onEmergencyPhoneInput: function (e) {
    this.setData({
      emergencyPhone: e.detail.value
    });
  },

  // 婚姻状况选择事件
  onMaritalStatusSelect: function (e) {
    const items = this.data.maritalStatusOptions
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }

    this.setData({
      maritalStatusOptions: items
    })
  },

  // 保险类型选择事件
  onInsuranceTypeSelect: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)

    const items = this.data.insuranceOptions
    const values = e.detail.value
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value === values[j]) {
          items[i].checked = true
          break
        }
      }
    }

    this.setData({
      insuranceOptions: items
    })
  },

  // 身高输入事件
  onHeightInput: function (e) {
    this.setData({
      height: e.detail.value
    });
  },

  // 体重输入事件
  onWeightInput: function (e) {
    this.setData({
      weight: e.detail.value
    });
  },

  // 腰围输入事件
  onWaistlineInput: function (e) {
    this.setData({
      waistline: e.detail.value
    });
  },

  // 血型选择事件
  onBloodTypeChange: function (e) {
    this.setData({
      bloodTypeIndex: e.detail.value
    });
  },

  // Rh血型选择事件
  onRhTypeChange: function (e) {
    this.setData({
      rhTypeIndex: e.detail.value
    });
  },

  // 脉搏输入事件
  onPulseInput: function (e) {
    this.setData({
      pulse: e.detail.value
    });
  },

  // 用药情况选择事件
  onMedicationSelect: function (e) {
    const status = e.detail.value;

    const items = this.data.medicationOptions
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }

    console.log('用药情况选择事件，携带value值为：', e.detail.value, items)
    this.setData({
      medicationOptions: items
    })

    if (status === '无') {
      this.setData({
        medicationDetail: ''
      });
    }
  },

  // 用药情况详情输入事件
  onMedicationDetailInput: function (e) {
    this.setData({
      medicationDetail: e.detail.value
    });
  },

  // 过敏史选择事件
  onAllergySelect: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)



    const items = this.data.allergyOptions
    const values = e.detail.value
    const noIndex = e.detail.value.indexOf('无')
    // 只要选择了无，就取消其他选中
    if (noIndex === e.detail.value.length - 1) {

      this.setData({
        allergyOptions: items.map(item => {
          if (item.value === '无') {
            item.checked = true;
            return item;
          }
          item.checked = false;
          return item;
        })
      })
      return;
    }

      // 无是第一个，需要去掉
    if (noIndex !== -1 && noIndex < values.length - 1) {
      values.splice(noIndex, 1);
    }

    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value === '无') {
        items[i].checked = false;
      }
      items[i].checked = false

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value === values[j]) {
          items[i].checked = true
          break
        }
      }
    }


    this.setData({
      allergyOptions: items
    })
  },

  // 既往史选择事件
  onMedicalHistorySelect: function (e) {


    const noLabel = '无';
    const items = this.data.medicalHistoryOptions
    const values = e.detail.value
    const noIndex = e.detail.value.indexOf(noLabel)
    // 只要选择了无，就取消其他选中
    if (noIndex === e.detail.value.length - 1) {

      this.setData({
        medicalHistoryOptions: items.map(item => {
          if (item.value === noLabel) {
            item.checked = true;
            return item;
          }
          item.checked = false;
          return item;
        })
      })
      return;
    }

      // 无是第一个，需要去掉
    if (noIndex !== -1 && noIndex < values.length - 1) {
      values.splice(noIndex, 1);
    }

    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value === noLabel) {
        items[i].checked = false;
      }
      items[i].checked = false

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value === values[j]) {
          items[i].checked = true
          break
        }
      }
    }


    this.setData({
      medicalHistoryOptions: items
    })
  },

  // 住院史输入事件
  onHospitalizationHistoryInput: function (e) {
    this.setData({
      hospitalizationHistory: e.detail.value
    });
  },

  // 吸烟饮酒史选择事件
  onSmokingHistorySelect: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)

    const items = this.data.smokingOptions
    const values = e.detail.value
    const noIndex = e.detail.value.indexOf('无')
    // 只要选择了无，就取消其他选中
    if (noIndex === e.detail.value.length - 1) {

      this.setData({
        smokingOptions: this.data.smokingOptions.map(item => {
          if (item.value === '无') {
            item.checked = true;
            return item;
          }
          item.checked = false;
          return item;
        })
      })
      return;
    }

      // 无是第一个，需要去掉
    if (noIndex !== -1 && noIndex < values.length - 1) {
      values.splice(noIndex, 1);
    }

    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value === '无') {
        items[i].checked = false;
      }
      items[i].checked = false

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value === values[j]) {
          items[i].checked = true
          break
        }
      }
    }


    this.setData({
      smokingOptions: items
    })
  },

  // 运动习惯选择事件
  onExerciseHabitSelect: function (e) {

    const noLabel = '基本不运动';
    const items = this.data.exerciseOptions
    const values = e.detail.value
    const noIndex = e.detail.value.indexOf(noLabel)
    // 只要选择了无，就取消其他选中
    if (noIndex === e.detail.value.length - 1) {

      this.setData({
        exerciseOptions: items.map(item => {
          if (item.value === noLabel) {
            item.checked = true;
            return item;
          }
          item.checked = false;
          return item;
        })
      })
      return;
    }

      // 无是第一个，需要去掉
    if (noIndex !== -1 && noIndex < values.length - 1) {
      values.splice(noIndex, 1);
    }

    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value === '无') {
        items[i].checked = false;
      }
      items[i].checked = false

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value === values[j]) {
          items[i].checked = true
          break
        }
      }
    }


    this.setData({
      exerciseOptions: items
    })
  },

  // 饮食习惯选择事件
  onDietaryHabitSelect: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)

    const items = this.data.dietaryOptions
    const values = e.detail.value

    // 处理"三餐规律"和"三餐不规律"的互斥
    if (values.includes('三餐规律') && values.includes('三餐不规律')) {
      // 如果同时选择了互斥选项，优先保留后选择的（保留在数组中靠后的选项）
      if (values.indexOf('三餐规律') < values.indexOf('三餐不规律')) {
        values.splice(values.indexOf('三餐规律'), 1)
      } else {
        values.splice(values.indexOf('三餐不规律'), 1)
      }
    }

    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value === values[j]) {
          items[i].checked = true
          break
        }
      }
    }

    this.setData({
      dietaryOptions: items
    })
  },

  // 睡眠质量选择事件
  onSleepQualitySelect: function (e) {
   
    const noLabel = '好';
    const items = this.data.sleepQualityOptions
    const values = e.detail.value
    const noIndex = e.detail.value.indexOf(noLabel)
    // 只要选择了无，就取消其他选中
    if (noIndex === e.detail.value.length - 1) {

      this.setData({
        sleepQualityOptions: items.map(item => {
          if (item.value === noLabel) {
            item.checked = true;
            return item;
          }
          item.checked = false;
          return item;
        })
      })
      return;
    }

      // 无是第一个，需要去掉
    if (noIndex !== -1 && noIndex < values.length - 1) {
      values.splice(noIndex, 1);
    }

    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value === noLabel) {
        items[i].checked = false;
      }
      items[i].checked = false

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value === values[j]) {
          items[i].checked = true
          break
        }
      }
    }


    this.setData({
      sleepQualityOptions: items
    })
  },

  // 睡眠时间输入事件
  onSleepHoursInput: function (e) {
    this.setData({
      sleepHours: e.detail.value
    });
  },

  // 表单验证并提交
  submitForm: async function () {
    // 基本信息验证
    const basicValidations = [
      { field: 'name', message: '请输入姓名' },
      {
        condition: () => {
          const checkValue = this.data.genderOptions.filter(item => item.checked);
          return !checkValue.length;
        }, message: '请选择性别'
      },
      { field: 'nationality', message: '请输入国籍/籍贯' },
      { field: 'birthDate', message: '请选择出生日期' },
      {
        condition: () => this.data.occupationIndex < 0,
        message: '请选择职业'
      },
 
      { field: 'idNumber', message: '请输入身份证号/护照号' },
      { field: 'emergencyContact', message: '请输入紧急联系人/关系' },
      { field: 'emergencyPhone', message: '请输入紧急联系人电话' },
      {
        condition: () => this.data.emergencyPhone.length !== 11,
        message: '请输入有效的紧急联系人电话'
      },
      {
        condition: () => {
          const checkValue = this.data.maritalStatusOptions.filter(item => item.checked);
          return !checkValue.length;
        }, message: '请选择婚姻状况'
      },
      {
        condition: () => {
          const checkValue = this.data.insuranceOptions.filter(item => item.checked);
          return !checkValue.length;
        }, message: '请选择医疗保险类型'
      },
    ];

    // 其他信息验证
    const otherValidations = [
      {
        condition: () => {
          const checkValue = this.data.allergyOptions.filter(item => item.checked);
          return !checkValue.length;
        },
        message: '请选择至少一项过敏史'
      },
      {
        condition: () => {
          const checkValue = this.data.medicalHistoryOptions.filter(item => item.checked);
          return !checkValue.length;
        },
        message: '请选择至少一项既往史'
      },
      {
        condition: () => {
          const checkedSmoking = this.data.smokingOptions.filter(item => item.checked);
          return checkedSmoking.length === 0;
        },
        message: '请选择至少一项吸烟饮酒史'
      },
      {
        condition: () => {
          const checkValue = this.data.exerciseOptions.filter(item => item.checked);
          return !checkValue.length;
        },
        message: '请选择至少一项运动习惯'
      },
      {
        condition: () => {
          const checkValue = this.data.dietaryOptions.filter(item => item.checked);
          return !checkValue.length;
        },
        message: '请选择至少一项饮食习惯'
      },
      {
        condition: () => {
          const checkValue = this.data.sleepQualityOptions.filter(item => item.checked);
          return !checkValue.length;
        },
        message: '请选择睡眠质量'
      },
      { field: 'sleepHours', message: '请输入睡眠时间' },
    ];

    // // 执行基本信息验证
    for (const validation of basicValidations) {
      if (validation.condition) {
        if (validation.condition()) {
          this.showError(validation.message);
          return;
        }
      } else if (!this.data[validation.field]) {
        this.showError(validation.message);
        return;
      }
    }

    // 执行其他信息验证
    for (const validation of otherValidations) {
      if (validation.condition) {
        if (validation.condition()) {
          this.showError(validation.message);
          return;
        }
      } else if (!this.data[validation.field]) {
        this.showError(validation.message);
        return;
      }
    }

    // 验证通过，组织数据
    const formData = [];

    // 基本信息
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    //基本信息
    formData.push({ label: '建档日期', value: formattedDate });
    formData.push({ label: '姓名', value: this.data.name });
    formData.push({ label: '性别', value: this.data.genderOptions.find(item => item.checked).value });
    formData.push({ label: '国籍/籍贯', value: this.data.nationality });
    formData.push({ label: '出生日期', value: this.data.birthDate });
    formData.push({
      label: '职业',
      value: this.data.occupationIndex >= 0 ? this.data.occupations[this.data.occupationIndex] : ''
    });
    formData.push({ label: '手机号码', value: this.data.phoneNumber });
    formData.push({ label: '地址', value: this.data.address });
    formData.push({ label: '身份证号/护照号', value: this.data.idNumber });
    formData.push({ label: '紧急联系人/关系', value: this.data.emergencyContact });
    formData.push({ label: '紧急联系人电话', value: this.data.emergencyPhone });
    formData.push({ label: '婚姻状况', value: this.data.maritalStatusOptions.find(item => item.checked).value });

    // 医疗保险类型
    formData.push({
      label: '医疗保险类型',
      value: this.data.insuranceOptions.filter(item => item.checked).map(item => item.value).join(',')
    });
    // 基本信息结束

    // 健康信息
    if (this.data.height) {
      formData.push({ label: '身高', value: this.data.height + 'cm' });
    }
    if (this.data.weight) {
      formData.push({ label: '体重', value: this.data.weight + 'kg' });
    }
    if (this.data.waistline) {
      formData.push({ label: '腰围', value: this.data.waistline + 'cm' });
    }
    if (this.data.bloodTypeIndex >= 0) {
      formData.push({
        label: '血型',
        value: this.data.bloodTypes[this.data.bloodTypeIndex]
      });
    }
    if (this.data.rhTypeIndex >= 0) {
      formData.push({
        label: 'Rh血型',
        value: this.data.rhTypes[this.data.rhTypeIndex]
      });
    }
    if (this.data.pulse) {
      formData.push({ label: '脉搏', value: this.data.pulse + '次/分' });
    }
    const medication = this.data.medicationOptions.find(item => item.checked);
    const medicationObj = {
      label: '用药情况',
      value: '无',
    }
    if (medication.value === '有') {
      medicationObj.value = this.data.medicationDetail || '无';
    }
    formData.push(medicationObj);
    // 过敏史
    formData.push({
      label: '过敏史',
      value: this.data.allergyOptions.filter(item => item.checked).map(item => item.value).join(',')
    });

    // 既往史
    formData.push({
      label: '既往史',
      value: this.data.medicalHistoryOptions.filter(item => item.checked).map(item => item.value).join(',')
    });

    formData.push({ label: '住院史', value: this.data.hospitalizationHistory || '无' });

    // 生活习惯
    formData.push({
      label: '吸烟饮酒史',
      value: this.data.smokingOptions.filter(item => item.checked).map(item => item.value).join(',')
    });

    formData.push({
      label: '运动习惯',
      value: this.data.exerciseOptions.filter(item => item.checked).map(item => item.value).join(',')
    });

    formData.push({
      label: '饮食习惯',
      value: this.data.dietaryOptions.filter(item => item.checked).map(item => item.value).join(',')
    });

    formData.push({
      label: '睡眠质量',
      value: this.data.sleepQualityOptions.filter(item => item.checked).map(item => item.value).join(',')
    });

    formData.push({ label: '睡眠时间', value: this.data.sleepHours + '小时' });

    console.log('提交的表单数据:', formData);

    // 提交数据
    wx.showLoading({
      title: '保存中',
    });

    const data = await request({
      path: '/api/records',
      method: 'POST',
      data: {
        forms: formData,
        name: this.data.name,
        phoneNumber: this.data.phoneNumber,
        idCard: this.data.idNumber,
      }
    })
    console.log('提交数据返回结果:', data)

    if (data.status === 200) {
      wx.hideLoading();
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);
        }
      });
    } else {
      wx.hideLoading();
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
    // // 这里添加实际的数据提交逻辑
    // setTimeout(() => {
    //   wx.hideLoading();
    //   wx.showToast({
    //     title: '保存成功',
    //     icon: 'success',
    //     duration: 2000,
    //     success: () => {
    //       // 返回上一页或跳转到其他页面
    //       setTimeout(() => {
    //         wx.navigateBack();
    //       }, 2000);
    //     }
    //   });
    // }, 1500);
  },

  showError: function (message) {
    wx.showToast({
      title: message,
      icon: 'none'
    });
  }
})  