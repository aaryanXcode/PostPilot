"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function Calendar24({ onConfirm }) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState(null)
  const [time, setTime] = React.useState("10:30:00")

  const handleConfirm = () => {
    if (!date) return
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const day = String(date.getDate()).padStart(2, '0');

    const dateString = `${year}-${month}-${day}`;
    const dateTime = `${dateString}T${time}`;
    // Build ISO datetime string
    // const dateString = date.toISOString().split("T")[0] // YYYY-MM-DD
    // const dateTime = `${dateString}T${time}`           // combine date + time
    onConfirm?.(dateTime)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-1"
        >
          <ChevronDownIcon className="w-4 h-4" />
          Schedule
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 space-y-4" align="start">
        {/* Date Picker */}
        <div className="flex flex-col gap-2">
          <Label>Date</Label>
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={setDate}
          />
        </div>

        {/* Time Picker */}
        <div className="flex flex-col gap-2">
          <Label>Time</Label>
          <Input
            type="time"
            step="1"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        {/* Confirm button */}
        <Button onClick={handleConfirm} disabled={!date}>
          Confirm
        </Button>
      </PopoverContent>
    </Popover>
  )
}
