import React, { FunctionComponent, useEffect } from 'react';

import Skeleton from '@mui/material/Skeleton';

const DashboardSkeleton: FunctionComponent = () => {
  useEffect(() => {
    localStorage.removeItem('formData');
  }, []);
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <Skeleton variant="rectangular" height={116} className="mb-8" />
          <div className="grid grid-cols-12 gap-6">
            <Skeleton
              variant="rectangular"
              height={255}
              className="col-span-full sm:col-span-6 xl:col-span-4"
            />
            <Skeleton
              variant="rectangular"
              height={255}
              className="col-span-full sm:col-span-6 xl:col-span-4"
            />
            <Skeleton
              variant="rectangular"
              height={255}
              className="col-span-full sm:col-span-6 xl:col-span-4"
            />
            <Skeleton
              variant="rectangular"
              height={255}
              className="col-span-full xl:col-span-12"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
