import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatSession, ChatMessage, AIMode, AttachedImage } from './types';
import {
  loadUserProfile,
  saveUserProfile,
  loadChatSessions,
  saveChatSessions,
  loadCurrentSessionId,
  saveCurrentSessionId,
  loadAppSettings,
  saveAppSettings,
} from './utils/storage';
import { startAmbientSound, stopAmbientSound } from './utils/audio';

import { SplashScreen } from './components/SplashScreen';
import { FirstTimeProfileModal } from './components/FirstTimeProfileModal';
import { Header } from './components/Header';
import { TechBackground } from './components/TechBackground';
import { GreetingCard } from './components/GreetingCard';
import { PopularQuestions } from './components/PopularQuestions';
import { ModeSelectorModal } from './components/ModeSelectorModal';
import { ChatMessageList } from './components/ChatMessageList';
import { ChatComposer } from './components/ChatComposer';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SettingsModal } from './components/SettingsModal';
import { NavigationDrawer } from './components/NavigationDrawer';

export default function App() {
  // App initialization states
  const [showSplash, setShowSplash] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // App settings & features
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [ambientSound, setAmbientSound] = useState(false);
  const [currentMode, setCurrentMode] = useState<AIMode>('standard');

  // Chat sessions state
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [inputPrompt, setInputPrompt] = useState<string>('');

  // UI Modals & Drawers
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isModeSelectorOpen, setIsModeSelectorOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // AbortController ref for canceling active streaming requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initial Load: Profile, Settings, Sessions
  useEffect(() => {
    const profile = loadUserProfile();
    setUserProfile(profile);

    const settings = loadAppSettings();
    setLanguage(settings.language || 'id');
    setAmbientSound(false); // off by default as per specification

    const loadedSessions = loadChatSessions();
    setSessions(loadedSessions);

    const savedSessionId = loadCurrentSessionId();
    if (savedSessionId && loadedSessions.some((s) => s.id === savedSessionId)) {
      setCurrentSessionId(savedSessionId);
    } else if (loadedSessions.length > 0) {
      setCurrentSessionId(loadedSessions[0].id);
    }
  }, []);

  // When Splash Screen finishes: check if first-time profile setup is needed
  const handleSplashComplete = () => {
    setShowSplash(false);
    if (!userProfile) {
      setShowFirstTimeModal(true);
    }
  };

  // Profile Save
  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    saveUserProfile(profile);
    setShowFirstTimeModal(false);
    setIsEditProfileOpen(false);
  };

  // Language Toggle
  const handleToggleLanguage = () => {
    const newLang = language === 'id' ? 'en' : 'id';
    setLanguage(newLang);
    saveAppSettings({ ambientSoundEnabled: ambientSound, language: newLang });
  };

  // Ambient Sound Toggle
  const handleToggleAmbientSound = () => {
    if (ambientSound) {
      stopAmbientSound();
      setAmbientSound(false);
    } else {
      const started = startAmbientSound();
      if (started) {
        setAmbientSound(true);
      }
    }
  };

  // Get current active session
  const currentSession = sessions.find((s) => s.id === currentSessionId) || null;
  const currentMessages = currentSession?.messages || [];

  // Start New Chat Session
  const handleNewChat = () => {
    // If currently streaming, stop it
    if (isStreaming && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }

    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'Percakapan Belajar Baru',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mode: currentMode,
    };

    const updated = [newSession, ...sessions];
    setSessions(updated);
    setCurrentSessionId(newId);
    saveChatSessions(updated);
    saveCurrentSessionId(newId);
  };

  // Select an existing session
  const handleSelectSession = (id: string) => {
    if (isStreaming && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
    setCurrentSessionId(id);
    saveCurrentSessionId(id);
  };

  // Delete a session
  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    saveChatSessions(updated);

    if (currentSessionId === id) {
      const nextId = updated.length > 0 ? updated[0].id : null;
      setCurrentSessionId(nextId);
      if (nextId) saveCurrentSessionId(nextId);
    }
  };

  // Rename a session
  const handleRenameSession = (id: string, newTitle: string) => {
    const updated = sessions.map((s) =>
      s.id === id ? { ...s, title: newTitle, updatedAt: Date.now() } : s
    );
    setSessions(updated);
    saveChatSessions(updated);
  };

  // Clear all history
  const handleClearAllHistory = () => {
    setSessions([]);
    setCurrentSessionId(null);
    saveChatSessions([]);
    localStorage.removeItem('abah_ai_current_session_id');
  };

  // Stop Generation
  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);

    // Mark last streaming message as completed
    if (currentSessionId) {
      setSessions((prev) =>
        prev.map((session) => {
          if (session.id === currentSessionId) {
            const msgs = [...session.messages];
            if (msgs.length > 0 && msgs[msgs.length - 1].isStreaming) {
              msgs[msgs.length - 1] = {
                ...msgs[msgs.length - 1],
                isStreaming: false,
              };
            }
            return { ...session, messages: msgs, updatedAt: Date.now() };
          }
          return session;
        })
      );
    }
  };

  // Send Message with Real Gemini Streaming API
  const handleSendMessage = async (text: string, image?: AttachedImage) => {
    if (isStreaming) return;

    let activeSessionId = currentSessionId;
    let targetSession = sessions.find((s) => s.id === activeSessionId);

    // If no active session, create one
    if (!activeSessionId || !targetSession) {
      activeSessionId = `session-${Date.now()}`;
      targetSession = {
        id: activeSessionId,
        title: text.slice(0, 32) + (text.length > 32 ? '...' : ''),
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        mode: currentMode,
      };
      setSessions((prev) => [targetSession!, ...prev]);
      setCurrentSessionId(activeSessionId);
      saveCurrentSessionId(activeSessionId);
    }

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
      image: image
        ? {
            data: image.data,
            mimeType: image.mimeType,
          }
        : undefined,
    };

    const assistantMessageId = `msg-asst-${Date.now() + 1}`;
    const initialAssistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now() + 1,
      isStreaming: true,
    };

    // Prepare updated messages array
    const updatedMessages = [...targetSession.messages, userMessage, initialAssistantMessage];

    // Auto-update title if it's the first message of the session
    const isFirstTurn = targetSession.messages.length === 0;
    const sessionTitle = isFirstTurn
      ? text.slice(0, 36) + (text.length > 36 ? '...' : '')
      : targetSession.title;

    // Update state immediately so user sees message right away
    setSessions((prev) => {
      const next = prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              title: sessionTitle,
              messages: updatedMessages,
              updatedAt: Date.now(),
            }
          : s
      );
      saveChatSessions(next);
      return next;
    });

    setIsStreaming(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Build request payload for backend Express route
      const payloadMessages = [...targetSession.messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: payloadMessages,
          userProfile,
          mode: currentMode,
          image: image ? { data: image.data, mimeType: image.mimeType } : undefined,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(
          errorJson.error || `Server error (${res.status}): Gagal memproses jawaban AI.`
        );
      }

      // Read SSE stream
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';
      let streamError: string | null = null;

      if (reader) {
        let done = false;
        let buffer = '';

        while (!done) {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;

          if (value) {
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6).trim();

                if (dataStr === '[DONE]') {
                  done = true;
                  break;
                }

                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.error) {
                    streamError = parsed.error;
                    done = true;
                    break;
                  }
                  if (parsed.text) {
                    accumulatedText += parsed.text;

                    // Update UI with accumulated real text
                    setSessions((prev) =>
                      prev.map((s) => {
                        if (s.id === activeSessionId) {
                          const msgs = [...s.messages];
                          const idx = msgs.findIndex((m) => m.id === assistantMessageId);
                          if (idx !== -1) {
                            msgs[idx] = {
                              ...msgs[idx],
                              content: accumulatedText,
                            };
                          }
                          return { ...s, messages: msgs };
                        }
                        return s;
                      })
                    );
                  }
                } catch {
                  // If JSON parse fails, ignore line
                }
              }
            }
          }
        }
      }

      if (streamError) {
        throw new Error(streamError);
      }

      if (!accumulatedText.trim()) {
        throw new Error('Tidak ada respon yang diterima dari Abah AI. Silakan tekan tombol Coba Lagi.');
      }

      // Finalize message streaming status
      setSessions((prev) => {
        const next = prev.map((s) => {
          if (s.id === activeSessionId) {
            const msgs = [...s.messages];
            const idx = msgs.findIndex((m) => m.id === assistantMessageId);
            if (idx !== -1) {
              msgs[idx] = {
                ...msgs[idx],
                content: accumulatedText,
                isStreaming: false,
              };
            }
            return { ...s, messages: msgs, updatedAt: Date.now() };
          }
          return s;
        });
        saveChatSessions(next);
        return next;
      });
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Stream aborted by user
        console.log('Stream stopped by user.');
      } else {
        console.error('Chat error:', err);
        const errorMsg =
          err.message || 'Terjadi gangguan koneksi saat meminta jawaban ke Abah AI. Silakan coba lagi.';

        setSessions((prev) => {
          const next = prev.map((s) => {
            if (s.id === activeSessionId) {
              const msgs = [...s.messages];
              const idx = msgs.findIndex((m) => m.id === assistantMessageId);
              if (idx !== -1) {
                msgs[idx] = {
                  ...msgs[idx],
                  content: errorMsg,
                  isStreaming: false,
                  error: true,
                };
              }
              return { ...s, messages: msgs, updatedAt: Date.now() };
            }
            return s;
          });
          saveChatSessions(next);
          return next;
        });
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  // Regenerate last assistant response
  const handleRegenerateLast = () => {
    if (!currentSession || currentMessages.length < 2 || isStreaming) return;

    // Find the last user message
    let lastUserMessage: ChatMessage | null = null;
    for (let i = currentMessages.length - 1; i >= 0; i--) {
      if (currentMessages[i].role === 'user') {
        lastUserMessage = currentMessages[i];
        break;
      }
    }

    if (lastUserMessage) {
      // Remove last assistant message
      const pruned = currentMessages.slice(0, currentMessages.length - 1);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId ? { ...s, messages: pruned } : s
        )
      );

      // Re-trigger
      handleSendMessage(
        lastUserMessage.content,
        lastUserMessage.image
          ? {
              data: lastUserMessage.image.data,
              mimeType: lastUserMessage.image.mimeType,
              previewUrl: `data:${lastUserMessage.image.mimeType};base64,${lastUserMessage.image.data}`,
            }
          : undefined
      );
    }
  };

  // Retry when error occurred
  const handleRetryLast = () => {
    handleRegenerateLast();
  };

  // When a popular question is tapped
  const handleSelectPopularQuestion = (question: string) => {
    handleSendMessage(question);
  };

  // If splash is showing, render splash
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  const hasMessages = currentMessages.length > 0;

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-[#050B17] text-slate-100 overflow-x-hidden">
      {/* Luminous Cyber Tech Background Layer */}
      <TechBackground />

      {/* Fixed Sticky Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        onNewChat={handleNewChat}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        ambientSound={ambientSound}
        onToggleAmbientSound={handleToggleAmbientSound}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-3xl w-full mx-auto px-3 sm:px-4 pt-3 pb-36 flex flex-col">
        {!hasMessages ? (
          // Android-First Home View (Matching Reference Screenshot)
          <div className="flex flex-col gap-5 pt-2 animate-fade-in">
            {/* Personalized Greeting Card with dynamic time & gender */}
            <GreetingCard
              userProfile={userProfile}
              language={language}
              onEditProfile={() => setIsEditProfileOpen(true)}
            />

            {/* Popular Questions Grid (8 subjects) */}
            <PopularQuestions onSelectQuestion={handleSelectPopularQuestion} />
          </div>
        ) : (
          // Active Chat View (Chronological Messages)
          <div className="flex flex-col gap-3">
            {/* Subtle minimized greeting reminder card */}
            <div className="p-3 rounded-2xl bg-[#09152F]/70 border border-cyan-500/20 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-cyan-300">
                  {currentSession?.title || 'Sesi Belajar Abah AI'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-mono">
                  {currentMode === 'math'
                    ? 'Matematika'
                    : currentMode === 'coding'
                    ? 'Koding'
                    : currentMode === 'quick'
                    ? 'Ringkas'
                    : 'Umum'}
                </span>
              </div>
              <button
                onClick={handleNewChat}
                className="text-[11px] text-cyan-400 hover:text-white font-medium px-2 py-1 rounded-lg hover:bg-cyan-950/40 cursor-pointer"
              >
                + Chat Baru
              </button>
            </div>

            {/* Chat Messages */}
            <ChatMessageList
              messages={currentMessages}
              onRegenerateLast={handleRegenerateLast}
              onRetryLast={handleRetryLast}
              language={language}
            />
          </div>
        )}
      </main>

      {/* Rounded Fixed Bottom Composer (Respects safe area & mobile keyboard) */}
      <ChatComposer
        onSendMessage={handleSendMessage}
        isStreaming={isStreaming}
        onStopStreaming={handleStopStreaming}
        currentMode={currentMode}
        onOpenModeSelector={() => setIsModeSelectorOpen(true)}
        inputPrompt={inputPrompt}
        onInputPromptHandled={() => setInputPrompt('')}
      />

      {/* First-time Profile Setup Modal */}
      {showFirstTimeModal && (
        <FirstTimeProfileModal
          onSave={handleSaveProfile}
          isEditMode={false}
        />
      )}

      {/* Edit Profile Modal from Settings */}
      {isEditProfileOpen && (
        <FirstTimeProfileModal
          initialProfile={userProfile}
          onSave={handleSaveProfile}
          isEditMode={true}
          onCancel={() => setIsEditProfileOpen(false)}
        />
      )}

      {/* Mode Selector Modal */}
      <ModeSelectorModal
        isOpen={isModeSelectorOpen}
        onClose={() => setIsModeSelectorOpen(false)}
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode)}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userProfile={userProfile}
        onEditProfile={() => setIsEditProfileOpen(true)}
        language={language}
        onChangeLanguage={(lang) => {
          setLanguage(lang);
          saveAppSettings({ ambientSoundEnabled: ambientSound, language: lang });
        }}
        ambientSound={ambientSound}
        onToggleAmbientSound={handleToggleAmbientSound}
        onClearAllHistory={handleClearAllHistory}
      />

      {/* Navigation Drawer (Hamburger) */}
      <NavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        userProfile={userProfile}
        onNewChat={handleNewChat}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenModeSelector={() => setIsModeSelectorOpen(true)}
        onEditProfile={() => setIsEditProfileOpen(true)}
        onSelectPrompt={(p) => {
          setInputPrompt(p);
        }}
      />
    </div>
  );
}
