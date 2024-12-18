import {
  IBidModel,
  IBuyerModel,
  IListingModel,
  ILotItemModel,
  ILotModel,
  IProductModel,
  ISupplierModel,
  ItermsAndConditionModel,
} from './be-model-types';

// Server time
export interface IServerTimeResponse {
  serverTime: Date;
}

// Listing
export interface IListingResponse {
  data: IListingModel[];
  status: number;
}

export interface ISingleListingResponse {
  data: IListingModel;
  status: number;
}

export interface ICreateListingResponse {
  data: IListingModel;
  status: number;
}

export interface ITermsAndConditionResponse {
  data: ItermsAndConditionModel;
  status: number;
}

// Bid
export interface IBidsResponse {
  data: IBidModel[];
  status: number;
}

// Buyer
export interface ISingleBuyerResponse {
  data: IBuyerModel;
  status: number;
}

// Supplier
export interface ISuppliersResponse {
  data: ISupplierModel[];
  status: number;
}

export interface ICreateSupplierResponse {
  data: ISupplierModel;
  status: number;
}

export interface ISingleSupplierResponse {
  data: ISupplierModel;
  status: number;
}

// Product
export interface ICreateProductResponse {
  data: IProductModel;
  status: number;
}

// Lot Item
export interface ICreateLotItemResponse {
  data: ILotItemModel;
  status: number;
}

// Lot
export interface ICreateLotResponse {
  data: ILotModel;
  status: number;
}
