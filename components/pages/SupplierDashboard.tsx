import axios from 'axios';
import { FunctionComponent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { NEXT_PUBLIC_ARG_BE_URL } from '@/constants';
import { IListingResponse } from '@/utils/types/api-types';
import { IListingModel, ListingStatus } from '@/utils/types/be-model-types';

import WelcomeBanner from '../partials/banners/welcomeBanner';
import PastListingsTable from '../partials/dashboard-cards/PastListingsTable';

const SupplierDashboard: FunctionComponent<TSupplierDashboardProps> = ({
  supplierId,
}) => {
  const [auctionsData, setAuctionsData] = useState<IListingModel[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function getData() {
      const params = new URLSearchParams();
      const timestamp = new Date().getTime();
      params.append('status', ListingStatus.CLOSED);
      params.append('supplier', supplierId);
      params.append('t', timestamp.toString());
      const slugPath = `/listings/?${params.toString()}`;

      try {
        const listingResponse = await axios.get<IListingResponse>(
          `${NEXT_PUBLIC_ARG_BE_URL}${slugPath}`,
        );

        if (isMounted) {
          setAuctionsData(listingResponse.data.data);
        }
      } catch (error) {
        toast.error(`Error fetching data: ${error}`);
      }
    }

    getData();

    return () => {
      isMounted = false;
    };
  }, [supplierId]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Welcome banner */}
            <WelcomeBanner />

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
              <PastListingsTable listings={auctionsData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

type TSupplierDashboardProps = {
  supplierId: string;
};

export default SupplierDashboard;
