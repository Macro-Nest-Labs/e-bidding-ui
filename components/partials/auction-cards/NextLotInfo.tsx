import React, { FC } from 'react';
import { ILotModel } from '@/utils/types/be-model-types';

import LotItemTable from './LotItemTable';

const NextLotInfoCard: FC<TNextLotInfoCardProps> = ({ nextLot, className }) => {
  const nextLotDetails = [
    {
      label: 'Lot Number',
      value: nextLot._id,
    },
    {
      label: 'Lot Category',
      value: nextLot?.category?.name,
    },
    {
      label: 'Lot Price',
      value: nextLot?.lotPrice,
    },
  ];

  return (
    <div
      className={`bg-white shadow-lg rounded-sm border p-4 border-slate-200 ${className}`}
    >
      <header className="py-4 border-b border-slate-100 text-center">
        <h2 className="font-semibold text-slate-800 ">Next Lot Information</h2>
      </header>
      <div className="flex flex-wrap items-center sm:grid-cols-1 gap-8 mt-4">
        <LotItemTable
          className="w-[calc(50%-8px)]"
          lotItems={nextLot?.lotItems || []}
        />
        <div className="w-[calc(50%-30px)]">
          {nextLotDetails.map((lotItem, index) => (
            <React.Fragment key={index}>
              <div
                className={`flex justify-between items-center py-2 ${
                  index < nextLotDetails.length - 1 ? 'border-b' : ''
                } border-gray-300`}
              >
                <strong className="font-bold text-gray-700 w-1/3">
                  {lotItem.label}
                </strong>
                <p className="text-gray-600 font-normal w-1/2 text-left">
                  {lotItem.value}
                </p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

type TNextLotInfoCardProps = {
  nextLot: ILotModel;
  className?: string;
};

export default NextLotInfoCard;
