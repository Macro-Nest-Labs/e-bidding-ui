'use client';
import Link from 'next/link';
import React, { FunctionComponent, useEffect, useState } from 'react';

import {
  getAuctionStartTimeWithStartDate,
  getFormattedTime,
} from '@/utils/functions/date';
import { IListingModel, ListingStatus } from '@/utils/types/be-model-types';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Chip from '@mui/material/Chip';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { NEXT_PUBLIC_ARG_BE_URL } from '@/constants';
import useSocket from '@/hooks/useSocket';
import { TAuctionClosedGeneralData } from '@/utils/types/socket-types';
import toast from 'react-hot-toast';
import NoAuctionsAvailable from '@/components/auctions/single/NoAuctionsAvaliable';

const statusColors = {
  'In Progress': 'green',
  Closed: 'gray',
  Upcoming: '#00CED1',
};

const AuctionsTemplate: FunctionComponent<TAuctionsTemplateProps> = ({
  listings,
  statusCode,
  isBuyer,
}) => {
  const socket = useSocket(NEXT_PUBLIC_ARG_BE_URL, '/auction');

  const [currentListings, setCurrentListings] =
    useState<IListingModel[]>(listings);

  function getStatusColor(status) {
    return statusColors[status] || 'gray'; // Default color
  }

  useEffect(() => {
    if (socket) {
      const handleAuctionClosed = (data: TAuctionClosedGeneralData) => {
        toast.success(`Auction ${data.listingId} ended`);
        setCurrentListings((prevListings) => {
          return prevListings.map((listing) => {
            if (listing._id === data.listingId) {
              return { ...listing, status: data.status };
            }
            return listing;
          });
        });
      };

      socket.on('auction-closed', handleAuctionClosed);

      return () => {
        socket.off('auction-closed', handleAuctionClosed);
      };
    }
  }, [socket]);

  useEffect(() => {
    setCurrentListings(listings);
  }, [listings]);

  return (
    <div className="flex flex-row gap-5 flex-wrap mb-10">
      {currentListings.length === 0 && statusCode === 404 ? (
        <NoAuctionsAvailable isBuyer={isBuyer} />
      ) : (
        currentListings.map((listing) => {
          const auctionStartTime = getAuctionStartTimeWithStartDate(
            listing?.startDate,
            listing?.startTime,
          );

          const formattedStartTime = getFormattedTime(
            auctionStartTime.toISOString(),
          );
          return (
            <div
              className="relative flex flex-col p-5 gap-2 mt-6 text-gray-700 bg-gray-50 shadow-md bg-clip-border rounded-xl w-96"
              key={listing._id}
            >
              <div>
                <div className="flex justify-between">
                  <h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                    {listing?.name}
                  </h5>
                  <h4
                    style={{
                      color: `${getStatusColor(listing?.status)}`,
                    }}
                  >
                    {listing?.status}
                  </h4>
                </div>
                <div className="flex flex-wrap justify-between items-start">
                  <Chip
                    label={listing?.typesOfListing}
                    className="mb-2 capitalize"
                  />
                  {listing?.status === ListingStatus.CLOSED && isBuyer ? (
                    <Tooltip
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                      title="Download Auction Report"
                    >
                      <IconButton
                        href={`${NEXT_PUBLIC_ARG_BE_URL}/listings/${listing.slug}/report`}
                        target="_blank"
                      >
                        <FileDownloadOutlinedIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </div>
              </div>
              <hr />
              <div className="flex justify-between items-end flex-grow">
                <div className="flex justify-between w-full items-center">
                  <span className="px-1 text-xs">{formattedStartTime}</span>

                  <Link key={listing._id} href={`/auctions/${listing?.slug}`}>
                    <button
                      className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
                      type="button"
                    >
                      View Auction Details
                    </button>
                  </Link>
                </div>
                <div className="border-b border-slate-200"></div>
                <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit"></p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

type TAuctionsTemplateProps = Omit<React.HTMLProps<HTMLDivElement>, 'data'> & {
  listings: IListingModel[];
  statusCode: number | null;
  isBuyer: boolean;
};

export default AuctionsTemplate;
