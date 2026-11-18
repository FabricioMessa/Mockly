import {
  ArrowUp,
  Loader2,
  Mic,
  Pencil,
  Plus,
  Square,
  Volume2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { cn } from '../../lib/cn'
import { useTranslation } from '../../lib/i18n'

export interface InterviewComposerProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onToggleMic: () => void
  onRepeatQuestion: () => void
  onStopVoice: () => void
  onWrite: () => void
  listening: boolean
  speaking: boolean
  sending: boolean
  sttSupported: boolean
  ttsSupported: boolean
  error?: string
  sttError?: string
  textareaRef: RefObject<HTMLTextAreaElement | null>
}

interface MenuOptionProps {
  icon: LucideIcon
  label: string
  onClick: () => void
  disabled?: boolean
}

function MenuOption({
  icon: Icon,
  label,
  onClick,
  disabled = false,
}: MenuOptionProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-input px-2.5 py-2 text-left text-caption text-content-primary transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Icon className="size-4" strokeWidth={1.75} />
      {label}
    </button>
  )
}

export function InterviewComposer({
  value,
  onChange,
  onSend,
  onToggleMic,
  onRepeatQuestion,
  onStopVoice,
  onWrite,
  listening,
  speaking,
  sending,
  sttSupported,
  ttsSupported,
  error,
  sttError,
  textareaRef,
}: InterviewComposerProps) {
  const t = useTranslation()
  const [optionsOpen, setOptionsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!optionsOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOptionsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [optionsOpen])

  const handleWrite = () => {
    setOptionsOpen(false)
    onWrite()
    textareaRef.current?.focus()
  }

  return (
    <div className="w-full">
      <div className="rounded-[28px] border border-border bg-surface p-3 shadow-card">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              onSend()
            }
          }}
          rows={3}
          placeholder={t.interview.answerPlaceholder}
          className="min-h-[88px] w-full resize-none bg-transparent px-2 py-1 text-body text-content-primary placeholder:text-content-secondary focus:outline-none"
        />

        <div className="mt-2 flex items-center justify-between gap-2">
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setOptionsOpen((open) => !open)}
              className="inline-flex items-center gap-1.5 rounded-pill border border-border px-3 py-1.5 text-caption font-medium text-content-secondary transition-colors hover:bg-background hover:text-content-primary"
            >
              <Plus className="size-3.5" strokeWidth={2} />
              {t.interview.options}
            </button>

            {optionsOpen && (
              <div className="absolute bottom-full left-0 z-20 mb-2 w-56 rounded-card border border-border bg-surface p-1 shadow-xl">
                <MenuOption
                  icon={Volume2}
                  label={t.interview.repeatQuestion}
                  disabled={!ttsSupported}
                  onClick={() => {
                    setOptionsOpen(false)
                    onRepeatQuestion()
                  }}
                />
                <MenuOption
                  icon={Square}
                  label={t.interview.stopVoice}
                  disabled={!speaking}
                  onClick={() => {
                    setOptionsOpen(false)
                    onStopVoice()
                  }}
                />
                <MenuOption
                  icon={Pencil}
                  label={t.interview.writeAnswer}
                  onClick={handleWrite}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleMic}
              disabled={!sttSupported || sending}
              aria-label={
                listening ? t.interview.stopVoice : t.interview.tapMic
              }
              className={cn(
                'relative flex size-10 items-center justify-center rounded-full transition-colors',
                listening
                  ? 'bg-error text-white'
                  : 'bg-background text-content-secondary hover:text-content-primary',
                (!sttSupported || sending) &&
                  'cursor-not-allowed opacity-40',
              )}
            >
              {listening && (
                <span className="absolute inset-0 animate-ping rounded-full bg-error/30" />
              )}
              {listening ? (
                <Square className="size-4" fill="currentColor" />
              ) : (
                <Mic className="size-5" strokeWidth={1.75} />
              )}
            </button>

            <button
              type="button"
              onClick={onSend}
              disabled={sending || !value.trim()}
              aria-label={t.interview.sendAnswer}
              className="flex size-10 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {sending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowUp className="size-5" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </div>

      {error && <p className="mt-2 text-caption text-error">{error}</p>}
      {sttError && <p className="mt-1 text-caption text-error">{sttError}</p>}
    </div>
  )
}
