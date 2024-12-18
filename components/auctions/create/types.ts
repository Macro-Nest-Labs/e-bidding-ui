import { Dayjs } from 'dayjs';

export interface IProductPayload {
  name: string;
  description?: string;
}

export interface ILotItemPayload {
  product: IProductPayload;
  qty: number;
  uom: string;
}

export interface ILotPayload {
  lotItems: ILotItemPayload[];
  lotPrice: number;
  category: string;
}

export type IFormData = {
  name: string;
  description: string;
  typeOfListing: string;
  region: string;
  deptCode: string;
  businessUnit: string;
  startDate: Dayjs | null;
  startTime: Dayjs | string | null;
  duration: Dayjs | string | null;
  contractDuration: '';
  bidDecrementPercentage: number;
  currency: string;
  projectOwner: string;
  phoneNumber: string;
  requiresSupplierLogin: boolean;
  suppliers: string[];
  rules: string[];
  category: string;
  lotPrice: number;
  startingBidPrice: number;
};

export type ITermsAndConditionData = {
  priceBasis: string;
  taxesAndDuties: string;
  delivery: string;
  paymentTerms: string;
  warrantyGurantee: string;
  inspectionRequired: boolean;
  otherTerms: string;
  awardingDecision: string;
};

export interface APIResponse {
  data: {
    _id: string;
    [key: string]: any;
    // ... other fields if needed
  };
  // ... other fields in your API response if needed
}
