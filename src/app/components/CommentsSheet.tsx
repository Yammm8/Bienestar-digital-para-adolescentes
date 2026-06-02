import { useState, useEffect, useRef } from "react";
import { X, Send, User } from "lucide-react";

const MAX_COMMENT = 300;
const WARN_AT = 260;

export interface Comment {
  id: number;
  author: string;
  username: string;
  content: string;
  time: string;
}

interface CommentsSheetProps {
  postAuthor: string;
  comments: Comment[];
  onClose: () => void;
  onSubmit: (text: string) => void;
}

export function CommentsSheet({ postAuthor, comments, onClose, onSubmit }: CommentsSheetProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const remaining = MAX_COMMENT - text.length;
  const isOver = text.length > MAX_COMMENT;
  const isNear = text.length >= WARN_AT && !isOver;
  const counterColor = isOver ? "text-red-600" : isNear ? "text-orange-500" : "text-gray-400";
  const canSend = text.trim().length > 0 && !isOver;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Prevent body scroll while sheet is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleSubmit = () => {
    if (!canSend) return;
    onSubmit(text.trim());
    setText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-white rounded-t-3xl max-h-[80vh] flex flex-col shadow-2xl">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3>Comentarios</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-[100px]">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                Todavía no hay comentarios. ¡Sé el primero!
              </p>
            </div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm text-gray-900">{c.author}</span>
                    <span className="text-xs text-gray-400">{c.time}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{c.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Grouped notification notice */}
        <div className="mx-5 mb-3 bg-blue-50 rounded-xl px-3 py-2">
          <p className="text-blue-700 text-xs">
            🔔 {postAuthor} recibirá tu comentario en el próximo resumen horario
          </p>
        </div>

        {/* Input area */}
        <div className="px-5 pb-6 border-t border-gray-100 pt-3">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escribe un comentario..."
                rows={2}
                className={`w-full px-4 py-3 border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:border-transparent text-sm ${
                  isOver
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-200 focus:ring-emerald-500"
                }`}
              />
              <span className={`absolute bottom-2 right-3 text-xs tabular-nums ${counterColor}`}>
                {text.length}/{MAX_COMMENT}
              </span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!canSend}
              className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          {isOver && (
            <p className="text-red-600 text-xs mt-1 ml-1">
              Excediste el límite por {-remaining} caracteres
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
