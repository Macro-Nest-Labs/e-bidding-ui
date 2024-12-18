import { IBidModel } from '@/utils/types/be-model-types';

export type TSupplierData = {
  id: string;
  name: string;
  bids: { price: number; time: string }[];
  color: string;
};

export const supplierColors = [
  '#FF6633',
  '#FFB399',
  '#FF33FF',
  '#FFFF99',
  '#00B3E6',
  '#E6B333',
  '#3366E6',
  '#999966',
  '#99FF99',
  '#B34D4D',
  '#80B300',
  '#809900',
  '#E6B3B3',
  '#6680B3',
  '#66991A',
  '#FF99E6',
  '#CCFF1A',
  '#FF1A66',
  '#E6331A',
  '#33FFCC',
];

export const transformBidsToSuppliersData = (
  bids: IBidModel[],
): TSupplierData[] => {
  const suppliersMap = new Map();

  bids.forEach((bid) => {
    const { supplier, amount, createdAt } = bid;
    if (!suppliersMap.has(supplier._id)) {
      // Assign color based on the index of the supplier in the map
      const colorIndex = suppliersMap.size % supplierColors.length;
      suppliersMap.set(supplier._id, {
        id: supplier._id,
        name: `${supplier.firstName} ${supplier.lastName}`,
        bids: [],
        color: supplierColors[colorIndex],
      });
    }
    suppliersMap
      .get(supplier._id)
      .bids.push({ price: amount, time: createdAt });
  });

  return Array.from(suppliersMap.values());
};
