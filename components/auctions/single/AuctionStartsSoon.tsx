import { FC } from 'react';

import Typography from '@mui/material/Typography';

const AuctionStartsSoon: FC<TAuctionStartSoonProps> = ({ className }) => {
  return (
    <div
      className={`mx-auto shadow-lg rounded-sm border border-slate-200 flex flex-col items-center justify-center ${className}`}
    >
      <Typography
        style={{
          backgroundImage: 'url("/auction_starts_soon.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '100%',
        }}
      ></Typography>
    </div>
  );
};

type TAuctionStartSoonProps = {
  className?: string;
};

export default AuctionStartsSoon;
