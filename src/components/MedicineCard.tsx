import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Medicine } from '@/types/medicine';
import { Clock, Calendar, Trash2 } from 'lucide-react';
import { DAYS_MAP } from '@/utils/medicineUtils';

interface MedicineCardProps {
  medicine: Medicine;
  onDelete: (id: string) => void;
}

export const MedicineCard = ({ medicine, onDelete }: MedicineCardProps) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">{medicine.name}</h3>
          
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Primera dosis: {medicine.firstDoseTime}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Cada {medicine.intervalHours} hora{medicine.intervalHours !== 1 ? 's' : ''}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {medicine.daysOfWeek.length === 7
                  ? 'Todos los días'
                  : medicine.daysOfWeek.map(d => DAYS_MAP[d]).join(', ')}
              </span>
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(medicine.id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
