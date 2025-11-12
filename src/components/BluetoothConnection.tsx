import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bluetooth, BluetoothConnected } from 'lucide-react';

interface BluetoothConnectionProps {
  isConnected: boolean;
  deviceName?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const BluetoothConnection = ({
  isConnected,
  deviceName,
  onConnect,
  onDisconnect,
}: BluetoothConnectionProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isConnected ? (
            <BluetoothConnected className="h-6 w-6 text-primary" />
          ) : (
            <Bluetooth className="h-6 w-6 text-muted-foreground" />
          )}
          <div>
            <h3 className="font-semibold">
              {isConnected ? 'Conectado' : 'Sin conexión'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isConnected ? deviceName || 'HC-05' : 'Conectar al Arduino'}
            </p>
          </div>
        </div>
        {isConnected ? (
          <Button variant="outline" onClick={onDisconnect}>
            Desconectar
          </Button>
        ) : (
          <Button onClick={onConnect}>
            Conectar Bluetooth
          </Button>
        )}
      </div>
    </Card>
  );
};
