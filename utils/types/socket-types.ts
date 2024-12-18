import { IBidModel, ISupplierModel, ListingStatus } from './be-model-types';

// Bid types
export type TBidParams = {
  roomId: string;
  lotId: string;
  supplierId: string;
  amount: number;
};

export type TNewBidData = {
  _id: string;
  supplier: ISupplierModel;
  lot: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type TBidErrorData = string | string[];

// Room types
export type TJoinRoomParams = {
  roomId: string;
  supplierId: string;
};

export type TJoinErrorData = string;

export type TJoinedRoomData = {
  roomId: string;
};

// Auction types
export type TAuctionStartedData = {
  listingId: string;
};

export type TAuctionClosedData = {
  winningBid: IBidModel;
  winningSupplier: ISupplierModel;
};

export type TAuctionClosedGeneralData = {
  listingId: string;
  status: ListingStatus;
};

export type TAuctionExtendedData = {
  newEndTime: string;
  serverTime: Date;
};

export type TLotTransitionData = {
  nextLotId: string;
  startTime: string;
  endTime: string;
};

export type TClientConnectData = {
  userId: string;
  socketId: string;
};

export type TClientDisconnectData = {
  userId: string;
  socketId: string;
};

export type TCurrentUsersData = {
  users: ISupplierModel[];
};
