import React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"

export default function Modal({ open, onClose, title, children, width = "max-w-2xl" }) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full ${width} bg-overlay border border-border rounded-xl shadow-2xl z-50 animate-fade-in overflow-hidden`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <Dialog.Title className="font-display text-lg font-semibold text-text-primary">{title}</Dialog.Title>
            <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1 rounded-md hover:bg-surface transition-colors">
              <X size={16} />
            </button>
          </div>
          <div className="px-6 py-5">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
