import React, { useRef, useState, useEffect } from 'react';
import {
  Send,
  Plus,
  Image as ImageIcon,
  Camera,
  Square,
  X,
  ChevronRight,
  BookOpen,
  FileQuestion,
  HelpCircle,
} from 'lucide-react';
import { AttachedImage, AIMode } from '../types';
import { AbahMascot } from './AbahMascot';

interface ChatComposerProps {
  onSendMessage: (text: string, image?: AttachedImage) => void;
  isStreaming: boolean;
  onStopStreaming: () => void;
  currentMode: AIMode;
  onOpenModeSelector: () => void;
  inputPrompt?: string;
  onInputPromptHandled?: () => void;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  onSendMessage,
  isStreaming,
  onStopStreaming,
  currentMode,
  onOpenModeSelector,
  inputPrompt,
  onInputPromptHandled,
}) => {
  const [text, setText] = useState('');
  const [attachedImage, setAttachedImage] = useState<AttachedImage | null>(null);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // If a prompt is selected from outside (e.g. popular questions)
  useEffect(() => {
    if (inputPrompt) {
      setText(inputPrompt);
      if (onInputPromptHandled) onInputPromptHandled();
      if (textareaRef.current) {
        textareaRef.current.focus();
        // Adjust height
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
          }
        }, 50);
      }
    }
  }, [inputPrompt, onInputPromptHandled]);

  // Adjust textarea height on typing
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (isStreaming) {
      onStopStreaming();
      return;
    }

    const trimmed = text.trim();
    if (!trimmed && !attachedImage) return;

    onSendMessage(trimmed || 'Tolong jelaskan gambar yang saya unggah ini.', attachedImage || undefined);
    setText('');
    setAttachedImage(null);
    setShowQuickMenu(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Handle Image File Selection
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Silakan pilih file gambar yang valid (JPG, PNG, WEBP).');
      return;
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran gambar terlalu besar (maksimal 10MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      setAttachedImage({
        data: base64Data,
        mimeType: file.type || 'image/jpeg',
        previewUrl: result,
      });
      setShowQuickMenu(false);
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    // reset input
    e.target.value = '';
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    // reset input
    e.target.value = '';
  };

  const getModeLabel = (mode: AIMode) => {
    switch (mode) {
      case 'math':
        return 'Matematika & Sains';
      case 'coding':
        return 'Koding & Pemrograman';
      case 'quick':
        return 'Ringkas & Cepat';
      default:
        return 'Mode Belajar Umum';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#040816] via-[#040816]/95 to-transparent pt-3 pb-[max(env(safe-area-inset-bottom),12px)] px-3 sm:px-4">
      <div className="max-w-3xl mx-auto flex flex-col gap-2">
        {/* Top bar over composer: Mode Pill (Matching Reference Design) */}
        <div className="flex items-center justify-between px-1">
          <button
            onClick={onOpenModeSelector}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#09152F]/90 border border-cyan-500/30 hover:border-cyan-400 text-xs text-cyan-200 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer group active:scale-95"
            title="Ganti Mode AI"
          >
            <div className="relative">
              <AbahMascot size="xs" showBadge={false} glow={false} />
            </div>
            <span className="font-semibold text-white group-hover:text-cyan-300">
              {getModeLabel(currentMode)}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {attachedImage && (
            <span className="text-[11px] text-cyan-400 font-medium">1 Foto Terlampir</span>
          )}
        </div>

        {/* Attached Image Preview */}
        {attachedImage && (
          <div className="relative inline-flex items-center gap-2 p-1.5 pl-2.5 pr-2 bg-[#0A1736] border border-cyan-500/40 rounded-2xl max-w-xs shadow-lg animate-fade-in self-start">
            <img
              src={attachedImage.previewUrl}
              alt="Lampiran Preview"
              className="w-10 h-10 object-cover rounded-xl border border-cyan-500/30"
            />
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-xs font-semibold text-cyan-200 truncate">
                Foto siap dikirim
              </span>
              <span className="text-[10px] text-slate-400">Tanyakan soal ini ke Abah</span>
            </div>
            <button
              onClick={() => setAttachedImage(null)}
              className="p-1 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
              title="Hapus Lampiran"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Quick Actions Popup Menu */}
        {showQuickMenu && (
          <div className="p-2.5 bg-[#0A1736] border border-cyan-500/30 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.25)] flex flex-wrap gap-2 text-xs animate-fade-in">
            <button
              onClick={() => {
                setText('Buatkan saya 3 contoh soal latihan mengenai topik ini beserta kunci jawabannya: ');
                setShowQuickMenu(false);
                textareaRef.current?.focus();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/25 transition-colors cursor-pointer"
            >
              <FileQuestion className="w-3.5 h-3.5" />
              <span>Buat Latihan Soal</span>
            </button>

            <button
              onClick={() => {
                setText('Tolong buatkan rangkuman poin-poin penting materi ini: ');
                setShowQuickMenu(false);
                textareaRef.current?.focus();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 border border-blue-500/25 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Rangkuman Materi</span>
            </button>

            <button
              onClick={() => {
                setText('Jelaskan dengan bahasa yang sangat sederhana seolah-olah saya adalah pemula: ');
                setShowQuickMenu(false);
                textareaRef.current?.focus();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-500/25 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Jelaskan Sederhana</span>
            </button>
          </div>
        )}

        {/* Main Rounded Composer Bar (Matching Reference Screenshot) */}
        <div className="relative flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-full glass-input shadow-[0_0_25px_rgba(6,182,212,0.18)] border border-cyan-500/30 focus-within:border-cyan-400 focus-within:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all">
          {/* Quick Menu Toggle (+) */}
          <button
            type="button"
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className={`p-2 rounded-full transition-colors cursor-pointer shrink-0 ${
              showQuickMenu
                ? 'bg-cyan-500 text-[#050B17]'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40'
            }`}
            title="Menu Aksi Cepat"
            aria-label="Aksi Cepat"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Gallery Upload Button */}
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="p-2 rounded-full text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors cursor-pointer shrink-0"
            title="Pilih Foto dari Galeri"
            aria-label="Upload Gambar"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            onChange={handleGalleryChange}
            className="hidden"
          />

          {/* Camera Capture Button */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="p-2 rounded-full text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors cursor-pointer shrink-0"
            title="Ambil Foto dengan Kamera"
            aria-label="Buka Kamera"
          >
            <Camera className="w-5 h-5" />
          </button>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraChange}
            className="hidden"
          />

          {/* Multiline Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ketik pesan atau tanyakan sesuatu..."
            className="flex-1 bg-transparent border-0 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-0 resize-none py-2 px-2 max-h-32 min-h-[38px] leading-relaxed"
          />

          {/* Send / Stop Button */}
          {isStreaming ? (
            <button
              type="button"
              onClick={onStopStreaming}
              className="p-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all transform active:scale-95 cursor-pointer shrink-0 animate-pulse"
              title="Hentikan Jawaban"
            >
              <Square className="w-4 h-4 fill-white" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!text.trim() && !attachedImage}
              className={`p-2.5 rounded-full transition-all transform active:scale-95 cursor-pointer shrink-0 ${
                text.trim() || attachedImage
                  ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 text-[#050B17] shadow-[0_0_18px_rgba(6,182,212,0.45)] hover:shadow-[0_0_24px_rgba(6,182,212,0.6)] font-bold'
                  : 'bg-slate-800/80 text-slate-500 cursor-not-allowed'
              }`}
              title="Kirim Pertanyaan"
              aria-label="Kirim Pesan"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
