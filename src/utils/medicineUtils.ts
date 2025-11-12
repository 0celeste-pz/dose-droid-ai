import { Medicine, DayOfWeek, ScheduledDose } from '@/types/medicine';

export const DAYS_MAP: Record<DayOfWeek, string> = {
  'L': 'Lunes',
  'M': 'Martes',
  'X': 'Miércoles',
  'J': 'Jueves',
  'V': 'Viernes',
  'S': 'Sábado',
  'D': 'Domingo',
};

export const formatMedicineCommand = (medicine: Medicine): string => {
  const days = medicine.daysOfWeek.join(',');
  return `SET;${medicine.name};${medicine.firstDoseTime};${medicine.intervalHours};${days}`;
};

export const generateWeeklySchedule = (medicines: Medicine[]): ScheduledDose[] => {
  const schedule: ScheduledDose[] = [];
  const daysOrder: DayOfWeek[] = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  medicines.forEach(medicine => {
    medicine.daysOfWeek.forEach(day => {
      // Calculate all doses for this day
      const doses = calculateDosesForDay(medicine);
      doses.forEach(time => {
        schedule.push({
          medicineId: medicine.id,
          medicineName: medicine.name,
          time,
          dayOfWeek: day,
          status: 'scheduled',
        });
      });
    });
  });

  // Sort by day and time
  return schedule.sort((a, b) => {
    const dayDiff = daysOrder.indexOf(a.dayOfWeek) - daysOrder.indexOf(b.dayOfWeek);
    if (dayDiff !== 0) return dayDiff;
    return a.time.localeCompare(b.time);
  });
};

const calculateDosesForDay = (medicine: Medicine): string[] => {
  const doses: string[] = [];
  const [hours, minutes] = medicine.firstDoseTime.split(':').map(Number);
  
  let currentHour = hours;
  let currentMinute = minutes;

  // Generate doses for 24 hours
  while (currentHour < 24) {
    doses.push(`${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`);
    currentHour += medicine.intervalHours;
  }

  return doses;
};

export const formatScheduleForEmail = (schedule: ScheduledDose[]): string => {
  const groupedByMedicine = schedule.reduce((acc, dose) => {
    if (!acc[dose.medicineName]) {
      acc[dose.medicineName] = [];
    }
    acc[dose.medicineName].push(dose);
    return acc;
  }, {} as Record<string, ScheduledDose[]>);

  let emailContent = 'Hola,\n\nAquí está tu cronograma de medicación:\n\n';

  Object.entries(groupedByMedicine).forEach(([medicineName, doses]) => {
    const daysSet = new Set(doses.map(d => DAYS_MAP[d.dayOfWeek]));
    const days = Array.from(daysSet).join(', ');
    const times = [...new Set(doses.map(d => d.time))].join(', ');
    
    emailContent += `- ${medicineName}: ${days} a las ${times}\n`;
  });

  emailContent += '\n¡Cuídate! 💊';

  return emailContent;
};

export const checkNotifications = (
  medicines: Medicine[],
  onNotification: (medicine: Medicine, time: string) => void
): void => {
  const now = new Date();
  const currentDay = ['D', 'L', 'M', 'X', 'J', 'V', 'S'][now.getDay()] as DayOfWeek;
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  medicines.forEach(medicine => {
    if (medicine.daysOfWeek.includes(currentDay)) {
      const doses = calculateDosesForDay(medicine);
      if (doses.includes(currentTime)) {
        onNotification(medicine, currentTime);
      }
    }
  });
};
