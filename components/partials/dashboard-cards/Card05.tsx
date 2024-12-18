import React, { FC, useEffect, useState } from 'react';

import { NEXT_PUBLIC_ARG_BE_URL } from '@/constants';
import useSocket from '@/hooks/useSocket';
import { IBidModel } from '@/utils/types/be-model-types';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {
  TBidErrorData,
  TJoinedRoomData,
  TNewBidData,
} from '@/utils/types/socket-types';
import toast from 'react-hot-toast';
import { getFormattedTime } from '@/utils/functions/date';

const DashboardCard05: FC<TDashboardCard05Props> = ({
  roomId,
  lotId,
  bids,
}) => {
  const socket = useSocket(NEXT_PUBLIC_ARG_BE_URL, '/auction');

  const [bidPrice, setBidPrice] = useState<number>(0);
  const [supplierCurrentBid, setSupplierCurrentBid] = useState(0);

  const handleBidSubmit = () => {
    // Emit the bid event with the necessary data
    if (socket) {
      const supplierId = localStorage.getItem('supplierId');
      if (supplierId) {
        socket.emit('bid', { roomId, lotId, supplierId, amount: bidPrice });
      }
    }
  };

  useEffect(() => {
    if (bids.length > 0) {
      const supplierId = localStorage.getItem('supplierId') ?? '';
      // Filter the bids made by the current supplier
      const supplierBids = bids.filter(
        (bid) => bid.supplier._id === supplierId,
      );

      // Sort the bids in descending order of time
      supplierBids.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      // Set the most recent bid's amount as the current bid
      if (supplierBids.length > 0) {
        setSupplierCurrentBid(supplierBids[0].amount);
      }
    }
  }, [bids]);

  // Listen for new bid events
  useEffect(() => {
    if (socket) {
      const handleNewBid = (data: TNewBidData) => {
        toast.success(
          `New bid received: ${data?.amount} at ${getFormattedTime(
            data?.createdAt,
          )}`,
        );
      };

      const handleBidError = (errorMessage: TBidErrorData) => {
        toast.error(`Error while placing bid: ${errorMessage}`);
      };

      const handleJoinedRoom = (roomId: TJoinedRoomData) => {
        toast.success(`Joined room: ${roomId}`);
      };

      // Register event listeners
      socket.on('new-bid', handleNewBid);
      socket.on('bid-error', handleBidError);
      socket.on('joined-room', handleJoinedRoom);

      // Cleanup function
      return () => {
        socket.off('new-bid', handleNewBid);
        socket.off('bid-error', handleBidError);
        socket.off('joined-room', handleJoinedRoom);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      const supplierId = localStorage.getItem('supplierId');
      const buyerId = localStorage.getItem('buyerId');
      if (supplierId) {
        socket.emit('join-room', roomId, supplierId);
      } else if (buyerId) {
        socket.emit('join-room', roomId, buyerId, true);
      }
    }
  }, [roomId, socket]);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="w-full sm:w-[70%] lg:w-[80%]">
        {/* <RealTimeAuctionCard suppliersData={bids} roomId={roomId} /> */}
      </div>
      <div className="w-full  sm:w-[30%] lg:w-[20%] bg-white shadow-lg rounded-sm border border-slate-200">
        <div className="px-4">
          <Typography
            variant="subtitle2"
            className="text-center font-light mt-2"
          >
            Your current bid is ${supplierCurrentBid}
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
          />
          <button
            type="button"
            onClick={handleBidSubmit}
            className="w-full mt-4 sm:w-full md:1/2 middle none center rounded-lg bg-green-500 py-4 px-4 font-sans text-sm font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            Submit Bid
          </button>
        </div>
      </div>
    </div>
  );
};

type TDashboardCard05Props = {
  roomId: string;
  lotId: string;
  bids: IBidModel[];
};

export default DashboardCard05;
