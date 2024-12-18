import { curveLinear } from 'd3-shape';
import React, { FC, useMemo } from 'react';
import { AxisOptions, Chart } from 'react-charts';

import { TSupplierData } from '@/components/auctions/single/auction-helper';

type TRealTimeAuctionCardProps = {
  className?: string;
  suppliersData: TSupplierData[];
  lowestBidAmount: number | null;
};

type TBid = {
  primary: Date;
  secondary: number;
};

const RealTimeAuctionCard: FC<TRealTimeAuctionCardProps> = ({
  suppliersData,
}) => {
  const data = useMemo(() => {
    return suppliersData.map((supplier) => ({
      label: supplier.name,
      data: supplier.bids.map((bid) => ({
        primary: new Date(bid.time),
        secondary: bid.price,
      })),
      color: supplier.color,
    }));
  }, [suppliersData]);

  const primaryAxis = useMemo(
    (): AxisOptions<TBid> => ({
      getValue: (datum) => datum.primary,
      scaleType: 'localTime',
      elementType: 'line' as const,
      formatters: {
        scale: (value) => {
          // Format the date to only show the time
          return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
          }).format(new Date(value));
        },
      },
      curve: curveLinear,
    }),
    [],
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<TBid>[] => [
      {
        getValue: (datum) => datum.secondary,
        scaleType: 'linear',
        elementType: 'line' as const,
        curve: curveLinear,
      },
    ],
    [],
  );

  const options = {
    data,
    primaryAxis,
    secondaryAxes,
  };

  return <Chart options={options} />;
};

export default RealTimeAuctionCard;
