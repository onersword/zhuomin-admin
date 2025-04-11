import iconv from 'iconv-lite';
import Papa from 'papaparse';
import { Buffer } from 'buffer';


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
        const decodedText = iconv.decode(new Uint8Array(buffer) as Buffer, 'gbk');

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
            resolve(cleanedData);
          },
          error: function (error: any) {
            console.error('解析出错:', error);
            reject(error);
          },
        });
      } catch (error) {
        console.error('处理文件时出错:', error);
      }
      // try {
      //   const arrayBuffer = event.target?.result as ArrayBuffer;
      //   console.log('arrayBuffer', arrayBuffer);
      //   // Try different encodings
      //   // const encodings = ['utf-8', 'gbk', 'gb2312', 'big5'];
      //   const decoder = new TextDecoder('gbk'); // 确保浏览器支持 GBK
      //   const decodedText = decoder.decode(new Uint8Array(arrayBuffer));
      //   // 使用 Papa Parse 解析 CSV
      //   Papa.parse(decodedText, {
      //     header: true, // 第一行作为表头
      //     skipEmptyLines: true, // 跳过空行
      //     complete: function(results: any) {
      //         console.log('解析结果:', results.data);
      //     },
      //     error: function(error: any) {
      //         console.error('解析出错:', error);
      //     }
      // });
      // let content = '';
      // try {
      //   const decoder = new TextDecoder('gbk', { fatal: false });
      //   content = decoder.decode(arrayBuffer);
      //   console.log('csv content', content);
      //   // If we can decode without error, break the loop
      //   // break;
      // } catch (e) {
      //   // Try next encoding
      //   console.log('error', e);
      //   throw e;
      // }

      // // Remove BOM if present
      // content = content.replace(/^\uFEFF/, '');

      // const lines = content.split('\n');
      // console.log('lines', lines);

      // // Get headers from first line
      // const headers = lines[0].split(',').map(header => header.trim());
      // console.log('headers', headers);
      // // Parse data rows
      // const data = lines.slice(1)
      //   .filter(line => line.trim()) // Remove empty lines
      //   .map(line => {
      //     // Handle quoted values
      //     const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      //     const row: Record<string, string> = {};

      //     headers.forEach((header, index) => {
      //       let value = values[index] || '';
      //       // Remove quotes if present
      //       value = value.replace(/^"|"$/g, '');
      //       row[header] = value.trim();
      //     });

      //     return row;
      //   });

      // resolve(data);
      // } catch (error) {
      //   reject(error);
      // }
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
      acc[cleanTitle] = cleanValue;
      return acc;
    }, {} as Record<string, any>);
    return userInfo;
  });
}