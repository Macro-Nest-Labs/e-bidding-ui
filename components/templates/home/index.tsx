'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';

import AdminDashboard from '@/components/admin/admin-dashboard/Admin-dashboard';
import DashboardSkeleton from '@/components/home/dashboard-skeleton';
import BuyerDashboard from '@/components/pages/BuyerDashboard';
import SupplierDashboard from '@/components/pages/SupplierDashboard';
import { NEXT_PUBLIC_ARG_BE_URL } from '@/constants';
import {
  ISingleBuyerResponse,
  ISingleSupplierResponse,
} from '@/utils/types/api-types';
import { useUser } from '@auth0/nextjs-auth0/client';

const HomePageTemplate: FunctionComponent<THomePageTemplateProps> = () => {
  const { user, isLoading } = useUser();
  // Memoize 'role' so it only updates when 'user' changes
  const role = useMemo(() => {
    return user ? (user['roles/roles'] as string[]) : [];
  }, [user]);

  const [buyerId, setBuyerId] = useState<string | null>(null);
  const [buyerLoading, setBuyerLoading] = useState<boolean>(false);
  const [supplierLoading, setSupplierLoading] = useState<boolean>(false);
  const [newSupplier, setNewSupplier] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  const router = useRouter();

  // Fetch data on the client side
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      // Example of setting userId from localStorage safely
      const storedUserId =
        localStorage.getItem('buyerId') || localStorage.getItem('supplierId');
      setUserId(storedUserId);
      setIsLoadingData(false);
    }
  }, [user]);

  // Effect for fetching buyer data when user email is available
  useEffect(() => {
    const fetchBuyer = async () => {
      if (user?.email) {
        setBuyerLoading(true);
        const buyerSlugPath = `/buyers/email/${user.email}`;
        try {
          const response = await axios.get<ISingleBuyerResponse>(
            `${NEXT_PUBLIC_ARG_BE_URL}${buyerSlugPath}`,
          );
          setBuyerId(response.data.data._id);
          window.localStorage.setItem('buyerId', response.data.data._id);
        } catch (error) {
          // Handle error appropriately
        } finally {
          setBuyerLoading(false);
        }
      }
    };

    const fetchSupplier = async () => {
      if (user?.email) {
        setSupplierLoading(true);
        setNewSupplier(true);
        const supplierSlugPath = `/suppliers/email/${user.email}`;
        try {
          const response = await axios.get<ISingleSupplierResponse>(
            `${NEXT_PUBLIC_ARG_BE_URL}${supplierSlugPath}`,
          );
          window.localStorage.setItem('supplierId', response.data.data._id);
          setSupplierLoading(false);
          setNewSupplier(false);
        } catch (error: any) {
          if (error.response && error.response.status === 404) {
            router.push('/external-supplier');
          } else {
            // Handle other errors appropriately
          }
        }
      }
    };

    if (role[0] === 'buyer') {
      fetchBuyer();
    } else if (role[0] === 'supplier') {
      fetchSupplier();
    }
  }, [isLoading, role, user?.email, router]);

  if (isLoading || isLoadingData) {
    return <DashboardSkeleton />;
  }

  if (!userId) {
    return null;
  }

  return (
    <>
      {isLoading || buyerLoading || supplierLoading ? (
        <DashboardSkeleton />
      ) : user && buyerId ? (
        <BuyerDashboard buyerId={buyerId} />
      ) : !newSupplier && role[0] === 'supplier' ? (
        <SupplierDashboard supplierId={userId} />
      ) : user && role[0] === 'admin' ? (
        <AdminDashboard />
      ) : (
        <DashboardSkeleton />
      )}
    </>
  );
};

type THomePageTemplateProps = Omit<
  React.HTMLProps<HTMLDivElement>,
  'data'
> & {};

export default HomePageTemplate;
