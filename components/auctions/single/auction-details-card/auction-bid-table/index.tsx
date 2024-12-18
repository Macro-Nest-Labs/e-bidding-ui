import React, { FC } from 'react';

import Typography from '@mui/material/Typography';

const AuctionBidTable: FC<TAuctionBidTableProps> = ({ winningBidder }) => {
  return (
    <table className="table-auto w-full">
      {/* Table header */}
      <thead className=" text-slate-400  bg-slate-50 rounded-sm">
        <tr>
          <th className="p-2 grid grid-cols-1 gap-2 sm:grid-cols-2 items-center">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 items-center">
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <Typography
                    className="font-[600] text-left text-slate-400"
                    gutterBottom
                  >
                    Winning Bidder:
                    {winningBidder ? (
                      <span className="ml-1 font-medium text-black">
                        {winningBidder}
                      </span>
                    ) : (
                      <span className="ml-1 font-medium text-black">
                        {'Auction is yet to conclude'}
                      </span>
                    )}
                  </Typography>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Typography className="font-semibold text-left" gutterBottom>
                  Bid Value:
                  {winningBidder ? (
                    <span className="ml-1 font-medium text-black before:content-['₹']">
                      {winningBidder}
                    </span>
                  ) : (
                    <span className="ml-1 font-medium text-black">
                      {'Auction is yet to conclude'}
                    </span>
                  )}
                </Typography>
              </div>
            </div>
          </th>
        </tr>
      </thead>
    </table>
  );
};

type TAuctionBidTableProps = {
  winningBidder: string;
};

export default AuctionBidTable;
