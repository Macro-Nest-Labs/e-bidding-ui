'use client';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast'; // Import toast

import CustomBreadcrumbs from '@/components/common/custom-breadcrumbs';
import AuctionsTemplate from '@/components/templates/auctions';
import { NEXT_PUBLIC_ARG_BE_URL } from '@/constants';
import { IListingResponse } from '@/utils/types/api-types';
import { IListingModel } from '@/utils/types/be-model-types';
import { useUser } from '@auth0/nextjs-auth0/client';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export default function AuctionsPage() {
  const [auctionsData, setAuctionsData] = useState<IListingModel[]>([]);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const { user, isLoading } = useUser();
  // Memoize 'role' so it only updates when 'user' changes
  const role = useMemo(() => {
    return user ? (user['roles/roles'] as string[]) : [];
  }, [user]);

  const isBuyer = role[0] === 'buyer';
  let userId: string | null = null;
  if (typeof window !== 'undefined') {
    userId = isBuyer
      ? localStorage.getItem('buyerId')
      : localStorage.getItem('supplierId');
  }

  React.useEffect(() => {
    if (role && role[0] === 'admin') {
      window.location.href = '/';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    async function getAuctionsData() {
      const timestamp = new Date().getTime();

      let apiUrl;

      if (isBuyer) {
        apiUrl = `${NEXT_PUBLIC_ARG_BE_URL}/listings/buyer/${userId}/?t=${timestamp}`;
      } else {
        apiUrl = `${NEXT_PUBLIC_ARG_BE_URL}/listings/supplier/${userId}/?t=${timestamp}`;
      }

      try {
        const response = await axios.get<IListingResponse>(apiUrl);
        if (isMounted) {
          setAuctionsData(response.data.data);
          setStatusCode(response.status);
        }
      } catch (error) {
        // @ts-ignore
        let errorStatusCode = error?.response?.status;
        setStatusCode(errorStatusCode);
        toast.error(`Error fetching auctions data: ${error}`);
      }
    }

    if (!isLoading) {
      getAuctionsData();
    }
    return () => {
      isMounted = false;
    };
  }, [isBuyer, isLoading, userId]);

  if (!auctionsData) {
    return null;
  }

  return (
    <>
      {user && role[0] !== 'admin' ? (
        <div>
          <CustomBreadcrumbs className="py-1" />
          <Typography
            variant="h5"
            component="h1"
            className="font-sans text-gray-800 text-center my-2.5 tracking-wide leading-normal font-medium text-xl mb-2 uppercase flex justify-center"
          >
            ▪️ Auctions ▪️
          </Typography>
          <AuctionsTemplate
            listings={auctionsData}
            statusCode={statusCode}
            isBuyer={isBuyer}
          />
          <Toaster position="top-center" reverseOrder={false} />
        </div>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
}
