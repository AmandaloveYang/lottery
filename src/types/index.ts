export interface Participant {
    id: string;
    name: string;
    department: string;
    employeeId: string;
}

export interface Prize {
    id: string;
    name: string;
    count: number;
    level: number;
}

export interface WinnerRecord {
    participant: Participant;
    prize: Prize;
    timestamp: Date;
} 