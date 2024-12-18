import React, { FC } from 'react';

const AuctionDetailsCardHeader: FC<TAuctionDetailsCardHeaderProps> = ({
  auctionName,
  timeRemaining,
}) => {
  return (
    <header className="px-5 py-4 border-b border-slate-100 flex justify-between flex-col sm:flex-row text-lg">
      <h2 className="font-semibold text-slate-800 ">
        Auction Name : {auctionName ?? '-'}
      </h2>
      <div>
        <h2 className="font-semibold text-slate-800  inline-block">Rank : 1</h2>
      </div>
      <div>
        <h2 className="font-semibold text-slate-800  inline-block">
          Time Remaining :
        </h2>
        <span className="font-semibold text-slate-800 ">{timeRemaining}</span>
      </div>
    </header>
  );
};

type TAuctionDetailsCardHeaderProps = {
  auctionName: string;
  timeRemaining: string;
};

export default AuctionDetailsCardHeader;
