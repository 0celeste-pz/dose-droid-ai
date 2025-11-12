import { Card } from '@/components/ui/card';
import { DoseHistory } from '@/types/medicine';
import { CheckCircle2, Clock, History } from 'lucide-react';

interface MedicineHistoryProps {
  history: DoseHistory[];
}

export const MedicineHistory = ({ history }: MedicineHistoryProps) => {
  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.takenTime).getTime() - new Date(a.takenTime).getTime()
  );

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <History className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Historial</h2>
      </div>

      <div className="space-y-3">
        {sortedHistory.map(entry => (
          <div
            key={entry.id}
            className="flex items-start gap-3 p-3 bg-card border rounded-lg hover:shadow-sm transition-shadow"
          >
            <CheckCircle2 className="h-5 w-5 text-taken mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium">{entry.medicineName}</div>
              <div className="text-sm text-muted-foreground space-y-0.5">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>Programada: {entry.scheduledTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Tomada: {new Date(entry.takenTime).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {history.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No hay historial de tomas aún
        </div>
      )}
    </Card>
  );
};
