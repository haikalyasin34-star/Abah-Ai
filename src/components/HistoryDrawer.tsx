import React, { useState } from 'react';
import { ChatSession } from '../types';
import { AbahMascot } from './AbahMascot';
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Clock,
  Sparkles,
} from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const startRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteSession(id);
    setConfirmDeleteId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#02050E]/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xs sm:max-w-sm bg-[#081226] border-r border-cyan-500/25 h-full flex flex-col z-10 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-slate-100">
        {/* Drawer Header */}
        <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AbahMascot size="sm" showBadge={false} glow={true} />
            <div>
              <h3 className="font-bold text-white text-base leading-none">Riwayat Belajar</h3>
              <p className="text-[11px] text-cyan-300/80 mt-1">Daftar sesi tanya jawabmu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3 border-b border-cyan-500/15">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 text-[#050B17] font-bold text-xs tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.45)] transition-all transform active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Mulai Chat Baru</span>
          </button>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12 px-4 text-slate-400">
              <Clock className="w-8 h-8 text-cyan-500/40 mb-2" />
              <p className="text-sm font-medium text-slate-300">Belum ada riwayat</p>
              <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
                Pertanyaan yang kamu tanyakan ke Abah AI akan tersimpan di sini.
              </p>
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === currentSessionId;
              const isEditing = session.id === editingId;
              const isConfirming = session.id === confirmDeleteId;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    onClose();
                  }}
                  className={`w-full group rounded-2xl p-3 border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950/40 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/30'
                      : 'bg-[#050B17]/60 border-slate-800/80 hover:border-cyan-500/30 hover:bg-[#07132B]'
                  }`}
                >
                  {isEditing ? (
                    <div
                      className="flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 bg-[#040816] border border-cyan-400 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={(e) => handleSaveRename(session.id, e)}
                        className="p-1 rounded bg-cyan-600 text-white hover:bg-cyan-500"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(null);
                        }}
                        className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : isConfirming ? (
                    <div
                      className="flex items-center justify-between text-xs py-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-rose-300 font-medium text-[11px]">Hapus chat ini?</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleDelete(session.id, e)}
                          className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-bold"
                        >
                          Ya, Hapus
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(null);
                          }}
                          className="px-2 py-1 bg-slate-800 text-slate-300 rounded-lg text-[10px]"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <MessageSquare
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isActive ? 'text-cyan-400' : 'text-slate-400'
                          }`}
                        />
                        <div className="flex flex-col min-w-0">
                          <span
                            className={`text-xs font-semibold truncate ${
                              isActive ? 'text-cyan-200' : 'text-slate-200'
                            }`}
                          >
                            {session.title || 'Percakapan Belajar'}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(session.updatedAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons on hover */}
                      <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => startRename(session, e)}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300"
                          title="Ganti Judul"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(session.id);
                          }}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400"
                          title="Hapus Percakapan"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-cyan-500/15 bg-[#050B17]/80 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Tersimpan di penyimpanan lokal perangkat</span>
          </p>
        </div>
      </div>
    </div>
  );
};
