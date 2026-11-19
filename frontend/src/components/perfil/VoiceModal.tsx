import { Play, Square } from 'lucide-react'
import { useAppSettings } from '../../context/appSettings'
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis'
import { cn } from '../../lib/cn'
import { useTranslation } from '../../lib/i18n'
import { SPEECH_RATES } from '../../lib/preferences'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

export interface VoiceModalProps {
  open: boolean
  onClose: () => void
}

export function VoiceModal({ open, onClose }: VoiceModalProps) {
  const t = useTranslation()
  const {
    language,
    voiceName,
    setVoiceName,
    speechRate,
    setSpeechRate,
  } = useAppSettings()
  const { supported, voices, selectedVoice, speaking, speak, stop } =
    useSpeechSynthesis({ language, voiceName, rate: speechRate })

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.voice.title}
      description={t.voice.description}
    >
      {!supported ? (
        <p className="rounded-input border border-border bg-background p-3 text-caption text-content-secondary">
          {t.voice.unsupported}
        </p>
      ) : (
        <>
          <div className="max-h-60 overflow-y-auto rounded-input border border-border">
            <button
              type="button"
              onClick={() => setVoiceName('')}
              className={cn(
                'flex w-full items-center justify-between gap-2 border-b border-border px-3 py-2 text-left text-caption',
                !voiceName
                  ? 'bg-primary/10 text-primary'
                  : 'text-content-primary hover:bg-background',
              )}
            >
              <span>{t.voice.default}</span>
              <span className="text-[10px] text-content-secondary">
                {language === 'es' ? 'es' : 'en'}
              </span>
            </button>

            {voices.map((voice) => (
              <button
                key={voice.name}
                type="button"
                onClick={() => setVoiceName(voice.name)}
                className={cn(
                  'flex w-full items-center justify-between gap-2 border-b border-border px-3 py-2 text-left text-caption last:border-b-0',
                  voiceName === voice.name
                    ? 'bg-primary/10 text-primary'
                    : 'text-content-primary hover:bg-background',
                )}
              >
                <span className="truncate">{voice.name}</span>
                <span className="shrink-0 text-[10px] text-content-secondary">
                  {voice.lang}
                </span>
              </button>
            ))}
          </div>

          {voices.length === 0 && (
            <p className="mt-2 text-caption text-content-secondary">
              {t.voice.noVoices}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between gap-3">
            <label
              htmlFor="speech-rate"
              className="text-caption text-content-secondary"
            >
              {t.voice.rate}
            </label>
            <select
              id="speech-rate"
              value={speechRate}
              onChange={(event) => setSpeechRate(Number(event.target.value))}
              className="rounded-pill border border-border bg-surface px-3 py-1 text-caption text-content-primary"
            >
              {SPEECH_RATES.map((rate) => (
                <option key={rate} value={rate}>
                  {rate.toFixed(1)}x
                </option>
              ))}
            </select>
          </div>

          <details className="mt-3 rounded-input border border-border bg-background p-3">
            <summary className="cursor-pointer text-caption font-medium text-content-primary">
              {t.voice.qualityTitle}
            </summary>
            <p className="mt-2 text-caption leading-relaxed text-content-secondary">
              {t.voice.qualityHint}
            </p>
          </details>

          <div className="mt-4 flex gap-2">
            {speaking ? (
              <Button
                fullWidth
                variant="outline"
                onClick={stop}
                leftIcon={<Square className="size-4" />}
              >
                {t.voice.stop}
              </Button>
            ) : (
              <Button
                fullWidth
                onClick={() => speak(t.voice.sample)}
                leftIcon={<Play className="size-4" strokeWidth={1.75} />}
              >
                {t.voice.test}
              </Button>
            )}
            <Button fullWidth variant="outline" onClick={onClose}>
              {t.common.close}
            </Button>
          </div>

          {selectedVoice && (
            <p className="mt-2 text-[11px] text-content-secondary">
              {selectedVoice.name} · {selectedVoice.lang}
            </p>
          )}
        </>
      )}
    </Modal>
  )
}
