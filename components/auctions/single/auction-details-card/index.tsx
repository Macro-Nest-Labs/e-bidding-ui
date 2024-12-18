import React, { FC } from 'react';

import {
  getFormattedDate,
  getFormattedTimeInAMPM,
} from '@/utils/functions/date';
import { IListingModel } from '@/utils/types/be-model-types';

const AuctionDetailsCard: FC<TAuctionDetailsCardProps> = ({
  auction,
  className,
  activeLotIndex,
  isSupplier = false,
}) => {
  const auctionDetails = [
    {
      label: 'Name',
      value: auction.name,
    },
    {
      label: 'Project Owner',
      value: auction.projectOwner,
    },
    {
      label: 'Status',
      value: auction.status,
    },
    {
      label: 'Type of Listing',
      value: auction?.typesOfListing,
    },
    {
      label: 'Start Date',
      value: getFormattedDate(auction.startDate),
    },
    {
      label: 'Start Time',
      value: getFormattedTimeInAMPM(auction.startTime),
    },
    {
      label: 'Number of Lots',
      value: auction.lots.length,
    },
    {
      label: 'Duration',
      value: auction.duration,
    },
    {
      label: 'Current Lot',
      value: activeLotIndex + 1,
    },
    {
      label: 'Bid Decrement Percentage',
      value: `${auction.bidDecrementPercentage} %`,
    },
    {
      label: 'Business Unit',
      value: auction.businessUnit,
    },
    {
      label: 'Department Code',
      value: auction.departmentCode,
    },
  ];

  if (!isSupplier) {
    auctionDetails.push({
      label: 'Current Lot Price',
      value: auction.lots[activeLotIndex].lotPrice,
    });
  }

  return (
    <div
      className={`bg-white shadow-lg rounded-sm border border-slate-200 p-4 font-sans ${className}`}
    >
      <header className="py-2 border-b border-slate-100 text-center">
        <h2 className="font-semibold text-slate-800 ">Auction Details</h2>
      </header>
      {auctionDetails.map((listItem, index) => (
        <React.Fragment key={index}>
          <div
            className={`flex justify-between items-center py-2 ${
              index < auctionDetails.length - 1 ? 'border-b' : ''
            } border-gray-300`}
          >
            <strong className="font-bold text-gray-700 w-1/3">
              {listItem.label}
            </strong>
            <p className="text-gray-600 font-normal w-1/2 text-left">
              {listItem.value}
            </p>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

type TAuctionDetailsCardProps = {
  auction: IListingModel;
  className?: string;
  activeLotIndex: number;
  isSupplier?: boolean;
};

export default AuctionDetailsCard;
