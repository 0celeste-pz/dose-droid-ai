import { useState, useEffect } from 'react';
import { Medicine, DoseHistory } from '@/types/medicine';
import { useBluetooth } from '@/hooks/useBluetooth';
import { BluetoothConnection } from '@/components/BluetoothConnection';
import { AddMedicineForm } from '@/components/AddMedicineForm';
import { MedicineCard } from '@/components/MedicineCard';
import { WeeklySchedule } from '@/components/WeeklySchedule';
import { MedicineHistory } from '@/components/MedicineHistory';
import { Card } from '@/components/ui/card';
import { formatMedicineCommand, generateWeeklySchedule, formatScheduleForEmail } from '@/utils/medicineUtils';
import { toast } from '@/hooks/use-toast';
import { Pill } from 'lucide-react';

const Index = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [history, setHistory] = useState<DoseHistory[]>([]);
  const { isConnected, device, connect, disconnect, sendCommand } = useBluetooth();

  // Load from localStorage
  useEffect(() => {
    const savedMedicines = localStorage.getItem('medicines');
    const savedHistory = localStorage.getItem('history');
    if (savedMedicines) setMedicines(JSON.parse(savedMedicines));
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history));
  }, [history]);

  const handleAddMedicine = (medicineData: Omit<Medicine, 'id' | 'createdAt'>) => {
    const newMedicine: Medicine = {
      ...medicineData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setMedicines(prev => [...prev, newMedicine]);

    // Send command to Arduino
    if (isConnected) {
      const command = formatMedicineCommand(newMedicine);
      sendCommand(command);
    } else {
      toast({
        title: "No conectado",
        description: "Conecta el Bluetooth para enviar el comando al Arduino",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
    toast({
      title: "Medicamento eliminado",
      description: "El medicamento ha sido eliminado del sistema",
    });
  };

  const handleDoseTaken = (medicineId: string) => {
    const medicine = medicines.find(m => m.id === medicineId);
    if (!medicine) return;

    const now = new Date();
    const newHistoryEntry: DoseHistory = {
      id: Date.now().toString(),
      medicineId,
      medicineName: medicine.name,
      scheduledTime: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
      takenTime: now.toISOString(),
      date: now.toDateString(),
    };

    setHistory(prev => [...prev, newHistoryEntry]);
    
    // Send TOMADA command to Arduino
    if (isConnected) {
      sendCommand('TOMADA');
    }

    toast({
      title: "Dosis registrada",
      description: `${medicine.name} - Tomada confirmada`,
    });
  };

  const handleSendEmail = () => {
    const schedule = generateWeeklySchedule(medicines);
    const emailContent = formatScheduleForEmail(schedule);
    
    // For now, just show the content. We'll implement email sending with Lovable Cloud later
    console.log('Email content:', emailContent);
    
    toast({
      title: "Email preparado",
      description: "Para enviar emails automáticos, necesitamos configurar el backend",
    });
  };

  const schedule = generateWeeklySchedule(medicines);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-taken flex items-center justify-center">
              <Pill className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Dispensador Inteligente</h1>
              <p className="text-sm text-muted-foreground">Gestión de medicamentos con Arduino</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <BluetoothConnection
              isConnected={isConnected}
              deviceName={device?.name}
              onConnect={connect}
              onDisconnect={disconnect}
            />

            <AddMedicineForm onAdd={handleAddMedicine} />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Medicamentos Configurados</h2>
              {medicines.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                  No hay medicamentos configurados aún
                </Card>
              ) : (
                medicines.map(medicine => (
                  <MedicineCard
                    key={medicine.id}
                    medicine={medicine}
                    onDelete={handleDeleteMedicine}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <WeeklySchedule
              schedule={schedule}
              onSendEmail={handleSendEmail}
            />

            <MedicineHistory history={history} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
