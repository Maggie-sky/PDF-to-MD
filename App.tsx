
import React, { useState, useCallback } from 'react';
import { FileText, Github, Wand2, ArrowLeft, AlertCircle, HelpCircle, FileEdit } from 'lucide-react';
import FileUploader from './components/FileUploader';
import MarkdownPreview from './components/MarkdownPreview';
import Loader from './components/Loader';
import { geminiService } from './services/geminiService';
import { ConversionState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<ConversionState>({
    isProcessing: false,
    error: null,
    markdown: null,
    fileName: null
  });

  const handleFileSelect = useCallback(async (file: File) => {
    setState(prev => ({ 
      ...prev, 
      isProcessing: true, 
      error: null, 
      fileName: file.name,
      markdown: null 
    }));

    try {
      const supportedMimeTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
      ];

      if (!supportedMimeTypes.includes(file.type)) {
        throw new Error("不支持的文件格式。请上传 PDF 或 Word 文档。");
      }

      if (file.size > 20 * 1024 * 1024) {
        throw new Error("文件太大 (超过 20MB)。请尝试上传较小的文档。");
      }

      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = () => reject(new Error("读取文件失败。"));
      });
      
      reader.readAsDataURL(file);
      const base64 = await base64Promise;

      // 使用更新后的服务方法
      const markdown = await geminiService.convertFileToMarkdown(base64, file.type);
      
      setState(prev => ({
        ...prev,
        isProcessing: false,
        markdown,
        error: null
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: err.message || "转换过程中发生了错误，请刷新重试。"
      }));
    }
  }, []);

  const reset = () => {
    setState({
      isProcessing: false,
      error: null,
      markdown: null,
      fileName: null
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] selection:bg-blue-100">
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={reset}>
              <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform">
                <FileEdit className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-none">多能文档转换</h1>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1">PDF & Word 转 Markdown</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        {!state.markdown && !state.isProcessing && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-6 border border-blue-100">
                <Wand2 className="w-4 h-4" />
                新增：已支持 Word (.docx) 转换
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                文档一键转为 Markdown
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                简单快捷地将 PDF 或 Word 文档转换为纯净的 Markdown 格式。
                专注于文字与结构的准确还原。
              </p>
            </header>

            <FileUploader onFileSelect={handleFileSelect} />

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-2">广泛的格式支持</h4>
                <p className="text-sm text-slate-500 leading-relaxed">不论是 PDF 还是 Word 文档，都能轻松转换为可直接使用的 Markdown 源码。</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-2">专注于文本质量</h4>
                <p className="text-sm text-slate-500 leading-relaxed">自动识别标题、加粗、列表及段落，确保转换后的文档逻辑清晰、排版美观。</p>
              </div>
            </div>
          </div>
        )}

        {state.isProcessing && (
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <Loader message={`正在提取并转换: ${state.fileName}`} />
          </div>
        )}

        {state.error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8 flex flex-col items-center animate-in zoom-in-95">
            <div className="bg-red-100 p-4 rounded-full mb-4">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-red-900 mb-2">转换任务未完成</h3>
            <p className="text-red-700 text-center mb-8 max-w-md leading-relaxed">{state.error}</p>
            <button 
              onClick={reset}
              className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200"
            >
              <ArrowLeft className="w-4 h-4" />
              重新尝试
            </button>
          </div>
        )}

        {state.markdown && !state.isProcessing && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <button 
                onClick={reset}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                继续转换其他文件
              </button>
              <div className="px-4 py-1.5 bg-slate-100 rounded-full text-xs font-bold text-slate-500 border border-slate-200">
                源文件: <span className="text-slate-900">{state.fileName}</span>
              </div>
            </div>
            
            <MarkdownPreview content={state.markdown} fileName={state.fileName || 'document.md'} />
          </div>
        )}
      </main>

      <footer className="py-10 border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} 智能文档转换助手 • 网页版已就绪
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
