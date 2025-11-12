import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScheduledDose } from '@/types/medicine';
import { DAYS_MAP } from '@/utils/medicineUtils';
import { Mail, Calendar } from 'lucide-react';

interface WeeklyScheduleProps {
  schedule: ScheduledDose[];
  onSendEmail: () => void;
}

export const WeeklySchedule = ({ schedule, onSendEmail }: WeeklyScheduleProps) => {
  const groupedByDay = schedule.reduce((acc, dose) => {
    if (!acc[dose.dayOfWeek]) {
      acc[dose.dayOfWeek] = [];
    }
    acc[dose.dayOfWeek].push(dose);
    return acc;
  }, {} as Record<string, ScheduledDose[]>);

  const daysOrder = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Cronograma Semanal</h2>
        </div>
        <Button onClick={onSendEmail} size="sm">
          <Mail className="mr-2 h-4 w-4" />
          Enviar por Email
        </Button>
      </div>

      <div className="space-y-4">
        {daysOrder.map(dayKey => {
          const doses = groupedByDay[dayKey as keyof typeof groupedByDay] || [];
          if (doses.length === 0) return null;

          return (
            <div key={dayKey} className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">{DAYS_MAP[dayKey as keyof typeof DAYS_MAP]}</h3>
              <div className="space-y-2">
                {doses.map((dose, idx) => (
                  <div
                    key={`${dose.medicineId}-${dose.time}-${idx}`}
                    className="flex items-center justify-between py-2 px-3 bg-secondary/50 rounded-md"
                  >
                    <div>
                      <span className="font-medium">{dose.medicineName}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {dose.time}
                      </span>
                    </div>
                    <div className={`h-2 w-2 rounded-full bg-${dose.status}`} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {schedule.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No hay medicamentos programados aún
        </div>
      )}
    </Card>
  );
};
