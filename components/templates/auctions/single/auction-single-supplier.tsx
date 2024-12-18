import dayjs from 'dayjs';
import React, { FC, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import AuctionDetailsCard from '@/components/auctions/single/auction-details-card';
import SubmitBid from '@/components/auctions/single/submit-bid';
import CountdownTimer from '@/components/common/countdown-timer';
import LotItemTable from '@/components/partials/auction-cards/LotItemTable';
import NextLotInfoCard from '@/components/partials/auction-cards/NextLotInfo';
import TermsAndConditionsCard from '@/components/partials/auction-cards/TermsAndConditionsCard';
import { NEXT_PUBLIC_ARG_BE_URL } from '@/constants';
import useSocket from '@/hooks/useSocket';
import {
  getAuctionStartTimeWithStartDate,
  getFormattedTime,
} from '@/utils/functions/date';
import {
  IBidModel,
  IListingModel,
  ILotItemModel,
  ListingStatus,
} from '@/utils/types/be-model-types';
import {
  TAuctionClosedGeneralData,
  TAuctionExtendedData,
  TAuctionStartedData,
  TBidErrorData,
  TJoinedRoomData,
  TLotTransitionData,
  TNewBidData,
} from '@/utils/types/socket-types';
import axios from 'axios';
import { IBidsResponse } from '@/utils/types/api-types';
import { findLowestBid } from '@/utils/functions/bid.utils';

const AuctionSingleSupplierTemplate: FC<
  TAuctionSingleSupplierTemplateProps
> = ({ auction, bids, supplierId }) => {
  const socket = useSocket(NEXT_PUBLIC_ARG_BE_URL, '/auction');

  const auctionStartTime = getAuctionStartTimeWithStartDate(
    auction.startDate,
    auction.startTime,
  );
  const getLot = useCallback(
    (lotId: string) => {
      return auction.lots.find((lot) => lot._id === lotId);
    },
    [auction.lots],
  );
  const getLotIndex = useCallback(
    (lotId: string) => auction.lots.findIndex((lot) => lot._id === lotId),
    [auction.lots],
  );

  const initialActiveLot = getLot(auction.activeLot) ?? auction.lots[0];
  const initialActiveLotItems = initialActiveLot.lotItems;
  const initialLotIndex = getLotIndex(auction.activeLot);

  const [bidPrice, setBidPrice] = useState<number>(0);
  const [currentBids, setCurrentBids] = useState<IBidModel[]>(bids);
  const [supplierCurrentBid, setSupplierCurrentBid] = useState(0);
  const [activeLotEndTime, setActiveLotEndTime] = useState<string>(
    dayjs(auction.activeLotEndTime).toISOString(),
  );
  const [bidsForCurrentUser, setBidsForCurrentUser] = useState<IBidModel[]>([]);
  const [timerServerTime, setTimeServerTime] = useState<Date | null>(null);
  const [currentAuctionStatus, setCurrentAuctionStatus] =
    useState<ListingStatus>(auction.status);
  const [activeLotItems, setActiveLotItems] = useState<ILotItemModel[]>(
    initialActiveLotItems,
  );
  const [currentLotIndex, setCurrentLotIndex] =
    useState<number>(initialLotIndex);

  const roomId = auction._id;

  const [isAuctionStarted, setIsAuctionStarted] = useState<boolean>(false);
  const [auctionStatus, setAuctionStatus] = useState<ListingStatus>(
    auction.status,
  );

  const handleBidSubmit = () => {
    let minBidAmount = 0.85 * supplierCurrentBid;

    if (bidPrice >= minBidAmount) {
      const activeLotId = auction.lots[currentLotIndex]._id;
      if (socket) {
        socket.emit('bid', {
          roomId,
          lotId: activeLotId,
          supplierId,
          amount: bidPrice,
        });
      }
    } else {
      toast.error('Bid decrement cannot be more than 15%');
    }
    // Emit the bid event with the necessary data
  };

  const handleTimerEnd = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('reloaded', 'true');
    if (auction.status === ListingStatus.CLOSED) {
      url.searchParams.set('closed', 'true');
    }
    window.location.href = url.toString();
  }, [auction.status]);

  useEffect(() => {
    if (currentBids.length > 0) {
      // Filter the bids made by the current supplier
      const supplierBids = currentBids.filter(
        (currentBid) => currentBid.supplier._id === supplierId,
      );

      // Sort the bids in descending order of time
      supplierBids.sort(
        (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf(),
      );

      setBidsForCurrentUser(supplierBids);

      // Set the most recent bid's amount as the current bid
      if (supplierBids.length > 0) {
        setSupplierCurrentBid(supplierBids[0].amount);
      }
    }
  }, [currentBids, supplierId]);

  // Listen for new bid events
  useEffect(() => {
    if (socket) {
      const handleAuctionStarted = (data: TAuctionStartedData) => {
        toast.success(`Auction has started! listingId=${data.listingId}`);
        setCurrentAuctionStatus(ListingStatus.IN_PROGRESS);
        setIsAuctionStarted(true);
      };

      const handleAuctionExtended = (data: TAuctionExtendedData) => {
        toast.success(`Auction extended!`);
        setActiveLotEndTime(data.newEndTime);
      };

      const handleAuctionClosed = (data: TAuctionClosedGeneralData) => {
        toast.success('Auction closed!');
        setAuctionStatus(data.status);
      };

      const handleNewBid = (data: TNewBidData) => {
        setCurrentBids((prevBids) => [data, ...prevBids]);

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

      const handelLotTransition = async (data: TLotTransitionData) => {
        toast.success(`Lot transitioned, nextLotId=${data.nextLotId}`);
        const nextLot = getLot(data.nextLotId);
        if (nextLot) {
          const nextLotIndex = getLotIndex(nextLot._id);
          setActiveLotItems(nextLot.lotItems);
          setCurrentLotIndex(nextLotIndex);
          setActiveLotEndTime(data.endTime);
          setSupplierCurrentBid(0);

          const timestamp = new Date().getTime();
          const bidsSlugPath = '/bids/lot/';
          const nextLotBids = await axios.get<IBidsResponse>(
            `${NEXT_PUBLIC_ARG_BE_URL}${bidsSlugPath}${nextLot._id}/?t=${timestamp}`,
          );
          setCurrentBids(nextLotBids.data.data);
        }
      };

      // Register event listeners
      socket.on('auction-started', handleAuctionStarted);
      socket.on('auction-extended', handleAuctionExtended);
      socket.on('new-bid', handleNewBid);
      socket.on('bid-error', handleBidError);
      socket.on('joined-room', handleJoinedRoom);
      socket.on('lot-transition', handelLotTransition);

      // Cleanup function
      return () => {
        socket.off('auction-started', handleAuctionStarted);
        socket.off('auction-extended', handleAuctionExtended);
        socket.off('auction-closed', handleAuctionClosed);
        socket.off('new-bid', handleNewBid);
        socket.off('bid-error', handleBidError);
        socket.off('joined-room', handleJoinedRoom);
        socket.off('lot-transition', handelLotTransition);
      };
    }
  }, [getLot, getLotIndex, socket]);

  useEffect(() => {
    if (socket) {
      socket.emit('join-room', roomId, supplierId);
    }
  }, [roomId, socket, supplierId]);

  useEffect(() => {
    const fetchTimeServerTime = async () => {
      try {
        const response = await fetch(
          'https://worldtimeapi.org/api/timezone/Asia/Kolkata',
        );
        const data = await response.json();
        return new Date(data.datetime);
      } catch (error) {
        toast.error('Error fetching the time server time');
        return null;
      }
    };

    const updateTimer = async () => {
      const serverTime = await fetchTimeServerTime();
      if (serverTime) {
        setTimeServerTime(serverTime);
      }
    };

    updateTimer();
  }, []);

  useEffect(() => {
    const isAuctionStarted = dayjs(timerServerTime).isAfter(auctionStartTime);
    setIsAuctionStarted(isAuctionStarted);
  }, [auctionStartTime, timerServerTime]);

  const lowestBidAmount = findLowestBid(currentBids);

  return (
    <div className="mb-10">
      {isAuctionStarted ? (
        <CountdownTimer targetTime={activeLotEndTime} onEnd={handleTimerEnd} />
      ) : (
        <CountdownTimer
          targetTime={auctionStartTime.format()}
          onEnd={handleTimerEnd}
        />
      )}

      <div className="flex flex-wrap sm:grid-cols-1 gap-4">
        {/* [1, 1] */}
        <LotItemTable
          className="w-[calc(50%-8px)] h-[300px]"
          lotItems={activeLotItems}
        />
        {/* [1. 2] */}
        <SubmitBid
          className="w-[calc(50%-8px)] h-[300px]"
          bidPrice={bidPrice}
          setBidPrice={setBidPrice}
          supplierCurrentBid={supplierCurrentBid}
          handleBidSubmit={handleBidSubmit}
          bidsForCurrentUser={bidsForCurrentUser}
          auctionStatus={auctionStatus}
          lowestBidAmount={lowestBidAmount}
          auctionType={auction.typesOfListing}
        />
        {/* [2 ,1] */}
        <AuctionDetailsCard
          className={`w-[calc(50%-8px)] ${
            auction?.lots.length > 1 ? '' : 'mb-4'
          }`}
          auction={{ ...auction, status: currentAuctionStatus }}
          activeLotIndex={currentLotIndex}
          isSupplier={true}
        />
        {/* [2 ,2] */}
        <TermsAndConditionsCard
          className={`w-[calc(50%-8px)] ${
            auction?.lots.length > 1 ? '' : 'mb-4'
          }`}
          lotId={auction._id}
        />
        {/* [3, 1] [3, 2] */}
        {currentLotIndex < auction.lots.length - 1 ? (
          <NextLotInfoCard
            className="w-full mb-5"
            nextLot={auction.lots[currentLotIndex + 1]}
          />
        ) : null}
      </div>
    </div>
  );
};

type TAuctionSingleSupplierTemplateProps = {
  auction: IListingModel;
  bids: IBidModel[];
  supplierId: string;
};

export default AuctionSingleSupplierTemplate;
