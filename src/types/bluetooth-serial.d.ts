declare module 'capacitor-bluetooth-serial' {
  export interface BluetoothDevice {
    name: string;
    address: string;
    id?: string;
  }

  export interface BluetoothSerial {
    isEnabled(): Promise<{ value: boolean }>;
    enable(): Promise<void>;
    list(): Promise<{ devices: BluetoothDevice[] }>;
    connect(options: { address: string }): Promise<void>;
    disconnect(): Promise<void>;
    write(options: { data: string }): Promise<void>;
    read(): Promise<{ data: string }>;
    isConnected(): Promise<{ value: boolean }>;
  }

  export const BluetoothSerial: BluetoothSerial;
}
