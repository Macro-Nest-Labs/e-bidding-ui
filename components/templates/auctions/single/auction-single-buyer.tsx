import axios from 'axios';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import React, { FC, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import AuctionDetailsCard from '@/components/auctions/single/auction-details-card';
import {
  supplierColors,
  transformBidsToSuppliersData,
  TSupplierData,
} from '@/components/auctions/single/auction-helper';
import OnlineUsers from '@/components/auctions/single/online-users';
import CountdownTimer from '@/components/common/countdown-timer';
import BidHistoryTable from '@/components/partials/auction-cards/BidHistoryTable';
import LotItemTable from '@/components/partials/auction-cards/LotItemTable';
import NextLotInfoCard from '@/components/partials/auction-cards/NextLotInfo';
import RealTimeAuctionCard from '@/components/partials/dashboard-cards/RealTimeAuctionCard';
import { NEXT_PUBLIC_ARG_BE_URL } from '@/constants';
import useSocket from '@/hooks/useSocket';
import { findLowestBid } from '@/utils/functions/bid.utils';
import {
  getAuctionStartTimeWithStartDate,
  getFormattedTime,
} from '@/utils/functions/date';
import {
  IBidsResponse,
  ISingleSupplierResponse,
} from '@/utils/types/api-types';
import {
  IBidModel,
  IListingModel,
  ILotItemModel,
  ISupplierModel,
  ListingStatus,
} from '@/utils/types/be-model-types';
import {
  TAuctionExtendedData,
  TAuctionStartedData,
  TBidErrorData,
  TClientConnectData,
  TClientDisconnectData,
  TCurrentUsersData,
  TJoinedRoomData,
  TLotTransitionData,
  TNewBidData,
} from '@/utils/types/socket-types';

dayjs.extend(utc);
dayjs.extend(timezone);

const AuctionSingleBuyerTemplate: FC<TAuctionSingleBuyerTemplateProps> = ({
  auction,
  bids,
  buyerId,
}) => {
  const socket = useSocket(NEXT_PUBLIC_ARG_BE_URL, '/auction');

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

  const initialSuppliersData = transformBidsToSuppliersData(bids);
  const auctionStartTime = getAuctionStartTimeWithStartDate(
    auction.startDate,
    auction.startTime,
  );

  const initialActiveLot = getLot(auction.activeLot) ?? auction.lots[0];
  const initialActiveLotItems = initialActiveLot.lotItems;
  const initialLotIndex = getLotIndex(auction.activeLot);

  const [activeLotEndTime, setActiveLotEndTime] = useState<string>(
    dayjs(auction.activeLotEndTime).toISOString(),
  );
  const [currentBids, setCurrentBids] = useState<IBidModel[]>(bids);
  const [suppliersData, setSuppliersData] =
    useState<TSupplierData[]>(initialSuppliersData);
  const [supplierColorMap, setSupplierColorMap] = useState(new Map());
  const [timerServerTime, setTimeServerTime] = useState<Date | null>(null);
  const [currentAuctionStatus, setCurrentAuctionStatus] =
    useState<ListingStatus>(auction.status);
  const [activeLotItems, setActiveLotItems] = useState<ILotItemModel[]>(
    initialActiveLotItems,
  );
  const [currentLotIndex, setCurrentLotIndex] =
    useState<number>(initialLotIndex);
  const [onlineUsers, setOnlineUsers] = useState<ISupplierModel[]>([]);
  const [userDetailsCache, setUserDetailsCache] = useState({});

  const roomId = auction._id;

  const [isAuctionStarted, setIsAuctionStarted] = useState<boolean>(false);

  const lowestBidAmount = findLowestBid(currentBids);

  suppliersData.forEach((supplier, index) => {
    supplierColorMap.set(
      supplier.id,
      supplierColors[index % supplierColors.length],
    );
  });

  const handleTimerEnd = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('reloaded', 'true');
    if (auction.status === ListingStatus.CLOSED) {
      url.searchParams.set('closed', 'true');
    }
    window.location.href = url.toString();
  }, [auction.status]);

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

      const handleNewBid = (data: TNewBidData) => {
        setCurrentBids((prevBids) => [data, ...prevBids]);
        setSuppliersData((prevData) => {
          const newSupplierColorMap = new Map();
          prevData.forEach((supplier, index) => {
            newSupplierColorMap.set(
              supplier.id,
              supplierColors[index % supplierColors.length],
            );
          });
          setSupplierColorMap(newSupplierColorMap);

          const supplierExists = prevData.some(
            (supplier) => supplier.id === data.supplier._id,
          );

          if (!supplierExists) {
            // Add new supplier with the bid
            return [
              ...prevData,
              {
                id: data.supplier._id,
                name: `${data.supplier.firstName} ${data.supplier.lastName}`,
                bids: [
                  {
                    price: data.amount,
                    time: dayjs().tz('Asia/Kolkata').toISOString(),
                  },
                ],
                color: newSupplierColorMap.get(data.supplier._id) || '#000000', // default to black if not found
              },
            ];
          } else {
            // Update existing supplier with new bid
            return prevData.map((supplier) => {
              if (supplier.id === data.supplier._id) {
                return {
                  ...supplier,
                  bids: [
                    ...supplier.bids,
                    {
                      price: data.amount,
                      time: dayjs().tz('Asia/Kolkata').toISOString(),
                    },
                  ],
                };
              }
              return supplier;
            });
          }
        });
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
        socket.emit('request-current-users', roomId);
      };

      const handelLotTransition = async (data: TLotTransitionData) => {
        toast.success(`Lot transitioned, nextLotId=${data.nextLotId}`);
        const nextLot = getLot(data.nextLotId);
        if (nextLot) {
          const nextLotIndex = getLotIndex(nextLot._id);
          setActiveLotItems(nextLot.lotItems);
          setCurrentLotIndex(nextLotIndex);
          setActiveLotEndTime(data.endTime);

          const timestamp = new Date().getTime();
          const bidsSlugPath = '/bids/lot/';
          const nextLotBids = await axios.get<IBidsResponse>(
            `${NEXT_PUBLIC_ARG_BE_URL}${bidsSlugPath}${nextLot._id}/?t=${timestamp}`,
          );
          setCurrentBids(nextLotBids.data.data);
          setSuppliersData(transformBidsToSuppliersData(nextLotBids.data.data));
        }
      };

      const handleClientConnect = async (data: TClientConnectData) => {
        if (userDetailsCache[data.userId]) {
          // User details are already in cache, use them directly
          setOnlineUsers((prevUsers) => [
            ...prevUsers,
            userDetailsCache[data.userId],
          ]);
        } else {
          // User details not in cache, fetch from server
          try {
            const response = await axios.get<ISingleSupplierResponse>(
              `${NEXT_PUBLIC_ARG_BE_URL}/suppliers/${data.userId}`,
            );
            const userDetails = response.data.data;

            // Update cache and online users state
            setUserDetailsCache((prevCache) => ({
              ...prevCache,
              [data.userId]: userDetails,
            }));
            setOnlineUsers((prevUsers) => [...prevUsers, userDetails]);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error fetching user details:', error);
          }
        }
      };

      const handleClientDisconnect = async (data: TClientDisconnectData) => {
        setOnlineUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== data.userId),
        );
      };

      const handleCurrentUsers = (data: TCurrentUsersData) => {
        setOnlineUsers(data.users);
      };

      // Register event listeners
      socket.on('auction-started', handleAuctionStarted);
      socket.on('auction-extended', handleAuctionExtended);
      socket.on('new-bid', handleNewBid);
      socket.on('bid-error', handleBidError);
      socket.on('joined-room', handleJoinedRoom);
      socket.on('lot-transition', handelLotTransition);
      socket.on('client-connect', handleClientConnect);
      socket.on('client-disconnect', handleClientDisconnect);
      socket.on('current-users', handleCurrentUsers);

      // Cleanup function
      return () => {
        socket.off('auction-started', handleAuctionStarted);
        socket.off('auction-extended', handleAuctionExtended);
        socket.off('new-bid', handleNewBid);
        socket.off('bid-error', handleBidError);
        socket.off('joined-room', handleJoinedRoom);
        socket.off('lot-transition', handelLotTransition);
        socket.off('client-connect', handleClientConnect);
        socket.off('client-disconnect', handleClientDisconnect);
        socket.off('current-users', handleCurrentUsers);
      };
    }
  }, [getLot, getLotIndex, socket, userDetailsCache]);

  useEffect(() => {
    if (socket) {
      socket.emit('join-room', roomId, buyerId, true);
    }
  }, [roomId, socket, buyerId]);

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

  return (
    <div className="mb-10">
      <div>
        {isAuctionStarted ? (
          <CountdownTimer
            targetTime={activeLotEndTime}
            onEnd={handleTimerEnd}
          />
        ) : (
          <CountdownTimer
            targetTime={auctionStartTime.format()}
            onEnd={handleTimerEnd}
          />
        )}
      </div>

      <div className="flex flex-wrap sm:grid-cols-1 gap-4">
        {/* [1, 1] */}
        <div className="w-[calc(50%-8px)] min-h-[300px]">
          <RealTimeAuctionCard
            suppliersData={suppliersData}
            lowestBidAmount={lowestBidAmount}
          />
        </div>
        {/* [1. 2] */}
        <BidHistoryTable
          className="w-[calc(50%-8px)]"
          bidTableData={currentBids}
          roomId={auction._id}
          lotId={auction.activeLot}
        />
        {/* [2 ,1] */}
        <AuctionDetailsCard
          className="w-[calc(50%-8px)]"
          auction={{ ...auction, status: currentAuctionStatus }}
          activeLotIndex={currentLotIndex}
        />
        {/* [2, 2] */}
        <LotItemTable className="w-[calc(50%-8px)]" lotItems={activeLotItems} />
        {/* [3, 1] */}
        <OnlineUsers className="w-[calc(50%-8px)]" onlineUsers={onlineUsers} />
        {/* [3, 2] */}
        {/* TODO: Add TnC block here */}
        {/* [4, 1] [4, 2] */}
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

type TAuctionSingleBuyerTemplateProps = {
  auction: IListingModel;
  bids: IBidModel[];
  buyerId: string;
};

export default AuctionSingleBuyerTemplate;
