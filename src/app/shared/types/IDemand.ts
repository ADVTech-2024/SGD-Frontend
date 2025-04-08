export interface IDemand {
    id: number;
    requestorName: string;
    department: string;
    origin: string;
    zone: 'Rural' | 'Urbana';
    neighborhood: string;
    address: string;
    description: string;
    phone: string;
    observation: string;
    priority: number;
    registrationDate: Date;
    estimatedStartDays: number;
    estimatedTime: string;
    completionDate: Date | null;
    status: string;
    approved: boolean;
    justification: string;
    active: boolean;
}