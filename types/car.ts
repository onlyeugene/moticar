export interface Car {
  id: string;
  user: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  vin: string;
  mileage: number;
  entryMethod: "manual" | "scan" | "obd";
  monthlyBudget?: number;
  documents?: CarDocument[];
}

export interface CarDocument {
  type: "MOT" | "Vehicle License" | "Tax" | "Insurance Status";
  status: "active" | "expired" | "pending";
  expiryDate: string;
  fileUrl: string;
}

export interface CarCreateInput {
  make: string;
  carModel: string;
  year: number;
  mileage: number;
  plate?: string;
  vin?: string;
  fuelType?: string;
  color?: string;
  purchaseDate?: string;
  condition?: "Newly Purchased" | "Pre-owned";
  monthlyBudget?: number;
  deviceId?: string;
}

export interface CarUpdateInput {
  mileage?: number;
  plate?: string;
  vin?: string;
  purchaseDate?: string;
  condition?: "Newly Purchased" | "Pre-owned";
  monthlyBudget?: number;
}

export interface CarSearchResponse {
  count: number;
  cars: Array<{
    id?: string;
    make: string;
    model: string;
    year?: number;
    brandKeys?: string;
    [key: string]: any;
  }>;
}

export interface MakesResponse {
  count: number;
  makes: string[];
}

export interface ModelsResponse {
  count: number;
  models: string[];
}

export interface TrimsResponse {
  count: number;
  trims: string[];
}

export interface ScanPhotosInput {
  photos: string[];
}

export interface ScanLicenseInput {
  photoUrl: string;
}

export interface CarDetails {
  details: {
    make: string;
    model: string;
    year: number;
    trim?: string;
    brandKey?: string;
    features: {
      yearOfProduction?: number;
      fuelType?: string;
      transmission?: string;
      engine?: string;
      cylinder?: string;
      horsepower?: string;
      driveType?: string;
      bodyStyle?: string;
      segment?: string;
      fuelCapacity?: string;
      tireSize?: string;
      topSpeed?: string;
      acceleration?: string;
      yearRange?: string;
      bodyColor?: string;
      [key: string]: any;
    };
  };
  recommendedBudget?: number;
}
