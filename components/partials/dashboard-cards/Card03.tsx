import Link from 'next/link';
import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';

function DashboardCard03() {
  return (
    <div className="flex items-center col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 py-4">
      {/* Chart built with Chart.js 3 */}
      <div className="grow max-sm:max-h-[128px] xl:max-h-[128px] flex items-center px-4">
        <Link href="/auctions/create" className="w-full">
          <Button
            endIcon={<AddIcon />}
            fullWidth
            size="large"
            variant="outlined"
            sx={{ py: '2rem', backgroundColor: '#f0f5fe' }}
          >
            Create Auction
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default DashboardCard03;
