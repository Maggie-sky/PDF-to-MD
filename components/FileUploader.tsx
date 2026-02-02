
import React, { useRef, useState } from 'react';
import { Upload, ShieldAlert, FileType } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, disabled }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 定义支持的文件类型
  const supportedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (supportedTypes.includes(file.type)) {
        onFileSelect(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 flex flex-col items-center justify-center text-center
        ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
      
      <div className="bg-blue-100 p-4 rounded-full mb-4">
        <Upload className="w-8 h-8 text-blue-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-slate-800 mb-2">
        上传 PDF 或 Word 文档
      </h3>
      <p className="text-slate-500 max-w-xs mx-auto mb-2">
        将文件拖放到此处，或点击浏览。支持 PDF、DOCX、DOC 格式。
      </p>
      <div className="flex items-center gap-2 justify-center">
        <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 border border-slate-200">PDF</span>
        <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 border border-slate-200">DOCX</span>
      </div>
      
      <div className="mt-8 flex items-center gap-2 text-xs font-medium text-slate-400">
        <ShieldAlert className="w-4 h-4" />
        <span>由 Gemini AI 提供极速转换支持</span>
      </div>
    </div>
  );
};

export default FileUploader;
