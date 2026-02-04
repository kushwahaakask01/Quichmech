export interface Mechanic {
    id: number;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    shopName?: string;
    address?: string;
    latitude: number;
    longitude: number;
    specialization?: string;
    yearsOfExperience: number;
    isVerified: boolean;
    isAvailable: boolean;
    hourlyRate: number;
    averageRating: number;
    totalReviews: number;
    distance?: number; // Distance in kilometers
}

export interface MechanicProfile {
    shopName: string;
    address: string;
    latitude: number;
    longitude: number;
    specialization?: string;
    yearsOfExperience: number;
    licenseNumber?: string;
    hourlyRate: number;
}

export interface UpdateAvailability {
    isAvailable: boolean;
}

export interface NearbyMechanicsQuery {
    latitude: number;
    longitude: number;
    radiusKm: number;
    specialization?: string;
    isAvailable?: boolean;
    maxHourlyRate?: number;
    minRating?: number;
}
