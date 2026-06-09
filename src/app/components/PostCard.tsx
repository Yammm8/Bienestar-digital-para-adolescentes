import { useState, useRef, useEffect } from "react";
import { MessageCircle, MoreHorizontal, User, Send } from "lucide-react";
import { useNavigate } from "react-router";
import { ReactionsPopup, ReactionId, REACTIONS } from "./ReactionsPopup";
import type { Comment } from "./CommentsSheet";

export interface PostData {
  id: string | number;
  author: string;
  username: string;
  time: string;
  content: string;
  community?: string | null;
  createdAt?: string;
  remoteId?: string;
  synced?: boolean;
  initialReactions: number;
  initialComments: Comment[];
}

interface PostCardProps {
  post: PostData;
  showCommunityTag?: boolean;
}

const MAX_COMMENT = 300;

function formatPostTime(post: PostData) {
  if (post.createdAt) {
    const diff = Date.now() - Date.parse(post.createdAt);
    if (!Number.isNaN(diff) && diff >= 0) {
      const minutes = Math.floor(diff / 60000);
      if (minutes < 1) return "Ahora";
      if (minutes < 60) return `Hace ${minutes} min`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `Hace ${hours} h`;
      const days = Math.floor(hours / 24);
      return `Hace ${days} d`;
    }
  }
  return post.time;
}

export function PostCard({ post, showCommunityTag = true }: PostCardProps) {
  const navigate = useNavigate();
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [myReaction, setMyReaction] = useState<ReactionId | null>(null);
  const [totalReactions, setTotalReactions] = useState(post.initialReactions);
  const [comments, setComments] = useState<Comment[]>(post.initialComments);
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeReaction = myReaction ? REACTIONS.find((r) => r.id === myReaction) : null;
  const canSend = text.trim().length > 0 && text.length <= MAX_COMMENT;

  useEffect(() => {
    if (showComments) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showComments]);

  const handleSelectReaction = (reaction: ReactionId | null) => {
    const hadReaction = myReaction !== null;
    const hasReaction = reaction !== null;
    setMyReaction(reaction);
    if (!hadReaction && hasReaction) setTotalReactions((n) => n + 1);
    if (hadReaction && !hasReaction) setTotalReactions((n) => n - 1);
  };

  const handleSubmitComment = () => {
    if (!canSend) return;
    const newComment: Comment = {
      id: Date.now(),
      author: "María García",
      username: "@maria",
      content: text.trim(),
      time: "Ahora",
    };
    setComments((prev) => [...prev, newComment]);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  return (
    <div className="bg-white border-b border-gray-100">
      {/* Post body */}
      <div className="p-4">
        {/* Author row */}
        <div className="flex items-start gap-3 mb-3">
          <button
            onClick={() => navigate(`/users/${post.username.replace("@", "")}`)}
            className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"
          >
            <User className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(`/users/${post.username.replace("@", "")}`)}
                className="text-left"
              >
                <span className="text-sm text-gray-900">{post.author}</span>
                <span className="text-gray-400 text-xs ml-1.5">{post.username}</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">{formatPostTime(post)}</span>
                <button className="text-gray-300 hover:text-gray-500">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
            {showCommunityTag && post.community && (
              <span className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full mt-1">
                {post.community}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <p className="text-gray-800 text-sm leading-relaxed mb-3">{post.content}</p>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Reaction */}
          <div className="relative">
            <button
              onClick={() => setShowReactions((v) => !v)}
              className={`flex items-center gap-1.5 transition-colors ${
                myReaction ? "text-emerald-600" : "text-gray-400 hover:text-emerald-500"
              }`}
            >
              <span className="text-lg leading-none">{activeReaction ? activeReaction.emoji : "🤍"}</span>
              <span className="text-sm">{totalReactions}</span>
            </button>
            {showReactions && (
              <ReactionsPopup
                current={myReaction}
                onSelect={handleSelectReaction}
                onClose={() => setShowReactions(false)}
              />
            )}
          </div>

          {/* Comment toggle */}
          <button
            onClick={() => setShowComments((v) => !v)}
            className={`flex items-center gap-1.5 transition-colors ${
              showComments ? "text-blue-500" : "text-gray-400 hover:text-blue-500"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{comments.length}</span>
          </button>

          {/* Active reaction label */}
          {activeReaction && (
            <span className="ml-auto text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {activeReaction.emoji} {activeReaction.label}
            </span>
          )}
        </div>
      </div>

      {/* Inline comments section */}
      {showComments && (
        <div className="border-t border-gray-50 bg-gray-50/50 px-4 py-3 space-y-3">
          {/* Comment list */}
          {comments.length > 0 && (
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-2.5">
                  <div className="w-7 h-7 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm">
                      <div className="flex items-baseline gap-1.5 mb-0.5">
                        <span className="text-xs text-gray-800">{c.author}</span>
                        <span className="text-xs text-gray-400">{c.time}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-snug">{c.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {comments.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-1">
              Sin comentarios aún · sé el primero
            </p>
          )}

          {/* New comment input */}
          <div className="flex gap-2.5 items-end">
            <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 flex items-end gap-2 bg-white rounded-2xl rounded-tl-sm shadow-sm px-3 py-2">
              <textarea
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Añade un comentario…"
                rows={1}
                style={{ resize: "none", overflow: "hidden" }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = `${el.scrollHeight}px`;
                }}
                className="flex-1 text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent leading-snug min-h-[20px]"
              />
              <button
                onClick={handleSubmitComment}
                disabled={!canSend}
                className="text-emerald-500 disabled:text-gray-300 transition-colors flex-shrink-0 mb-0.5"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
