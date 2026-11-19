import {
  Award,
  CalendarDays,
  Clock,
  Flame,
  Layers,
  Star,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ProgressBar } from '../components/ui/ProgressBar'
import { StatChip } from '../components/ui/StatChip'
import { useAppSettings } from '../context/appSettings'
import {
  formatTotalTime,
  getHistoryStats,
  getRecentRecommendations,
  getScoreTrend,
  getSkillSummary,
  getWeeklyActivity,
  modeKey,
  readSessions,
} from '../lib/interviewHistory'
import { useTranslation } from '../lib/i18n'

interface Achievement {
  id: string
  title: string
  description: string
  unlocked: boolean
  icon: LucideIcon
}

export function Progreso() {
  const t = useTranslation()
  const { language } = useAppSettings()
  const sessions = useMemo(() => readSessions(), [])

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <header>
          <h1>{t.progress.title}</h1>
          <p className="mt-1 text-body text-content-secondary">
            {t.progress.subtitle}
          </p>
        </header>
        <Card className="flex flex-col items-center gap-3 p-8 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <TrendingUp className="size-6" strokeWidth={1.75} />
          </span>
          <div>
            <p className="font-display text-h2 font-semibold text-content-primary">
              {t.progress.emptyTitle}
            </p>
            <p className="mt-1 text-caption text-content-secondary">
              {t.progress.emptyDesc}
            </p>
          </div>
          <Link to="/dashboard">
            <Button size="sm">{t.history.start}</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const stats = getHistoryStats(sessions)
  const weekly = getWeeklyActivity(sessions, language)
  const trend = getScoreTrend(sessions, 10, language)
  const skills = getSkillSummary(sessions)
  const recommendations = getRecentRecommendations(sessions, 3)
  const maxMinutes = Math.max(30, ...weekly.map((item) => item.minutes))

  const achievements: Achievement[] = [
    {
      id: 'first',
      title: 'Primera entrevista',
      description: 'Completa tu primera simulación.',
      unlocked: stats.total >= 1,
      icon: Award,
    },
    {
      id: 'five',
      title: 'Constancia',
      description: 'Completa 5 entrevistas.',
      unlocked: stats.total >= 5,
      icon: Flame,
    },
    {
      id: 'ten',
      title: 'Veterano',
      description: 'Completa 10 entrevistas.',
      unlocked: stats.total >= 10,
      icon: Trophy,
    },
    {
      id: 'streak7',
      title: 'Racha de 7 días',
      description: 'Practica 7 días seguidos.',
      unlocked: stats.longestStreak >= 7,
      icon: CalendarDays,
    },
    {
      id: 'score90',
      title: 'Puntaje 90+',
      description: 'Alcanza 90 puntos en una entrevista.',
      unlocked: stats.bestScore >= 90,
      icon: Star,
    },
    {
      id: 'allModes',
      title: 'Explorador',
      description: 'Practica en los 3 modos.',
      unlocked: ['laboral', 'universidad', 'idiomas'].every(
        (mode) => (stats.byMode[mode]?.count ?? 0) > 0,
      ),
      icon: Layers,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1>{t.progress.title}</h1>
        <p className="mt-1 text-body text-content-secondary">
          {t.progress.subtitle}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatChip
          icon={<CalendarDays className="size-4 lg:size-5" strokeWidth={1.75} />}
          value={stats.total}
          label={t.progress.total}
          tone="primary"
        />
        <StatChip
          icon={<Award className="size-4 lg:size-5" strokeWidth={1.75} />}
          value={`${Math.round(stats.averageScore)}/100`}
          label={t.progress.average}
          tone="accent"
        />
        <StatChip
          icon={<Trophy className="size-4 lg:size-5" strokeWidth={1.75} />}
          value={stats.bestScore}
          label={t.progress.best}
          tone="success"
        />
        <StatChip
          icon={<Clock className="size-4 lg:size-5" strokeWidth={1.75} />}
          value={formatTotalTime(stats.totalSeconds)}
          label={t.progress.totalTime}
          tone="primary"
        />
        <StatChip
          icon={<Flame className="size-4 lg:size-5" strokeWidth={1.75} />}
          value={`${stats.currentStreak} ${t.progress.days}`}
          label={t.progress.currentStreak}
          tone="warning"
        />
        <StatChip
          icon={<TrendingUp className="size-4 lg:size-5" strokeWidth={1.75} />}
          value={`${stats.longestStreak} ${t.progress.days}`}
          label={t.progress.longestStreak}
          tone="accent"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="p-5">
          <h2 className="text-label font-semibold text-content-primary">
            {t.progress.scoreTrend}
          </h2>
          <div className="mt-4 flex h-44 items-end gap-2">
            {trend.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className="flex flex-1 flex-col items-center gap-1.5"
              >
                <span className="text-caption text-content-secondary">
                  {item.score}
                </span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-primary to-accent"
                  style={{ height: `${(item.score / 100) * 120}px` }}
                  role="img"
                  aria-label={`${item.label}: ${item.score}`}
                />
                <span className="text-caption text-content-secondary">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-label font-semibold text-content-primary">
            {t.progress.byMode}
          </h2>
          <div className="mt-3 flex flex-col gap-3">
            {(['laboral', 'universidad', 'idiomas'] as const).map((mode) => {
              const modeStats = stats.byMode[mode]
              return (
                <div
                  key={mode}
                  className="flex items-center justify-between gap-2 rounded-input border border-border bg-background p-3"
                >
                  <div>
                    <p className="text-label font-medium text-content-primary">
                      {t.modes[modeKey(mode)]}
                    </p>
                    <p className="text-caption text-content-secondary">
                      {modeStats?.count ?? 0} {t.progress.sessions}
                    </p>
                  </div>
                  <p className="font-display text-h2 font-semibold text-primary">
                    {modeStats?.averageScore ?? 0}
                  </p>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-label font-semibold text-content-primary">
            {t.progress.skills}
          </h2>
          <div className="mt-4 flex flex-col gap-4">
            <ProgressBar
              value={skills.fluency}
              label={t.progress.fluency}
            />
            <ProgressBar
              value={skills.confidence}
              label={t.progress.confidence}
            />
            <ProgressBar
              value={skills.keywords}
              label={t.progress.keywords}
            />
            <div>
              <div className="flex items-center justify-between text-caption">
                <span className="text-content-secondary">
                  {t.progress.fillerWords}
                </span>
                <span className="font-medium text-content-primary">
                  {skills.filler}
                </span>
              </div>
              <ProgressBar value={skills.fillerScore} className="mt-1.5" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-label font-semibold text-content-primary">
            {t.progress.weekly}
          </h2>
          <div className="mt-4 flex h-44 items-end gap-2">
            {weekly.map((item) => (
              <div
                key={item.day}
                className="flex flex-1 flex-col items-center gap-1.5"
              >
                <span className="text-caption text-content-secondary">
                  {item.minutes}
                </span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-primary to-accent"
                  style={{
                    height: `${Math.max(4, (item.minutes / maxMinutes) * 120)}px`,
                  }}
                  role="img"
                  aria-label={`${item.day}: ${item.minutes} ${t.progress.minutes}`}
                />
                <span className="text-caption text-content-secondary">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-label font-semibold text-content-primary">
            {t.progress.recommendations}
          </h2>
          {recommendations.length === 0 ? (
            <p className="mt-3 text-caption text-content-secondary">
              {t.progress.noRecommendations}
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {recommendations.map((recommendation) => (
                <li
                  key={recommendation}
                  className="rounded-input border border-border bg-background p-3 text-caption text-content-secondary"
                >
                  {recommendation}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="text-label font-semibold text-content-primary">
            {t.progress.achievements}
          </h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {achievements.map((achievement) => {
              const Icon = achievement.icon
              return (
                <div
                  key={achievement.id}
                  className={
                    achievement.unlocked
                      ? 'flex items-start gap-2 rounded-input border border-primary/20 bg-primary/5 p-3'
                      : 'flex items-start gap-2 rounded-input border border-border bg-background p-3 opacity-60'
                  }
                >
                  <span
                    className={
                      achievement.unlocked
                        ? 'flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'
                        : 'flex size-8 shrink-0 items-center justify-center rounded-full bg-surface text-content-secondary'
                    }
                  >
                    <Icon className="size-4" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-caption font-semibold text-content-primary">
                      {achievement.title}
                    </p>
                    <p className="mt-0.5 text-caption text-content-secondary">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
