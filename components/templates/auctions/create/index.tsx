'use client';
import React, { FunctionComponent, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import AuctionStepper from '@/components/auctions/create/auction-stepper';
import { useUser } from '@auth0/nextjs-auth0/client';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const CreateAuctionTemplate: FunctionComponent<TCreateAuctionTemplateProps> = ({
  data,
}) => {
  const { user } = useUser();
  let role: any = user ? user['roles/roles'] : null;

  useEffect(() => {
    if (role && role[0] === 'supplier') {
      window.location.href = '/';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div>
      {user && role[0] === 'buyer' ? (
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" component={'h1'} gutterBottom>
              {data.title}
            </Typography>
            <Divider />
            <Typography variant="subtitle1" gutterBottom sx={{ my: 2 }}>
              {data.subtitle}
            </Typography>
            <AuctionStepper steps={data.steps} />
            {/* Added Toast Notification for Auction Create Stepper */}
            <Toaster position="top-center" reverseOrder={false} />
          </Box>
        </LocalizationProvider>
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
    </div>
  );
};

type TCreateAuctionTemplateProps = Omit<
  React.HTMLProps<HTMLDivElement>,
  'data'
> & {
  data: {
    title: string;
    subtitle: string;
    seo: {
      title: string;
    };
    steps: string[];
  };
};

export default CreateAuctionTemplate;
