export interface CreateStaffParams {
    email?: string;
    hiredAt?: Date;
    phone?: string;
    realName: string;
    shelterId: number;
    /**
     * 由 /api/admin/create-account 返回的 userId
     */
    userId: number;
    [property: string]: any;
}