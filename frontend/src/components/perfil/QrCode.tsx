import { cn } from '../../lib/cn'

const SIZE = 21
const CORNERS: Array<[number, number]> = [
  [0, 0],
  [SIZE - 7, 0],
  [0, SIZE - 7],
]

function inBox(x: number, y: number, ox: number, oy: number) {
  return x >= ox && x < ox + 7 && y >= oy && y < oy + 7
}

function isFinderCell(x: number, y: number) {
  return CORNERS.some(([ox, oy]) => inBox(x, y, ox, oy))
}

function finderIsDark(x: number, y: number) {
  return CORNERS.some(([ox, oy]) => {
    if (!inBox(x, y, ox, oy)) return false
    const lx = x - ox
    const ly = y - oy
    const isBorder = lx === 0 || lx === 6 || ly === 0 || ly === 6
    const isCore = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4
    return isBorder || isCore
  })
}

function pseudoRandom(x: number, y: number) {
  const n = (x * 73856093) ^ (y * 19349663)
  return (n >>> 0) % 100 < 45
}

const cells = Array.from({ length: SIZE * SIZE }, (_, index) => {
  const x = index % SIZE
  const y = Math.floor(index / SIZE)
  const dark = isFinderCell(x, y) ? finderIsDark(x, y) : pseudoRandom(x, y)
  return { x, y, dark }
})

export function QrCode({ label }: { label: 'yape' | 'plin' }) {
  return (
    <div className="relative mx-auto w-40 rounded-input border border-border bg-white p-2">
      <div
        className="grid aspect-square w-full"
        style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
        aria-hidden="true"
      >
        {cells.map(({ x, y, dark }) => (
          <span
            key={`${x}-${y}`}
            className={cn('aspect-square', dark ? 'bg-content-primary' : 'bg-white')}
          />
        ))}
      </div>
      <span
        className={cn(
          'absolute left-1/2 top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg font-display text-label font-bold text-white',
          label === 'yape' ? 'bg-[#7C3AED]' : 'bg-accent',
        )}
        aria-hidden="true"
      >
        {label === 'yape' ? 'Y' : 'P'}
      </span>
    </div>
  )
}
