import { IListingModel } from '@/utils/types/be-model-types';
import React, { FC } from 'react';

const statusColors = {
  'In Progress': 'green',
  Closed: 'gray',
  Upcoming: '#00CED1',
};

const PastListingsTable: FC<TPastListingsTableProps> = ({ listings }) => {
  function getStatusColor(status) {
    return statusColors[status] || 'gray'; // Default color
  }
  return (
    <div className="col-span-full xl:col-span-12 bg-white shadow-lg rounded-sm border border-slate-200 h-[338px]">
      <header className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800 ">Past Auctions</h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto max-h-[255px] overflow-y-auto">
          <table className="table-auto w-full h-full">
            {/* Table header */}
            <thead className="text-xs uppercase text-slate-400  bg-slate-50 rounded-sm">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-left">Auction Name</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Buyer Name</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">
                    Type of Listings
                  </div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">
                    Auction Status
                  </div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-slate-100">
              {listings?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No Past Auctions Available
                  </td>
                </tr>
              ) : (
                listings?.map((listing) => (
                  <tr key={listing._id}>
                    <td className="p-2">
                      <div className="text-left capitalize">
                        {listing?.name}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-center">
                        {listing?.buyer?.firstName +
                          ' ' +
                          listing?.buyer?.lastName}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-center capitalize">
                        {listing?.typesOfListing}
                      </div>
                    </td>
                    <td className="p-2">
                      <div
                        className="text-center"
                        style={{
                          color: `${getStatusColor(listing?.status)}`,
                        }}
                      >
                        {listing?.status}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

type TPastListingsTableProps = { listings: IListingModel[] };

export default PastListingsTable;
