import React, { FC } from 'react';

import { IListingModel } from '@/utils/types/be-model-types';

const AuctionBasicDetails: FC<TAuctionBasicDetailsProps> = ({ auction }) => {
  return (
    <table className="table-auto w-full">
      {/* Table header */}
      <thead className="text-base uppercase text-slate-400  bg-slate-50 rounded-sm">
        <tr>
          <th className="p-2">
            <div className="font-semibold text-left">Name</div>
          </th>
          <th className="p-2">
            <div className="font-semibold text-center">Category</div>
          </th>
          <th className="p-2">
            <div className="font-semibold text-center">Project Owner</div>
          </th>
          <th className="p-2">
            <div className="font-semibold text-center">Status</div>
          </th>
          <th className="p-2">
            <div className="font-semibold text-center">Type of Lisiting</div>
          </th>
        </tr>
      </thead>
      {/* Table body */}
      <tbody className="text-md font-medium divide-y divide-slate-100">
        {auction ? (
          auction.lots.map((lot, index) => (
            <tr key={index}>
              {/* Name Column */}
              <td className="p-2">
                <div className="text-left">{auction.name}</div>
              </td>

              {/* Category Column */}
              <td className="p-2">
                <div className="text-center">{lot.category.name}</div>
              </td>

              {/* Project Owner Column */}
              <td className="p-2">
                <div className="text-center">{auction.projectOwner}</div>
              </td>

              {/* Status Column */}
              <td className="p-2">
                <div className="text-center">{auction.status}</div>
              </td>

              {/* Type of Listing Column */}
              <td className="p-2">
                <div className="text-center">{auction.typesOfListing}</div>
              </td>
            </tr>
          ))
        ) : (
          // Fallback UI when auction is undefined
          <tr>
            <td className="p-2 text-center">No auction data available.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

type TAuctionBasicDetailsProps = {
  auction: IListingModel;
};

export default AuctionBasicDetails;
