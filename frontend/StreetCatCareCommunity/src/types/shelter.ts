import { location } from './commonTypes';

interface shelter {
    name: string;
    cotactPerson: string;
    phone: string;
    email: string;
    location: location;
    address: string;
    description: string;
    lisenceNumber: string;
    managerId: string;
    capacity: number;
    id: string;
    createdAt: string;
    updatedAt: string;
    distance: number;
    currentCatNumber: number;
    status: string;
    avatar?: string;
}

interface shelterList {
    shelters: shelter[];
}

interface createShelter {
    name: string;
    contactPerson: string;
    phone: string;
    email: string;
    location: location;
    address: string;
    description: string;
    lisenceNumber: string;
    managerId: string;
    capacity: number;
    avatar?: string;
}

interface updateShelter {
    name: string;
    contactPerson: string;
    phone: string;
    email: string;
    location: location;
    address: string;
    description: string;
    lisenceNumber: string;
    managerId: string;
    capacity: number;
    avatar?: string;
}

export type { shelter, shelterList, createShelter, updateShelter };