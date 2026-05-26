import { useState, useMemo } from "react"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CalendarProps {
  mode?: "single"
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  initialFocus?: boolean
  locale?: any
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}

function Calendar({
  mode = "single",
  selected,
  onSelect,
  disabled,
  weekStartsOn = 1,
  className,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(selected || new Date())

  const dayNames = useMemo(() => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    if (weekStartsOn === 1) {
      return [...days.slice(1), days[0]]
    }
    return days
  }, [weekStartsOn])

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    let firstDayOfWeek = firstDay.getDay()
    if (weekStartsOn === 1) {
      firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
    }
    
    const daysInMonth = lastDay.getDate()
    
    const days: Array<{
      date: Date
      isCurrentMonth: boolean
      key: string
    }> = []
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -firstDayOfWeek + i + 1)
      days.push({
        date: prevMonthDay,
        isCurrentMonth: false,
        key: `prev-${i}`
      })
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push({
        date,
        isCurrentMonth: true,
        key: `current-${day}`
      })
    }
    
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonthDay = new Date(year, month + 1, i)
      days.push({
        date: nextMonthDay,
        isCurrentMonth: false,
        key: `next-${i}`
      })
    }
    
    return days
  }, [currentDate, weekStartsOn])

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  const handleDateClick = (date: Date) => {
    if (disabled && disabled(date)) return
    onSelect?.(date)
  }

  return (
    <div className={cn("p-3", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousMonth}
          className="h-7 w-7 p-0"
        >
          <CaretLeft size={16} weight="bold" />
        </Button>
        <div className="text-sm font-medium capitalize">
          {monthName}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextMonth}
          className="h-7 w-7 p-0"
        >
          <CaretRight size={16} weight="bold" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground h-9 flex items-center justify-center"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map(({ date, isCurrentMonth, key }) => {
          const isToday = isSameDay(date, today)
          const isSelected = selected && isSameDay(date, selected)
          const isDisabled = disabled ? disabled(date) : false

          return (
            <button
              key={key}
              onClick={() => handleDateClick(date)}
              disabled={isDisabled}
              className={cn(
                "h-9 w-9 rounded-md text-sm font-normal transition-colors",
                "flex items-center justify-center",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                !isCurrentMonth && "text-muted-foreground/40",
                isDisabled && "text-muted-foreground/20 cursor-not-allowed hover:bg-transparent",
                isToday && !isSelected && "bg-accent text-accent-foreground font-medium",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground font-medium"
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { Calendar }
