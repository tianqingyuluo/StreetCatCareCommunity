export interface ApifoxModel<T> {
  code: string;
  message: string;
  data: T;
  total: number;
}

export enum Status {
  OPEN = 0,
  CLOSED = 1,
  FULL = 2,
}

export interface Shelter {
  id: number;
  name: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  capacity: number;
  currentOccupancy: number;
  status: Status;
  createTime: string;
  updateTime: string;
  location: {
    lat: number;
    lng: number;
  };
}