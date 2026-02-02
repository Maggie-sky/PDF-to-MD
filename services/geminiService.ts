
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async convertFileToMarkdown(fileBase64: string, mimeType: string): Promise<string> {
    const model = 'gemini-3-flash-preview';
    
    // 简化的 Prompt，专注于文本转换，不再强调复杂的图片识别
    const prompt = `
      请将上传的文档（PDF 或 Word）转换为格式整洁的 Markdown 文件。
      要求：
      1. 保持文档的层级结构（标题、段落）。
      2. 保留文本格式（加粗、斜体等）。
      3. 保持列表（有序和无序）的完整性。
      4. 如果有超链接，请保留。
      5. 全文使用中文输出（除非原文档为外语）。
      6. 仅输出 Markdown 内容，不要包含任何多余的解释或确认语。
    `;

    try {
      const currentAi = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await currentAi.models.generateContent({
        model,
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: fileBase64,
                },
              },
            ],
          },
        ],
        config: {
          temperature: 0.1,
        }
      });

      if (!response.text) {
        throw new Error("无法从文档生成内容，请确保文档内容可读取。");
      }

      return response.text;
    } catch (error: any) {
      console.error("Gemini 转换错误:", error);
      if (error.message?.includes('Rpc failed')) {
        throw new Error("网络通信异常，请检查您的网络连接并重试。");
      }
      throw new Error(error.message || "文档转换失败。");
    }
  }
}

export const geminiService = new GeminiService();
