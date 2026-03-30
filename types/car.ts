export interface Car {
  _id: string;
  id?: string;
  user: string;
  make: string;
  carModel: string;
  model?: string;
  year: number;
  plate: string;
  vin: string;
  mileage: number;
  entryMethod: "manual" | "scan" | "obd";
  monthlyBudget?: number;
  documents?: CarDocument[];
  createdAt?: string;
  updatedAt?: string;
  color?: string;
  condition?: string;
  status?: string;
  purchaseDate?: string;
  currency?: string;
  engineOil?: {
    capacityLiters: number;
    recommendedGrade: string;
    reputableBrands?: string[];
  };
  fuelSpec?: {
    capacityLiters: number;
    avgPriceRange: number;
    reputableStations?: string[];
  };
  tyreSpec?: {
    size: string;
    recommendedPressurePsi: string;
    manufacturers?: string[];
  };
  brakePads?: {
    thicknessMm: number;
    estLifespanMiles: string;
    reputableBrands?: string[];
  };
  batterySpec?: {
    voltage: string;
    providers: string[];
  };
  bodyStyle?: string;
  fuelType?: string;
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
  condition?: "Newly Purchased" | "Used";
  monthlyBudget?: number;
  deviceId?: string;
  // Technical Specs
  bodyStyle?: string;
  engineDesc?: string;
  transmission?: string;
  driveType?: string;
  segment?: string;
  cylinder?: string;
  horsepower?: string;
  fuelCapacity?: string;
  tireSize?: string;
  topSpeed?: string;
  acceleration?: string;
  brakesFront?: string;
  brakesRear?: string;
  yearRange?: string;
  doors?: number;
  entryMethod?: "manual" | "ai_scan";
}

export interface CarUpdateInput {
  mileage?: number;
  plate?: string;
  vin?: string;
  purchaseDate?: string;
  condition?: "Newly Purchased" | "Used";
  monthlyBudget?: number;
  bodyStyle?: string;
  engineDesc?: string;
  transmission?: string;
  driveType?: string;
  segment?: string;
  cylinder?: string;
  horsepower?: string;
  fuelCapacity?: string;
  tireSize?: string;
  topSpeed?: string;
  acceleration?: string;
  brakesFront?: string;
  brakesRear?: string;
  yearRange?: string;
}

export interface CarSearchResponse {
  count: number;
  cars: Array<{
    id?: string;
    make: string;
    model: string;
    year?: number;
    brandKeys?: string;
    availableYears?: number[];
    availableFuelTypes?: string[];
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


export interface ValuationResponse {
  estimatedValue: number;
  highestValuationAvg: number;
  aiReasoning: string;
  currency: string;
  scores: {
    makeAndYear: string;
    model: string;
    mileageRecorded: string;
    durationOfOwnership: string;
    faultsHistory: string;
    modifications: string;
  };
  assumptions: string[];
}