export enum ListingStatus {
  // eslint-disable-next-line no-unused-vars
  UPCOMING = 'Upcoming',
  IN_PROGRESS = 'In Progress',
  CLOSED = 'Closed',
}

export enum TypeOfListing {
  CLASSIC = 'classic',
}

export enum LotStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  CLOSED = 'Closed',
}

export interface ICategory {
  _id: string;
  uuid: string;
  name: string;
  description: string;
  __v: number;
}

export interface IListingModel {
  status: ListingStatus;
  requiresSupplierLogin: boolean;
  _id: string;
  uuid: string;
  buyer: IBuyerModel;
  name: string;
  slug: string;
  region: string;
  departmentCode: string;
  businessUnit: string;
  currency: string;
  startDate: string;
  startTime: string;
  duration: string;
  description: string;
  typesOfListing: TypeOfListing;
  projectOwner: string;
  contractDuration: string;
  bidDecrementPercentage: number;
  rules: any[];
  suppliers: ISupplierModel[];
  lots: ILotModel[];
  activeLot: string;
  activeLotEndTime: Date;
  nextLot: string | null;
  __v: number;
}

export interface IBuyerModel {
  _id: string;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  __v: number;
}

export interface ISupplierModel {
  _id: string;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  __v: number;
}

export interface ILotModel {
  _id: string;
  lotItems: ILotItemModel[];
  lotPrice: number;
  category: ICategory;
  status: LotStatus;
  startTime: Date;
  duration: string;
  __v: number;
}

export interface ILotItemModel {
  qty: number;
  product: IProductModel;
  uom: string;
  _id: string;
  __v: number;
}

export interface IBidModel {
  _id: string;
  supplier: ISupplierModel;
  lot: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IBuyerModel {
  _id: string;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  __v: number;
}

export interface IProductModel {
  uuid: string;
  name: string;
  description: string;
  _id: string;
  __v: number;
}

export interface ItermsAndConditionModel {
  listing: string;
  priceBasis: string;
  taxesAndDuties: string;
  delivery: string;
  paymentTerms: string;
  warrantyGurantee: string;
  inspectionRequired: boolean;
  otherTerms: string;
  awardingDecision: string;
}
