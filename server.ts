import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Dynamic Lazy Initialization of the @google/genai SDK to prevent startup crash
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environmental variable is missing. Please add it in your AI Studio Secrets panel.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Helper to extract mimeType and raw base64 data
function parseBase64Image(dataStr: string) {
  const matches = dataStr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return null;
  }
  return {
    mimeType: matches[1],
    data: matches[2]
  };
}

// Route 1: AI copywriting expert ("文案生成")
app.post("/api/generate-copy", async (req, res) => {
  try {
    const { prompt, style, category } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "请输入您的文案需求" });
    }

    const ai = getGeminiClient();
    const systemPrompt = `你是一位融合古典文学底蕴与现代营销逻辑的文意专家。
对于用户输入的需求，请为其撰写极具文学灵气与商业感召力的中文文案。
分类标签：${category || "通用"}
目标风格风格：${style || "高雅古典"}

输出规则：
1. 词句雅致，句式有节奏韵律美。
2. 适当、巧妙地加入贴切的视觉符号或表情点缀，保持排版轻盈、留白适度。
3. 如果合适，可以提供 2 个不同备选方向以供挑选。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.82,
      }
    });

    res.json({ status: "success", text: response.text });
  } catch (err: any) {
    console.error("Copy generation failed:", err);
    res.status(500).json({ error: err?.message || "服务器墨香晕染中发生未知错误，请检查秘钥配给。" });
  }
});

// Route 2: AI translation ("信雅互译" English-Chinese expert)
app.post("/api/translate", async (req, res) => {
  try {
    const { text, from, to } = req.body;
    if (!text) {
      return res.status(400).json({ error: "请输入需要翻译的内容" });
    }

    const ai = getGeminiClient();
    const systemPrompt = `你是一位精通“信、雅、达”翻译三重境界的国风翻译家。
当前：从 [${from || "中文"}] 翻译到 [${to || "英文"}].

翻译原则：
1. 信 (Faithfulness)：信息不遗漏，精准传神。
2. 雅 (Elegance)：文字雅致，避免生硬机翻。对于中文，融入传统词藻与诗意古风韵味；对于英文，语法自然高级，蕴含东方雅致韵。
3. 达 (Expressiveness)：行文流畅，契合目标语言的文学审美。
请只输出最终翻译结果，不带任何解释。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: text,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
      }
    });

    res.json({ status: "success", text: response.text });
  } catch (err: any) {
    console.error("Translation fail:", err);
    res.status(500).json({ error: err?.message || "翻译大师目前思维堵塞，请稍后重试。" });
  }
});

// Route 3: AI Premium Portrait Generation ("动漫头像")
app.post("/api/generate-avatar", async (req, res) => {
  try {
    const { image, style } = req.body;
    const ai = getGeminiClient();

    // Map the selected custom styles
    let promptSubject = "An exquisite, high-end detailed portrait of a beautiful or handsome character.";
    let finalPrompt = "";

    if (style === "水墨漫感") {
      finalPrompt = `${promptSubject} Masterfully rendered in modern Chinese traditional ink wash painting anime style (Shanshui background). Fluid brushstrokes, shades of deep blue dailan and charcoal grey under light celadon green background yuebai, ample positive space, artistic ink bleed visual flourish.`;
    } else if (style === "清新日漫") {
      finalPrompt = `${promptSubject} Clean and high-key Japanese anime character design. Pastel colors, bright cheerful lighting, crisp line art, expressive eyes, beautifully detailed hair, modern aesthetic.`;
    } else {
      // 国风插画
      finalPrompt = `${promptSubject} Contemporary Chinese Guofeng digital illustration. Rich palette of royal red zhuhong, gold, and jade green. Elaborate traditional garments combined with modern graphic design elements. High contrast, dramatic soft studio light.`;
    }

    let resultBase64 = "";

    if (image) {
      // 1. Edit / transform uploaded portrait reference with gemini-2.5-flash-image
      const parsed = parseBase64Image(image);
      if (!parsed) {
        return res.status(400).json({ error: "图片格式解析失败" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [
            {
              inlineData: {
                data: parsed.data,
                mimeType: parsed.mimeType
              }
            },
            {
              text: `Please redraw and transform this reference photo into a portrait matching this visual style: ${finalPrompt}. Keep the pose and overall appearance of the subject intact but convert completely into the artistic drawing style.`
            }
          ]
        }
      });

      // Find the image part in response candiates parts
      const candidates = response.candidates?.[0]?.content?.parts;
      if (candidates) {
        for (const part of candidates) {
          if (part.inlineData?.data) {
            resultBase64 = part.inlineData.data;
            break;
          }
        }
      }

      if (!resultBase64) {
        // Fallback to text prompt generation if edit response did not include base64
        console.log("Edit response did not return base64 inlineData, falling back to pure generation...");
      }
    }

    if (!resultBase64) {
      // 2. Pure generation from text prompt using imagen-4.0-generate-001
      const response = await ai.models.generateImages({
        model: "imagen-4.0-generate-001",
        prompt: finalPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: "image/jpeg",
          aspectRatio: "1:1",
        }
      });

      resultBase64 = response.generatedImages[0].image.imageBytes;
    }

    res.json({
      status: "success",
      imageUrl: `data:image/jpeg;base64,${resultBase64}`
    });

  } catch (err: any) {
    console.error("Avatar generation failed:", err);
    res.status(500).json({ error: err?.message || "绘卷工坊发生错误，请稍后刷新重试。" });
  }
});

// Serve frontend client
async function start() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode with Vite server middleware
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode serving compiled static files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`墨韵智汇 Server actively listening on http://localhost:${PORT}`);
  });
}

start();
