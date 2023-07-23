export interface DeviceModel {
  device_id: string;
  device_name: string;
  status: boolean;
}

export interface DataPointModel {
  device_id: string;
  sensor_name: string;
  value: number;
  unit: string;
}
