export interface ApifoxModel<T> {
  code: string;
  message: string;
  data: T;
  total: number;
}

export enum Status {
  ACTIVE = 0,
  INACTIVE = 1,
}

export interface Shelter {
  name: string; 
  contactPerson?: string; // 可选，<= 100 字符
  phone?: string; // 可选，<= 20 字符
  email?: string; // 可选，<= 100 字符
  location: {
    lat: number; // 纬度，必需
    lng: number; // 经度，必需At
  };
  address?: string; // 可选，<= 200 字符
  description?: string; // 可选
  licenseNumber?: string; // 可选，<= 100 字符
  managerId: string; // 必需
  capacity: number; // 必须
  id?: string;
  createdAt?: string; // 可选，date-time 格式
  updatedAt?: string; // 可选，date-time 格式
  distance?: number; // 可选
  currentCatNumber?: number; // 可选 
  status?: string;
  avatar: string; // 可选，<= 200 字符
}