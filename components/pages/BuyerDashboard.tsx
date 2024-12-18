import axios from 'axios';
import { FunctionComponent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { NEXT_PUBLIC_ARG_BE_URL } from '@/constants';
import { IListingResponse } from '@/utils/types/api-types';
import { IListingModel, ListingStatus } from '@/utils/types/be-model-types';

import WelcomeBanner from '../partials/banners/welcomeBanner';
import DashboardCard01 from '../partials/dashboard-cards/Card01';
import DashboardCard02 from '../partials/dashboard-cards/Card02';
import DashboardCard03 from '../partials/dashboard-cards/Card03';
import PastListingsTable from '../partials/dashboard-cards/PastListingsTable';

const BuyerDashboard: FunctionComponent<TBuyerDashboardProps> = ({
  buyerId,
}) => {
  const [auctionsData, setAuctionsData] = useState<IListingModel[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function getData() {
      const params = new URLSearchParams();
      const timestamp = new Date().getTime();
      params.append('status', ListingStatus.CLOSED);
      params.append('buyer', buyerId);
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
  }, [buyerId]);

  return (
    <div className="flex h-screen">
      {/* Content area */}
      <div className="relative flex flex-col flex-1">
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Welcome banner */}
            <WelcomeBanner />

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
              <DashboardCard01 />
              <DashboardCard02 />
              <DashboardCard03 />
              {/* <DashboardCard04 />
              <DashboardCard05 /> */}
              {/* <DashboardCard06 /> */}
              <PastListingsTable listings={auctionsData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

type TBuyerDashboardProps = {
  buyerId: string;
};

export default BuyerDashboard;
