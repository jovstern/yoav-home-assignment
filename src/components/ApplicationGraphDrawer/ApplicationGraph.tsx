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

/**
 * Plain SVG hub-and-spoke layout — the graph is always a single
 * Application node with resource nodes arranged radially around it, which
 * doesn't need a general-purpose graph library's layout engine.
 */
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
        // The spoke line runs from the hub to this node, so it touches
        // whichever side of the circle faces the hub. For nodes above the
        // hub that's the bottom of the circle - the same side the label
        // normally sits on - so the line would cut through the label text.
        // Flip the label above the node in that case instead.
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
