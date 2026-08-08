import { useMemo } from 'react'
import { criticalityColor } from '@/lib/display.ts'
import type { Application, Resource } from '@/types'

interface ApplicationGraphProps {
  application: Application
  resources: Resource[]
}

const SIZE = 440
const CENTER = SIZE / 2
const RADIUS = 160
const NODE_RADIUS = 26
const CENTER_RADIUS = 42

export function ApplicationGraph({ application, resources }: ApplicationGraphProps) {
  const nodes = useMemo(() => {
    const count = resources.length
    return resources.map((resource, index) => {
      const angle = (2 * Math.PI * index) / Math.max(count, 1) - Math.PI / 2
      return {
        resource,
        x: CENTER + RADIUS * Math.cos(angle),
        y: CENTER + RADIUS * Math.sin(angle),
      }
    })
  }, [resources])

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={`Graph of ${application.name} connected to ${resources.length} resources`}
      className="h-auto w-full"
    >
      {nodes.map(({ resource, x, y }) => (
        <line
          key={`edge-${resource.id}`}
          x1={CENTER}
          y1={CENTER}
          x2={x}
          y2={y}
          stroke="var(--color-border)"
          strokeWidth={1.5}
        />
      ))}

      {nodes.map(({ resource, x, y }) => {
        const labelAbove = y < CENTER

        return (
          <g key={resource.id}>
            <circle
              cx={x}
              cy={y}
              r={NODE_RADIUS}
              fill="var(--color-surface)"
              stroke={criticalityColor(resource.criticality)}
              strokeWidth={2.5}
            />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={9}
              fontWeight={600}
              fill="var(--color-foreground)"
            >
              {resource.provider}
            </text>
            <text
              x={x}
              y={labelAbove ? y - NODE_RADIUS - 6 : y + NODE_RADIUS + 14}
              textAnchor="middle"
              fontSize={10}
              fill="var(--color-muted-foreground)"
            >
              {resource.name.length > 16 ? `${resource.name.slice(0, 15)}…` : resource.name}
            </text>
          </g>
        )
      })}

      <circle cx={CENTER} cy={CENTER} r={CENTER_RADIUS} fill="var(--color-primary)" />
      <text
        x={CENTER}
        y={CENTER}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={10}
        fontWeight={700}
        fill="var(--color-primary-foreground)"
      >
        {application.name.length > 13 ? `${application.name.slice(0, 12)}…` : application.name}
      </text>
    </svg>
  )
}
