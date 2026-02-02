
import React from 'react';
import { Copy, Check, Download, FileText, Code } from 'lucide-react';

interface MarkdownPreviewProps {
  content: string;
  fileName: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, fileName }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    a.href = url;
    a.download = `${baseName}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden flex flex-col h-[750px] animate-in fade-in duration-500">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Code className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <span className="font-bold text-slate-800 block leading-none">Markdown 源码预览</span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase mt-1">已成功识别并提取内容</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-all active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            {copied ? '已复制' : '复制内容'}
          </button>
          
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-200 active:scale-95"
          >
            <Download className="w-4 h-4" />
            保存为 .md 文件
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-slate-50">
        <div className="prose prose-slate max-w-none">
          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed p-6 bg-slate-900 rounded-2xl text-slate-200 shadow-inner">
            {content}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default MarkdownPreview;
