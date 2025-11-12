export interface Medicine {
  id: string;
  name: string;
  firstDoseTime: string; // HH:mm format
  intervalHours: number;
  daysOfWeek: DayOfWeek[];
  createdAt: string;
}

export type DayOfWeek = 'L' | 'M' | 'X' | 'J' | 'V' | 'S' | 'D';

export interface DoseHistory {
  id: string;
  medicineId: string;
  medicineName: string;
  scheduledTime: string;
  takenTime: string;
  date: string;
}

export interface ScheduledDose {
  medicineId: string;
  medicineName: string;
  time: string;
  dayOfWeek: DayOfWeek;
  status: 'pending' | 'taken' | 'scheduled';
}
