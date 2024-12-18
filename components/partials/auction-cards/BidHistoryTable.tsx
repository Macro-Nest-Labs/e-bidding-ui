'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { NEXT_PUBLIC_ARG_BE_URL } from '@/constants';
import useSocket from '@/hooks/useSocket';
import { IBidsResponse } from '@/utils/types/api-types';
import { IBidModel } from '@/utils/types/be-model-types';
import { TJoinedRoomData, TNewBidData } from '@/utils/types/socket-types';
import toast from 'react-hot-toast';

type BidHistoryTableProp = {
  bidTableData: IBidModel[];
  roomId: string;
  lotId: string;
  className?: string;
};

const BidHistoryTable: React.FC<BidHistoryTableProp> = ({
  bidTableData,
  roomId,
  lotId,
  className,
}) => {
  const socket = useSocket(NEXT_PUBLIC_ARG_BE_URL, '/auction');

  const [currentBids, setCurrentBids] = useState<IBidModel[]>(bidTableData);

  // TODO: check and remove this fetch for bids, should be fresh data from the parent now
  useEffect(() => {
    let isMounted = true;

    async function fetchBidsByLot(lotId: string) {
      const bidsSlugPath = '/bids/lot/';
      try {
        const response = await axios.get<IBidsResponse>(
          `${NEXT_PUBLIC_ARG_BE_URL}${bidsSlugPath}${lotId}`,
        );
        if (isMounted) {
          setCurrentBids(response.data.data);
        }
      } catch (error) {
        toast.error(`Error fetching bids: ${error}`);
      }
    }

    if (socket) {
      const handleNewBid = async (data: TNewBidData) => {
        await fetchBidsByLot(lotId);
      };

      const handleJoinedRoom = async (roomId: TJoinedRoomData) => {
        await fetchBidsByLot(lotId);
      };

      socket.on('new-bid', handleNewBid);
      socket.on('joined-room', handleJoinedRoom);

      return () => {
        if (socket) {
          socket.off('new-bid', handleNewBid);
          socket.off('joined-room', handleJoinedRoom);
        }
        isMounted = false;
      };
    }
  }, [lotId, socket]);

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
    <div
      className={`bg-white shadow-lg rounded-sm border border-slate-200 ${className}`}
    >
      <header className="px-5 py-4 border-b border-slate-100 text-center">
        <h2 className="font-semibold text-slate-800 ">Bid History</h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto max-h-[255px] overflow-y-auto">
          <table className="table-auto w-full h-full">
            {/* Table header */}
            <thead className="text-sm uppercase text-slate-400  bg-slate-50 rounded-sm">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-left">Participant</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Unit Cost</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">
                    Submission Time
                  </div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-slate-100">
              {bidTableData?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    No Bid History available
                  </td>
                </tr>
              ) : (
                currentBids.map((bid, index) => (
                  <tr key={index}>
                    {/* Participant Column */}
                    <td className="p-2">
                      <div className="text-left">{bid.supplier.firstName}</div>
                    </td>

                    {/* Unit Cost Column */}
                    <td className="p-2">
                      <div className="text-center text-emerald-500 before:content-['₹']">
                        {bid.amount}
                      </div>
                    </td>

                    {/* Submission Time Column */}
                    <td className="p-2">
                      <div className="text-center">
                        {new Date(bid.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BidHistoryTable;
