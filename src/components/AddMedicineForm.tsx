import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Medicine, DayOfWeek } from '@/types/medicine';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AddMedicineFormProps {
  onAdd: (medicine: Omit<Medicine, 'id' | 'createdAt'>) => void;
}

const DAYS: { value: DayOfWeek; label: string }[] = [
  { value: 'L', label: 'L' },
  { value: 'M', label: 'M' },
  { value: 'X', label: 'X' },
  { value: 'J', label: 'J' },
  { value: 'V', label: 'V' },
  { value: 'S', label: 'S' },
  { value: 'D', label: 'D' },
];

export const AddMedicineForm = ({ onAdd }: AddMedicineFormProps) => {
  const [name, setName] = useState('');
  const [firstDoseTime, setFirstDoseTime] = useState('');
  const [intervalHours, setIntervalHours] = useState('');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !firstDoseTime || !intervalHours || selectedDays.length === 0) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    onAdd({
      name,
      firstDoseTime,
      intervalHours: parseInt(intervalHours),
      daysOfWeek: selectedDays,
    });

    // Reset form
    setName('');
    setFirstDoseTime('');
    setIntervalHours('');
    setSelectedDays([]);
    setShowForm(false);
    
    toast({
      title: "Medicamento agregado",
      description: `${name} se ha configurado correctamente`,
    });
  };

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const selectAllDays = () => {
    setSelectedDays(DAYS.map(d => d.value));
  };

  if (!showForm) {
    return (
      <Card className="p-6">
        <Button onClick={() => setShowForm(true)} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Agregar Medicamento
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Nuevo Medicamento</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowForm(false)}
          >
            Cancelar
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nombre del medicamento</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Paracetamol"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Hora de primera dosis</Label>
          <Input
            id="time"
            type="time"
            value={firstDoseTime}
            onChange={(e) => setFirstDoseTime(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="interval">Intervalo (horas)</Label>
          <Input
            id="interval"
            type="number"
            min="1"
            max="24"
            value={intervalHours}
            onChange={(e) => setIntervalHours(e.target.value)}
            placeholder="Ej: 6"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Días de la semana</Label>
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={selectAllDays}
            >
              Todos
            </Button>
          </div>
          <div className="flex gap-2">
            {DAYS.map(day => (
              <div
                key={day.value}
                className={`flex-1 flex items-center justify-center h-10 rounded-md border-2 cursor-pointer transition-colors ${
                  selectedDays.includes(day.value)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input hover:border-primary/50'
                }`}
                onClick={() => toggleDay(day.value)}
              >
                <span className="font-medium">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Guardar Medicamento
        </Button>
      </form>
    </Card>
  );
};
