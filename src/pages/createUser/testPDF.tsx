import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, PDFDownloadLink, Font } from '@react-pdf/renderer';
import { Button, addToast } from '@heroui/react';


// Register fallback font
Font.register({
  family: 'Noto Sans SC',
  src: '/fonts/NotoSansSC-Regular.ttf',
});

// PDF styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 30,
    fontFamily: 'Noto Sans SC',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Noto Sans SC',
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
    fontFamily: 'Noto Sans SC',
  },
});

// PDF Document component
const MyDocument = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>测试 PDF 文档</Text>
        <Text style={styles.text}>生成时间: {new Date().toLocaleString()}</Text>
        <Text style={styles.text}>用户信息:</Text>
        <Text style={styles.text}>姓名: {data.name}</Text>
        <Text style={styles.text}>邮箱: {data.email}</Text>
      </View>
    </Page>
  </Document>
);

export default function TestPDF() {
  const [pdfData, setPdfData] = useState({
    name: '测试用户',
    email: 'test@example.com',
  });

  const handleUpload = async () => {
    try {
      // 这里需要替换为实际的 API 调用
      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pdfData),
      });

      if (response.ok) {
        addToast({
          title: '成功',
          description: 'PDF 上传成功',
          color: 'success',
        });
      } else {
        addToast({
          title: '错误',
          description: 'PDF 上传失败',
          color: 'danger',
        });
      }
    } catch (error) {
      addToast({
        title: '错误',
        description: '上传过程中发生错误',
        color: 'danger',
      });
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">PDF 生成与预览</h1>
      
      <div className="mb-4">
        <PDFViewer width="100%" height="500px">
          <MyDocument data={pdfData} />
        </PDFViewer>
      </div>

      <div className="flex gap-4">
        <PDFDownloadLink
          document={<MyDocument data={pdfData} />}
          fileName="test-document.pdf"
        >
          {({ blob, url, loading, error }) =>
            loading ? (
              <Button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                准备下载...
              </Button>
            ) : (
              <Button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                下载 PDF
              </Button>
            )
          }
        </PDFDownloadLink>

        <Button 
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={handleUpload}
        >
          上传 PDF
        </Button>
      </div>
    </div>
  );
}