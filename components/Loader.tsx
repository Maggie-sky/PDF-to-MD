
import React from 'react';
import { Loader2, FileSearch } from 'lucide-react';

const Loader: React.FC<{ message?: string }> = ({ message = "AI 正在解析文档..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-24">
      <div className="relative mb-8">
        <div className="w-20 h-20 border-[6px] border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <FileSearch className="w-8 h-8 text-blue-600 animate-pulse" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{message}</h3>
      <div className="flex flex-col items-center gap-2">
        <p className="text-slate-500 font-medium text-center max-w-sm">
          转换引擎正在处理文本结构并导出 Markdown 代码，请稍候...
        </p>
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold border border-blue-100 mt-2">
          <Loader2 className="w-3 h-3 animate-spin" />
          正在转换，请勿关闭页面
        </span>
      </div>
    </div>
  );
};

export default Loader;
