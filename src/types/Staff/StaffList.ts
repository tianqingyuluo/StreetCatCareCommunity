export interface Response {
    records?: StaffResponse1[];
    total?: number;
    [property: string]: any;
}

/**
 * StaffResponse1
 */
export interface StaffResponse1 {
    createdAt?: Date;
    email?: string;
    hiredAt?: Date;
    hireStatus?: HireStatus;
    id?: string;
    phone?: string;
    realName: string;
    shelterId: string;
    updatedAt?: Date;
    /**
     * 由 /api/admin/create-account 返回的 userId
     */
    userId: string;
    [property: string]: any;
}

export enum HireStatus {
    Onboard = "ONBOARD",
    Resigned = "RESIGNED",
    Suspended = "SUSPENDED",
}