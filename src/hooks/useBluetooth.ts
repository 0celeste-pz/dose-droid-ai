import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface BluetoothDevice {
  name?: string;
  id: string;
}

export const useBluetooth = () => {
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [characteristic, setCharacteristic] = useState<any>(null);

  const connect = useCallback(async () => {
    try {
      // Request Bluetooth device
      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [{ namePrefix: 'HC-05' }],
        optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb']
      });

      if (!device.gatt) {
        throw new Error('No GATT server available');
      }

      // Connect to GATT server
      const server = await device.gatt.connect();
      
      // Get service
      const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
      
      // Get characteristic
      const char = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');
      
      setCharacteristic(char);
      setDevice({ name: device.name, id: device.id });
      setIsConnected(true);
      
      toast({
        title: "Conectado",
        description: `Conectado exitosamente a ${device.name || 'HC-05'}`,
      });
    } catch (error) {
      console.error('Bluetooth connection error:', error);
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar al dispositivo Bluetooth",
        variant: "destructive",
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    if (device) {
      setDevice(null);
      setIsConnected(false);
      setCharacteristic(null);
      toast({
        title: "Desconectado",
        description: "Dispositivo Bluetooth desconectado",
      });
    }
  }, [device]);

  const sendCommand = useCallback(async (command: string) => {
    if (!characteristic) {
      toast({
        title: "No conectado",
        description: "Debes conectarte al dispositivo primero",
        variant: "destructive",
      });
      return;
    }

    try {
      const encoder = new TextEncoder();
      await characteristic.writeValue(encoder.encode(command + '\n'));
      console.log('Command sent:', command);
    } catch (error) {
      console.error('Error sending command:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el comando",
        variant: "destructive",
      });
    }
  }, [characteristic]);

  return {
    device,
    isConnected,
    connect,
    disconnect,
    sendCommand,
  };
};
