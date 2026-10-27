import { Card } from '../components/ui/Card'

export interface PlaceholderPageProps {
  title: string
  description?: string
  owner?: string
}

export function PlaceholderPage({
  title,
  description,
  owner,
}: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1>{title}</h1>
        {description && (
          <p className="mt-1 text-body text-content-secondary">{description}</p>
        )}
      </div>

      <Card className="p-6">
        <p className="text-label text-content-secondary">En construcción</p>
        {owner && <p className="mt-1 text-body text-content-primary">{owner}</p>}
      </Card>
    </div>
  )
}
