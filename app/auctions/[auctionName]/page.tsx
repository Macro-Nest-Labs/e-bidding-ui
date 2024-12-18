'use client';
import axios from 'axios';
import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import CustomBreadcrumbs from '@/components/common/custom-breadcrumbs';
import AuctionSingleBuyerTemplate from '@/components/templates/auctions/single/auction-single-buyer';
import AuctionSingleSupplierTemplate from '@/components/templates/auctions/single/auction-single-supplier';
import { NEXT_PUBLIC_ARG_BE_URL } from '@/constants';
import { IBidsResponse, ISingleListingResponse } from '@/utils/types/api-types';
import { IBidModel, IListingModel } from '@/utils/types/be-model-types';
import { useUser } from '@auth0/nextjs-auth0/client';

const AuctionsSinglePage: FunctionComponent<TAuctionsSinglePageProps> = ({
  params,
}: {
  params: { auctionName: string };
}) => {
  const [auctionData, setAuctionsData] = useState<IListingModel>();
  const [bidsData, setBidsData] = useState<IBidModel[]>();

  const { user, isLoading } = useUser();
  // Memoize 'role' so it only updates when 'user' changes
  const role = useMemo(() => {
    return user ? (user['roles/roles'] as string[]) : [];
  }, [user]);

  const auctionName = params.auctionName;
  const isBuyer = role[0] === 'buyer';
  let userId: string | null = null;
  if (typeof window !== 'undefined') {
    userId = isBuyer
      ? localStorage.getItem('buyerId')
      : localStorage.getItem('supplierId');
  }

  useEffect(() => {
    let isMounted = true;

    async function getData() {
      const timestamp = new Date().getTime();
      const listingSlugPath = `/listings/${auctionName}/?t=${timestamp}`;
      const bidsSlugPath = '/bids/lot/';

      try {
        const listingResponse = await axios.get<ISingleListingResponse>(
          `${NEXT_PUBLIC_ARG_BE_URL}${listingSlugPath}`,
        );

        const bidsResponse = await axios.get<IBidsResponse>(
          `${NEXT_PUBLIC_ARG_BE_URL}${bidsSlugPath}${listingResponse.data.data.activeLot}/?t=${timestamp}`,
        );
        if (isMounted) {
          setAuctionsData(listingResponse.data.data);
          setBidsData(bidsResponse.data.data);
        }
      } catch (error) {
        toast.error(`Error fetching data: ${error}`);
      }
    }

    getData();

    return () => {
      isMounted = false;
    };
  }, [auctionName]);

  if (isLoading || !auctionData || !bidsData || !userId) {
    return null;
  }

  return (
    <div>
      <CustomBreadcrumbs className="py-1 mb-4" />
      {isBuyer ? (
        <AuctionSingleBuyerTemplate
          auction={auctionData}
          bids={bidsData}
          buyerId={userId}
        />
      ) : (
        <AuctionSingleSupplierTemplate
          auction={auctionData}
          bids={bidsData}
          supplierId={userId}
        />
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

type TAuctionsSinglePageProps = {
  params: {
    auctionName: string;
  };
};

export default AuctionsSinglePage;
