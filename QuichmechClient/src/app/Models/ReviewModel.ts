export interface Review {
    id: number;
    serviceRequestId: number;
    customerId: number;
    customerName: string;
    mechanicId: number;
    mechanicName: string;
    rating: number;
    comment?: string;
    createdAt: Date;
}

export interface CreateReview {
    serviceRequestId: number;
    rating: number;
    comment?: string;
}
