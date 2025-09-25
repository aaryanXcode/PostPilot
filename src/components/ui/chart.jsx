"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("w-full", className)} {...props} />
))
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef(({ className, ...props }, ref) => (
  <RechartsPrimitive.Tooltip
    ref={ref}
    content={({ active, payload, label }) => {
      if (!active || !payload?.length) return null

      return (
        <div className="rounded-lg border bg-background p-2 shadow-md">
          <div className="grid gap-2">
            <div className="grid gap-1.5">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm font-medium">{label}</span>
              </div>
              {payload.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="h-2 w-2 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }}
    className={cn("", className)}
    {...props}
  />
))
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef(({ className, ...props }, ref) => (
  <RechartsPrimitive.Legend
    ref={ref}
    content={({ payload }) => {
      if (!payload?.length) return null

      return (
        <div className="flex items-center justify-center gap-4">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="h-2 w-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      )
    }}
    className={cn("", className)}
    {...props}
  />
))
ChartLegendContent.displayName = "ChartLegendContent"

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
}
