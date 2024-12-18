import React from 'react';

import { ILotItemModel } from '@/utils/types/be-model-types';

type LotItemsTableProp = {
  lotItems: ILotItemModel[];
  className?: string;
};

const LotItemTable: React.FC<LotItemsTableProp> = ({ lotItems, className }) => {
  return (
    <div
      className={`bg-white shadow-lg rounded-sm border border-slate-200 ${className}`}
    >
      <header className="py-4 border-b border-slate-100 text-center">
        <h2 className="font-semibold text-slate-800 ">Lot Items</h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto max-h-[255px] overflow-y-auto">
          <table className="table-auto w-full h-full">
            {/* Table header */}
            <thead className="text-sm uppercase text-slate-400  bg-slate-50 rounded-sm">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-left">Name</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Quantity</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">UOM</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-slate-100">
              {lotItems?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    No lot Items available.
                  </td>
                </tr>
              ) : (
                lotItems.map((lotItem, itemIndex) => (
                  <tr key={`${itemIndex}`}>
                    {/* Product Column */}
                    <td className="p-2">
                      <div className="text-left">{lotItem.product.name}</div>
                    </td>

                    {/* Quantity Column */}
                    <td className="p-2">
                      <div className="text-center text-emerald-500">
                        {lotItem.qty}
                      </div>
                    </td>

                    {/* UOM Column */}
                    <td className="p-2">
                      <div className="text-center">{lotItem.uom}</div>
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

export default LotItemTable;
