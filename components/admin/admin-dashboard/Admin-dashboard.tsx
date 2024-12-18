'use client';
import React from 'react';
import WelcomeBanner from '../../partials/banners/welcomeBanner';
import { Link, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SupplierTable from './SupplierBuyerListingTable';
import { useUser } from '@auth0/nextjs-auth0/client';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const AdminDashboard = () => {
  const [totalBuyers, setTotalBuyers] = React.useState(0);
  const [totalSuppliers, setTotalSuppliers] = React.useState(0);
  const { user } = useUser();
  let role: any = user ? user['roles/roles'] : null;

  React.useEffect(() => {
    if (role && role[0] !== 'admin') {
      window.location.href = '/';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  return (
    <>
      {/* Content area */}
      {user && role[0] === 'admin' ? (
        <div className="flex h-screen overflow-hidden">
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <main>
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                {/* Welcome banner */}
                <WelcomeBanner />

                {/* Cards */}
                <div className="grid grid-cols-12 gap-6">
                  <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200">
                    <div className="px-5 pt-5">
                      <header className="flex justify-between items-start mb-2"></header>
                      <h2 className="text-lg font-semibold text-slate-800 mb-2">
                        Total Buyers
                      </h2>
                      <div className="flex items-start">
                        <div className="text-3xl font-bold text-slate-800 mr-2">
                          {totalBuyers}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200">
                    <div className="px-5 pt-5">
                      <header className="flex justify-between items-start mb-2"></header>
                      <h2 className="text-lg font-semibold text-slate-800 mb-2">
                        Total Suppliers
                      </h2>
                      <div className="flex items-start">
                        <div className="text-3xl font-bold text-slate-800 mr-2">
                          {totalSuppliers}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200">
                    <div className="px-5 py-5">
                      <div className="grow max-sm:max-h-[128px] xl:max-h-[128px] flex items-center px-4">
                        <Link
                          href="/admin/buyer/create-buyer"
                          className="w-full"
                        >
                          <Button
                            endIcon={<AddIcon />}
                            fullWidth
                            size="large"
                            variant="outlined"
                            sx={{ py: '2rem', backgroundColor: '#f0f5fe' }}
                          >
                            Create Buyer
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-4">
                  <SupplierTable
                    setTotalBuyers={setTotalBuyers}
                    setTotalSuppliers={setTotalSuppliers}
                  />
                </div>
              </div>
            </main>
          </div>
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
};

export default AdminDashboard;
