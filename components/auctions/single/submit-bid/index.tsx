import React, { FC, useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {
  IBidModel,
  ListingStatus,
  TypeOfListing,
} from '@/utils/types/be-model-types';

const SubmitBid: FC<TSubmitBidProps> = ({
  supplierCurrentBid,
  bidPrice,
  setBidPrice,
  handleBidSubmit,
  className,
  bidsForCurrentUser,
  auctionStatus,
  lowestBidAmount,
  auctionType,
}) => {
  // Sort bids by createdAt timestamp
  bidsForCurrentUser.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  const [isPreBidAllowed, setIsPreBidAllowed] = useState<boolean>(false);

  useEffect(() => {
    // Allow pre-bid if the auction is upcoming and no existing bids
    setIsPreBidAllowed(
      auctionStatus === ListingStatus.UPCOMING &&
        bidsForCurrentUser.length === 0,
    );
  }, [auctionStatus, bidsForCurrentUser]);

  const isBidSubmissionEnabled =
    auctionStatus === ListingStatus.IN_PROGRESS || isPreBidAllowed;

  // Get the first and last bids
  const firstBid = bidsForCurrentUser[0];
  const lastBid = bidsForCurrentUser[bidsForCurrentUser.length - 1];
  const auctionDetails = [
    {
      label: 'Your first Bid : ',
      value: firstBid ? `₹${firstBid.amount}` : 'N/A',
    },
    {
      label: 'Your last Bid : ',
      value: lastBid ? `₹${lastBid.amount}` : 'N/A',
    },
  ];

  if (auctionType === TypeOfListing.CLASSIC) {
    auctionDetails.push({
      label: 'Lowest Bid : ',
      value: lowestBidAmount ? `₹${lowestBidAmount}` : 'N/A',
    });
  }

  return (
    <div
      className={` bg-white shadow-lg rounded-sm border border-slate-200 ${className}`}
    >
      <header className="py-4 border-b border-slate-100 text-center">
        <h2 className="font-semibold text-slate-800 ">Place Your Bid</h2>
      </header>
      {auctionStatus === ListingStatus.UPCOMING && !isPreBidAllowed && (
        <Typography
          variant="subtitle2"
          className="text-center text-red-600 font-medium mt-2"
        >
          Please wait for the auction to start to place more bids.
        </Typography>
      )}
      {/* TODO: make the parent flex and add some text to display the first bid and last bid of the supplier */}
      <div className="flex flex-wrap sm:grid-cols-1 w-full gap-4 h-[84%]">
        <div className="px-4 w-[calc(45%-8px)]">
          {auctionDetails.map((bidItem, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 my-4"
            >
              <p className="font-semibold text-gray-700 w-1/2">
                {bidItem.label}
              </p>
              <p className="text-gray-600 font-normal w-1/2 text-left">
                {bidItem.value}
              </p>
            </div>
          ))}
        </div>

        {/* Vertical Separator Line */}
        <div className="hidden sm:block self-stretch w-px bg-gray-300 mx-1 mb-3"></div>

        <div className="px-4 w-[calc(45%-8px)]">
          <Typography
            variant="subtitle2"
            className="text-center font-light mt-2"
          >
            Your current bid is ₹{supplierCurrentBid}
          </Typography>
          <TextField
            label=""
            name="bidPrice"
            type="number"
            value={bidPrice}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setBidPrice(+event.target.value)
            }
            fullWidth
            margin="normal"
            disabled={!isBidSubmissionEnabled}
          />
          <button
            type="button"
            onClick={handleBidSubmit}
            disabled={!isBidSubmissionEnabled}
            className="w-full my-4 sm:w-full md:1/2 middle none center rounded-lg bg-green-500 py-4 px-4 font-sans text-sm font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            Submit Bid
          </button>
        </div>
      </div>
    </div>
  );
};

type TSubmitBidProps = {
  supplierCurrentBid: number;
  bidPrice: number;
  setBidPrice: (value: React.SetStateAction<number>) => void;
  handleBidSubmit: () => void;
  className?: string;
  bidsForCurrentUser: IBidModel[];
  auctionStatus: ListingStatus;
  lowestBidAmount: number | null;
  auctionType: TypeOfListing;
};

export default SubmitBid;
