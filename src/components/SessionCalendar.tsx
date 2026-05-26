import { useState, useMemo } from 'react';
import { PracticeSession } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CaretLeft, CaretRight, CalendarBlank } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { getLocalDateString } from '@/lib/helpers';

interface SessionCalendarProps {
  sessions: PracticeSession[];
  onDateClick?: (date: Date, sessions: PracticeSession[]) => void;
}

export function SessionCalendar({ sessions, onDateClick }: SessionCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const sessionsByDate = useMemo(() => {
    const map = new Map<string, PracticeSession[]>();
    sessions.forEach(session => {
      const sessionDate = new Date(session.date);
      const dateKey = getLocalDateString(sessionDate);
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(session);
    });
    return map;
  }, [sessions]);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const firstDayOfWeek = firstDay.getDay();
    const startPadding = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    const daysInMonth = lastDay.getDate();
    
    const days: Array<{
      date: Date | null;
      isCurrentMonth: boolean;
      sessions: PracticeSession[];
      key: string;
    }> = [];
    
    for (let i = 0; i < startPadding; i++) {
      const prevMonthDay = new Date(year, month, -startPadding + i + 1);
      const dateKey = getLocalDateString(prevMonthDay);
      days.push({
        date: prevMonthDay,
        isCurrentMonth: false,
        sessions: sessionsByDate.get(dateKey) || [],
        key: `prev-${i}`
      });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = getLocalDateString(date);
      days.push({
        date,
        isCurrentMonth: true,
        sessions: sessionsByDate.get(dateKey) || [],
        key: `current-${day}`
      });
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonthDay = new Date(year, month + 1, i);
      const dateKey = getLocalDateString(nextMonthDay);
      days.push({
        date: nextMonthDay,
        isCurrentMonth: false,
        sessions: sessionsByDate.get(dateKey) || [],
        key: `next-${i}`
      });
    }
    
    return days;
  }, [currentDate, sessionsByDate]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = getLocalDateString(new Date());

  const getIntensityColor = (sessionCount: number) => {
    if (sessionCount === 0) return '';
    if (sessionCount === 1) return 'bg-accent/30';
    if (sessionCount === 2) return 'bg-accent/60';
    return 'bg-accent';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <CalendarBlank size={24} weight="duotone" className="text-primary" />
              Practice Calendar
            </CardTitle>
            <CardDescription>Days you completed sessions</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousMonth}
              className="h-8 w-8 p-0"
            >
              <CaretLeft size={16} weight="bold" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToToday}
              className="text-sm font-semibold min-w-[140px]"
            >
              {monthName}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextMonth}
              className="h-8 w-8 p-0"
            >
              <CaretRight size={16} weight="bold" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-muted-foreground mb-2">
            <div>Lun</div>
            <div>Mar</div>
            <div>Mié</div>
            <div>Jue</div>
            <div>Vie</div>
            <div>Sáb</div>
            <div>Dom</div>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map(({ date, isCurrentMonth, sessions: daySessions, key }) => {
              if (!date) return <div key={key} />;
              
              const dateKey = getLocalDateString(date);
              const isToday = dateKey === today;
              const hasSession = daySessions.length > 0;
              
              return (
                <button
                  key={key}
                  onClick={() => hasSession && onDateClick?.(date, daySessions)}
                  disabled={!hasSession}
                  className={cn(
                    "aspect-square rounded-lg text-sm font-medium transition-all relative",
                    "flex items-center justify-center",
                    isCurrentMonth ? "text-foreground" : "text-muted-foreground/40",
                    hasSession ? "cursor-pointer hover:scale-110 hover:shadow-lg" : "cursor-default",
                    isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                    !hasSession && "bg-muted/30",
                    hasSession && getIntensityColor(daySessions.length)
                  )}
                >
                  <span className={cn(
                    hasSession && "text-accent-foreground font-bold"
                  )}>
                    {date.getDate()}
                  </span>
                  {hasSession && daySessions.length > 1 && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-accent-foreground/80" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-4 pt-4 text-xs text-muted-foreground border-t">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-accent/30" />
              <span>1 session</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-accent/60" />
              <span>2 sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-accent" />
              <span>3+ sessions</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
