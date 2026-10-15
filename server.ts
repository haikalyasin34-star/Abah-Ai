import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

// Helper to initialize GoogleGenAI with proper User-Agent header
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System instruction reflecting official Abah AI identity and educational principles
const ABAH_SYSTEM_INSTRUCTION = `You are Abah AI, a friendly, careful, multilingual educational assistant developed as an application by Muhammad Haikal Yasin, also known as Aaba.

Official Slogan: "Teman Pintar, Jawaban Lebih Jelas."
Tone: Warm, encouraging, respectful, clear, structured, and wise like a compassionate teacher ("Abah").
Language: Answer in the user's language by default (Bahasa Indonesia yang santun, ramah, dan mendidik, or English if asked in English).

Your purpose is to help users understand concepts and solve problems accurately. Answer the user's real question directly. For educational questions, include clear explanations, useful examples, and step-by-step solutions whenever relevant.

For simple questions, answer concisely. Do not force unnecessary sections or excessively long explanations.

For mathematics:
1. Identify the known information (Diketahui).
2. State what must be found (Ditanyakan).
3. Select the appropriate formula or method (Rumus / Cara).
4. Explain each calculation step clearly with readable math symbols (Langkah Penyelesaian).
5. Give the final answer clearly in bold (Kesimpulan / Jawaban Akhir).
6. Verify the result when practical.
7. Include a similar example or alternative method when it improves understanding (Contoh Serupa).

For science:
1. Explain the concept in intuitive terms.
2. Describe the process or mechanism step by step.
3. Provide a practical real-world example.
4. Include a structured summary when helpful.
5. Distinguish established facts from assumptions.

For programming:
1. Explain the problem and algorithmic logic.
2. Provide clean, well-commented code in the requested language.
3. Explain how to run it.
4. Include sample input and output when useful.
5. Explain common edge cases, errors, and limitations.

For language questions:
1. Provide the requested answer, correction, or translation.
2. Explain context, grammar, and nuance.
3. Include natural example sentences.

For questions submitted as images:
1. Read the visible question carefully.
2. State any uncertain or unreadable text honestly.
3. Explain the solution step by step.
4. Give the final answer clearly.
5. Never pretend to see details that are not legible.

Never fabricate sources, calculations, tool results, or visual content. If uncertain, explain the uncertainty. If essential information is missing, ask a clarifying question. Never claim that an answer is guaranteed to be correct.

When asked who developed the Abah AI application:
Answer clearly that the Abah AI application was developed by Muhammad Haikal Yasin, also known as Aaba. Distinguish the application developer from the provider or creator of the underlying AI model.`;

// List of supported and tested models in order of preference
// gemini-3-flash-preview and gemini-3.5-flash-lite are the active, highly responsive models in this environment
const MODEL_CANDIDATES = [
  'gemini-3-flash-preview',
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.8-flash',
];

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'Abah AI',
    version: '1.00.1',
    creator: 'Muhammad Haikal Yasin (Aaba)',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    primaryModel: MODEL_CANDIDATES[0],
  });
});

// Chat Endpoint with SSE streaming and automatic resilient model fallback
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, userProfile, mode, image } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Daftar pesan tidak valid atau kosong.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(500).json({
        error: 'Kunci GEMINI_API_KEY belum dikonfigurasi di server. Silakan tambahkan API key di panel Secrets.',
      });
      return;
    }

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    // Personalize system instruction with user profile if available
    let dynamicSystemPrompt = ABAH_SYSTEM_INSTRUCTION;
    if (userProfile?.name) {
      const title = userProfile.gender === 'female' ? 'Nona' : 'Tuan';
      dynamicSystemPrompt += `\n\nUser Profile: The student/user is named ${userProfile.name} (${title} ${userProfile.name}). Address them respectfully and warmly as "${title} ${userProfile.name}" when greeting or giving praise.`;
    }

    if (mode === 'math') {
      dynamicSystemPrompt += `\nSpecial Mode: MATEMATIKA & SAINS KHUSUS. Break down formulas explicitly, show every step of calculation, double check all arithmetic, and present the final answer in bold highlight.`;
    } else if (mode === 'coding') {
      dynamicSystemPrompt += `\nSpecial Mode: PEMROGRAMAN & KODING. Focus on clean code, comments, execution instructions, time/space complexity, and best practices.`;
    } else if (mode === 'quick') {
      dynamicSystemPrompt += `\nSpecial Mode: RINGKAS & CEPAT. Give direct, highly concise, no-fluff answers while maintaining clarity.`;
    }

    // Prepare contents array for Gemini
    const contents: any[] = [];
    const recentMessages = messages.slice(-10);

    for (let i = 0; i < recentMessages.length; i++) {
      const msg = recentMessages[i];
      const isLast = i === recentMessages.length - 1;
      const role = msg.role === 'user' ? 'user' : 'model';

      if (isLast && role === 'user' && image?.data && image?.mimeType) {
        contents.push({
          role: 'user',
          parts: [
            {
              inlineData: {
                data: image.data,
                mimeType: image.mimeType,
              },
            },
            {
              text: msg.content || 'Tolong analisis gambar ini dan jelaskan secara detail.',
            },
          ],
        });
      } else {
        contents.push({
          role,
          parts: [{ text: msg.content || '' }],
        });
      }
    }

    let streamSuccess = false;
    let lastError: any = null;

    // Try candidate models sequentially until one succeeds
    for (const modelName of MODEL_CANDIDATES) {
      try {
        const responseStream = await ai.models.generateContentStream({
          model: modelName,
          contents,
          config: {
            systemInstruction: dynamicSystemPrompt,
            temperature: mode === 'math' ? 0.2 : 0.7,
          },
        });

        let receivedAnyChunk = false;
        for await (const chunk of responseStream) {
          const text = chunk.text;
          if (text) {
            receivedAnyChunk = true;
            res.write(`data: ${JSON.stringify({ text })}\n\n`);
          }
        }

        if (receivedAnyChunk) {
          streamSuccess = true;
          break; // Successfully streamed!
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying next candidate. Error:`, err?.message?.slice(0, 100));
      }
    }

    // If streaming failed with all candidates, try non-streaming unary as a resilient fallback
    if (!streamSuccess) {
      console.warn('All streaming candidates failed, attempting unary generateContent fallback...');
      for (const modelName of MODEL_CANDIDATES) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction: dynamicSystemPrompt,
              temperature: mode === 'math' ? 0.2 : 0.7,
            },
          });

          if (response.text) {
            res.write(`data: ${JSON.stringify({ text: response.text })}\n\n`);
            streamSuccess = true;
            break;
          }
        } catch (unaryErr: any) {
          lastError = unaryErr;
        }
      }
    }

    if (streamSuccess) {
      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      // Both streaming and unary failed
      throw lastError || new Error('Gagal mendapatkan respon dari seluruh model AI yang tersedia.');
    }
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    
    // Extract human-readable message if nested JSON
    let friendlyMessage = 'Terjadi kendala saat menghubungi Abah AI. Silakan coba lagi.';
    try {
      const raw = error?.message || '';
      if (raw.includes('503') || raw.includes('high demand') || raw.includes('UNAVAILABLE')) {
        friendlyMessage = 'Layanan AI sedang mengalami lonjakan antrean sementara. Silakan tekan tombol Coba Lagi.';
      } else if (raw.includes('429') || raw.includes('RESOURCE_EXHAUSTED')) {
        friendlyMessage = 'Batas kuota pertanyaan sementara tercapai. Mohon tunggu sejenak lalu coba lagi.';
      } else if (raw.includes('API_KEY')) {
        friendlyMessage = 'Kunci API Gemini tidak valid atau belum diisi di panel Secrets.';
      } else if (typeof raw === 'string' && raw.length > 0 && !raw.startsWith('{')) {
        friendlyMessage = raw;
      }
    } catch {
      // ignore
    }

    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: friendlyMessage })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: friendlyMessage });
    }
  }
});

// Production vs Development static asset & Vite middlewares handling
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`[Abah AI v1.00.1] Server running on http://localhost:${PORT}`);
  });
}

startServer();
