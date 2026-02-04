export enum ServiceRequestStatus {
    Pending = 'Pending',
    Accepted = 'Accepted',
    InProgress = 'InProgress',
    Completed = 'Completed',
    Cancelled = 'Cancelled',
    Rejected = 'Rejected'
}

export interface ServiceRequest {
    id: number;
    customerId: number;
    customerName: string;
    customerPhone: string;
    mechanicId?: number;
    mechanicName?: string;
    mechanicPhone?: string;
    vehicleType: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear?: string;
    issueDescription: string;
    serviceType: string;
    latitude: number;
    longitude: number;
    address?: string;
    status: ServiceRequestStatus;
    requestedAt: Date;
    acceptedAt?: Date;
    completedAt?: Date;
    estimatedCost?: number;
    finalCost?: number;
    notes?: string;
}

export interface CreateServiceRequest {
    vehicleType: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear?: string;
    issueDescription: string;
    serviceType: string;
    latitude: number;
    longitude: number;
    address?: string;
}

export interface UpdateServiceRequestStatus {
    status: ServiceRequestStatus;
    estimatedCost?: number;
    finalCost?: number;
    notes?: string;
    cancellationReason?: string;
}

export interface AssignMechanic {
    mechanicId: number;
}