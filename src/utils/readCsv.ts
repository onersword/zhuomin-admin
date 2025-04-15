import iconv from 'iconv-lite';
import Papa from 'papaparse';
import { Buffer } from 'buffer';

const excludeFileds = [
  'IP', 'Referrer', 'UA', '答题时长',
  '地理位置国家和地区', '地理位置市', '地理位置省', '家庭地址(经度，纬度)',
  '昵称',
  '开始答题时间', '清洗数据结果', '用户标识', '用户类型','结束答题时间', '编号', '自定义字段',
]

// Common encodings to try
const ENCODINGS = ['utf-8', 'gbk', 'gb2312', 'big5', 'utf-16le', 'utf-16be'];

/**
 * Try to detect the encoding of a buffer
 * @param buffer The buffer to detect encoding from
 * @returns The detected encoding or null if no encoding matches
 */
function detectEncoding(buffer: ArrayBuffer): string | null {
  const uint8Array = new Uint8Array(buffer);
  
  // Check for BOM (Byte Order Mark)
  if (uint8Array[0] === 0xEF && uint8Array[1] === 0xBB && uint8Array[2] === 0xBF) {
    return 'utf-8';
  }
  if (uint8Array[0] === 0xFF && uint8Array[1] === 0xFE) {
    return 'utf-16le';
  }
  if (uint8Array[0] === 0xFE && uint8Array[1] === 0xFF) {
    return 'utf-16be';
  }

  // Try each encoding
  for (const encoding of ENCODINGS) {
    try {
      const decoded = iconv.decode(uint8Array as Buffer, encoding);
      // Check if the decoded text contains valid characters
      if (decoded.length > 0 && !decoded.includes('')) {
        return encoding;
      }
    } catch (e) {
      continue;
    }
  }

  return null;
}

/**
 * Parse CSV file content into an array of objects
 * @param file The CSV file to parse
 * @returns Promise that resolves to an array of objects
 */
export const readCsv = async (file: File): Promise<Record<string, string>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const buffer = event.target!.result as ArrayBuffer;
        const detectedEncoding = detectEncoding(buffer);
        
        if (!detectedEncoding) {
          throw new Error('无法检测文件编码');
        }

        console.log('检测到的编码:', detectedEncoding);
        const decodedText = iconv.decode(new Uint8Array(buffer) as Buffer, detectedEncoding);

        Papa.parse(decodedText, {
          header: false, // 不直接使用表头，因为有重复字段
          skipEmptyLines: true,
          complete: function (results) {
            const headers = results.data[0] as string[]; // 第一行是表头
            const rows = results.data.slice(1); // 剩余行是数据
            const processedData = processHeadersAndData(headers, rows);

            console.log('解析结果:', processedData);
            const cleanedData = cleanData(processedData);
            console.log('清洗结果:', cleanedData);
            resolve(cleanedData as any);
          },
          error: function (error: any) {
            console.error('解析出错:', error);
            reject(error);
          },
        });
      } catch (error) {
        console.error('处理文件时出错:', error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    // Read as ArrayBuffer to handle binary data
    reader.readAsArrayBuffer(file);
  });
};


// 处理重复表头并分组数据
function processHeadersAndData(headers: string[], rows: any[]) {
  const processedData: Record<string, any>[] = [];

  rows.forEach(row => {
    const result: Record<string, any> = {};

    headers.forEach((header, index) => {
      const value = row[header] || row[index]; // 兼容不同的解析方式
      if (!header) return; // 跳过空表头

      // 提取问题编号和字段名
      const match = header.match(/^(\d+\.\s*[^\:]+)(?::(.+))?$/);
      if (match) {
        const question = match[1].trim(); // 如 "10.医疗保险"
        const subField = match[2] ? match[2].trim() : ''; // 如 "医保"

        if (!result[question]) {
          result[question] = {};
        }

        if (subField) {
          // 处理填空题和其他选项
          if (subField.includes('____{fillblank')) {
            const fillblankMatch = subField.match(/____\{fillblank-[a-z0-9]+\}(?:\[(.*)\])?/);
            const key = fillblankMatch ? '填空' : subField;
            result[question][key] = value;
          } else {
            result[question][subField] = value;
          }
        } else {
          result[question] = value; // 简单字段直接赋值
        }
      } else {
        // 非问题字段（如 "编号"、"开始答题时间"）
        result[header] = value;
      }
    });

    processedData.push(result);
  });

  return processedData;
}

function cleanData(data: Record<string, any>[]) {
  return data.map(item => {
    const userInfo = {
      name: '',
      phoneNumber: '',
      idCard: '',
      forms: {}
    }
    userInfo.forms = Object.keys(item).reduce((acc, key) => {
      const title = key.trim();
      let cleanTitle = '';
      const match = title.match(/^(\d+)\.(.*)$/);
      if (match) {
        const index = match[1];
        const field = match[2];
        cleanTitle = field;
      } else {
        cleanTitle = title;
      }
      const value = item[key];
      let cleanValue = '';
      if (typeof value === 'object' && value !== null) {
        for (const [k, v] of Object.entries(value)) {
          if (v) {
            cleanValue = v as string;
            break;
          }
        }
      } else {
        cleanValue = value;
      }
      const match2 = cleanValue.match(/^[A-Z]\.\s*(.+)$/);
      cleanValue = match2 ? match2[1].trim() : cleanValue;
      cleanValue = cleanValue
        .replace(/\t/g, '') // 移除制表符
        .replace(/\n/g, '') // 移除换行符
        .replace(/\r/g, '') // 移除回车符
        .trim(); // 移除首尾空格
      if (cleanTitle === '姓名') {
        userInfo.name = cleanValue;
      }
      if (cleanTitle === '电话') {
        userInfo.phoneNumber = cleanValue;
      }
      if (cleanTitle === '身份证号/护照号') {
        userInfo.idCard = cleanValue;
      }
      if (cleanTitle === '健康档案') {
        userInfo.forms = cleanValue;
      }
      if (excludeFileds.includes(cleanTitle)) {
        return acc;
      }
      acc[cleanTitle] = cleanValue;
      return acc;
    }, {} as Record<string, any>);
    return userInfo;
  });
}