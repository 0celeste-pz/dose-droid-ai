import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial';

interface BluetoothDevice {
  name?: string;
  id: string;
}

export const useBluetooth = () => {
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(async () => {
    try {
      // Request Bluetooth permissions
      const enabled = await BluetoothSerial.isEnabled();
      if (!enabled) {
        await BluetoothSerial.enable();
      }

      // List available devices
      const devices = await BluetoothSerial.list();
      
      // Find HC-05 device
      const hc05 = devices.find(d => 
        d.name?.includes('HC-05') || d.address?.includes('HC-05')
      );

      if (!hc05) {
        toast({
          title: "Dispositivo no encontrado",
          description: "No se encontró el módulo HC-05. Asegúrate de que esté emparejado en la configuración de Bluetooth.",
          variant: "destructive",
        });
        return;
      }

      // Connect to device
      await BluetoothSerial.connect(hc05.address);
      
      setDevice({ name: hc05.name || 'HC-05', id: hc05.address });
      setIsConnected(true);
      
      toast({
        title: "Conectado",
        description: `Conectado exitosamente a ${hc05.name || 'HC-05'}`,
      });
    } catch (error) {
      console.error('Bluetooth connection error:', error);
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar al dispositivo Bluetooth. Asegúrate de que esté emparejado.",
        variant: "destructive",
      });
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (isConnected) {
      try {
        await BluetoothSerial.disconnect();
      } catch (error) {
        console.error('Disconnect error:', error);
      }
      setDevice(null);
      setIsConnected(false);
      toast({
        title: "Desconectado",
        description: "Dispositivo Bluetooth desconectado",
      });
    }
  }, [isConnected]);

  const sendCommand = useCallback(async (command: string) => {
    if (!isConnected) {
      toast({
        title: "No conectado",
        description: "Debes conectarte al dispositivo primero",
        variant: "destructive",
      });
      return;
    }

    try {
      await BluetoothSerial.write(command + '\n');
      console.log('Command sent:', command);
    } catch (error) {
      console.error('Error sending command:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el comando",
        variant: "destructive",
      });
    }
  }, [isConnected]);

  return {
    device,
    isConnected,
    connect,
    disconnect,
    sendCommand,
  };
};
