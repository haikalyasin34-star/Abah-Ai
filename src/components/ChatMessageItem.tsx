import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Copy,
  Check,
  RotateCcw,
  Share2,
  Volume2,
  VolumeX,
  Sparkles,
  AlertCircle,
  FileCode,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { AbahMascot } from './AbahMascot';
import { speakText, stopSpeech, isSpeaking } from '../utils/audio';

interface ChatMessageItemProps {
  message: ChatMessage;
  onRegenerate?: () => void;
  onRetry?: () => void;
  language: 'id' | 'en';
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onRegenerate,
  onRetry,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [shared, setShared] = useState(false);

  const isAssistant = message.role === 'assistant';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Jawaban dari Abah AI',
          text: message.content,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } else {
        handleCopy();
      }
    } catch {
      // Ignore user abort
    }
  };

  const handleToggleSpeech = () => {
    if (speaking) {
      stopSpeech();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      speakText(message.content, language, () => {
        setSpeaking(false);
      });
    }
  };

  return (
    <div
      className={`w-full flex flex-col gap-2 transition-all ${
        isAssistant ? 'items-start' : 'items-end'
      }`}
    >
      {/* Container Box */}
      <div
        className={`relative max-w-[92%] sm:max-w-[85%] rounded-3xl p-4 sm:p-5 transition-all ${
          isAssistant
            ? 'glass-card text-slate-100 border border-cyan-500/25 shadow-[0_0_24px_rgba(6,182,212,0.15)] rounded-tl-sm'
            : 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 text-white shadow-[0_4px_20px_rgba(37,99,235,0.35)] rounded-tr-sm'
        }`}
      >
        {/* Assistant Header info with Abah Mascot icon */}
        {isAssistant && (
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/15">
            <div className="flex items-center gap-2">
              <AbahMascot size="xs" showBadge={false} glow={true} />
              <span className="text-xs font-bold text-cyan-300">Abah AI</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                Tutor
              </span>
            </div>

            {/* Timestamp */}
            <span className="text-[10px] text-slate-400">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}

        {/* Attached image preview if message has an image */}
        {message.image && (
          <div className="mb-3 rounded-2xl overflow-hidden border border-cyan-400/30 max-w-xs shadow-md">
            <img
              src={`data:${message.image.mimeType};base64,${message.image.data}`}
              alt="Lampiran Pertanyaan"
              className="w-full h-auto max-h-60 object-contain bg-slate-950"
            />
          </div>
        )}

        {/* Message Content */}
        {message.error ? (
          <div className="flex items-start gap-2.5 text-rose-300 py-1">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold">{message.content}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-900/40 hover:bg-rose-900/70 border border-rose-500/40 text-rose-200 text-xs font-semibold transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Coba Lagi</span>
                </button>
              )}
            </div>
          </div>
        ) : isAssistant ? (
          <div className="prose-abah text-sm">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');

                  if (!inline) {
                    return (
                      <div className="my-3 rounded-2xl overflow-hidden border border-cyan-500/30 bg-[#040816] shadow-lg">
                        <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#081226] border-b border-cyan-500/20 text-xs text-cyan-300">
                          <div className="flex items-center gap-1.5">
                            <FileCode className="w-3.5 h-3.5" />
                            <span className="font-mono uppercase font-semibold">
                              {match ? match[1] : 'code'}
                            </span>
                          </div>
                          <button
                            onClick={() => navigator.clipboard.writeText(codeString)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-slate-300 hover:text-white hover:bg-cyan-900/40 transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Salin</span>
                          </button>
                        </div>
                        <pre className="p-3.5 overflow-x-auto text-xs font-mono text-cyan-100">
                          <code>{children}</code>
                        </pre>
                      </div>
                    );
                  }

                  return (
                    <code
                      className="px-1.5 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-mono text-xs"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>

            {message.isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse align-middle" />
            )}
          </div>
        ) : (
          <div className="text-sm whitespace-pre-wrap leading-relaxed font-medium">
            {message.content}
          </div>
        )}

        {/* User timestamp */}
        {!isAssistant && (
          <div className="text-right mt-1.5">
            <span className="text-[10px] text-cyan-100/70">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}

        {/* Action Bar for AI Answers */}
        {isAssistant && !message.error && !message.isStreaming && message.content && (
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-cyan-500/15 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              {/* Copy Answer */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 rounded-lg hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors cursor-pointer"
                title="Salin Jawaban"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] text-emerald-400 font-semibold">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Salin</span>
                  </>
                )}
              </button>

              {/* Read Aloud (TTS) */}
              <button
                onClick={handleToggleSpeech}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  speaking
                    ? 'text-cyan-300 bg-cyan-950/60 font-semibold'
                    : 'hover:text-cyan-300 hover:bg-cyan-950/40'
                }`}
                title={speaking ? 'Hentikan Suara' : 'Dengarkan Jawaban'}
              >
                {speaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span className="text-[11px] text-cyan-400">Hentikan</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Suara</span>
                  </>
                )}
              </button>

              {/* Share Answer */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1 px-2 py-1 rounded-lg hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors cursor-pointer"
                title="Bagikan Jawaban"
              >
                {shared ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Share2 className="w-3.5 h-3.5" />
                )}
                <span className="text-[11px]">Bagikan</span>
              </button>
            </div>

            {/* Regenerate Button */}
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors cursor-pointer"
                title="Buat Ulang Jawaban"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[11px]">Ulang</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
