// ../ui/Modal.jsx
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function Modal({
  isOpen,
  onClose,
  title,
  size = "md",             // "sm" | "md" | "lg"
  closeOnBackdrop = true,   // 背景クリックで閉じる
  footer,                   // 右寄せのフッター（ボタンなど）
  children,
}) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);
  const dialogRef = useRef(null);
  const titleId = "modal-title";

  // Portal root を用意（なければ作成）
  useEffect(() => {
    let root = document.getElementById("modal-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "modal-root";
      document.body.appendChild(root);
    }
    containerRef.current = root;
  }, []);

  // open 中は body スクロール抑止
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  // 初期フォーカス / Esc / Tabトラップ
  useEffect(() => {
    if (!isOpen) return;
    setMounted(true);

    const dialog = dialogRef.current;
    if (dialog) {
      const firstFocusable = dialog.querySelector(FOCUSABLE);
      firstFocusable && firstFocusable.focus();
    }

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Tab") {
        const nodes = dialog?.querySelectorAll(FOCUSABLE);
        if (!nodes || nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !containerRef.current) return null;

  const sizeClass =
    size === "sm" ? "max-w-md"
    : size === "lg" ? "max-w-2xl"
    : "max-w-lg";

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        onMouseDown={() => { if (closeOnBackdrop) onClose(); }}
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        className={`relative z-[1001] w-full ${sizeClass} mx-4 rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-all duration-200 ease-out
        ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"}`}
        onMouseDown={(e) => e.stopPropagation()}   // 内側クリックは閉じない
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-3">
          <h3 id={titleId} className="text-xl font-bold text-gray-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="閉じる"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6">{children}</div>

        {/* Footer（任意） */}
        {footer && (
          <div className="px-6 pb-6 pt-3 border-t border-gray-100 bg-white/60 rounded-b-2xl">
            <div className="flex justify-end gap-3">{footer}</div>
          </div>
        )}
      </div>
    </div>,
    containerRef.current
  );
}
