import { IBidModel } from '../types/be-model-types';

export const findLowestBid = (bids: IBidModel[]) => {
  if (bids.length === 0) return null; // Return null if no bids

  let lowestBid = bids[0].amount; // Initialize with the first bid amount

  // Iterate through the bids to find the lowest
  bids.forEach((bid) => {
    if (bid.amount < lowestBid) {
      lowestBid = bid.amount;
    }
  });

  return lowestBid;
};
