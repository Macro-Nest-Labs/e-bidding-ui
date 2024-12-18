import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { NEXT_PUBLIC_ARG_BE_URL } from '@/constants';
import { ITermsAndConditionResponse } from '@/utils/types/api-types';

// const dummyTermsAndConditions = {
//   lot: '',
//   priceBasis: 'Fixed Price',
//   taxesAndDuties: 'All applicable taxes and duties are included in the price.',
//   delivery: 'Delivery will be made within 7 days of the order confirmation.',
//   paymentTerms: 'Payment is due within 30 days of the invoice date.',
//   warrantyGurantee: 'A 1-year warranty is provided for all products.',
//   inspectionRequired: true,
//   otherTerms:
//     'Any additional terms and conditions will be specified in the contract.',
//   awardingDecision: 'Lowest Price',
// };

const TermsAndConditionsCard: React.FC<TTermsAndConditionsCardProps> = ({
  className,
  lotId,
}) => {
  const [termsAndConditions, setTermsAndConditions] =
    useState<ITermsAndConditionResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (lotId) {
        try {
          const termsDetail = await axios.get<ITermsAndConditionResponse>(
            `${NEXT_PUBLIC_ARG_BE_URL}/terms-and-conditions/${lotId}`,
          );
          setTermsAndConditions(termsDetail.data);
        } catch (error) {
          toast.error(`Error fetching details: ${error}`);
        }
      }
    };

    fetchData();
  }, [lotId]);

  return (
    <div
      className={`bg-white shadow-lg rounded-sm border border-slate-200 p-4 font-sans ${className}`}
    >
      <header className="py-2 border-b border-slate-100 text-center">
        <h2 className="font-semibold text-gray-700 text-center ">
          Terms and Conditions
        </h2>
      </header>
      {termsAndConditions ? (
        <ul className="mt-3">
          {Object.entries(termsAndConditions.data).map(([term, value]) => {
            if (term === 'inspectionRequired') {
              // Special case for boolean
              value = value ? 'Yes' : 'No';
            }
            if (term === 'lot' && !value) {
              // Skip empty values
              return null;
            }
            return (
              <li key={term} className="mb-4 last:mb-0">
                <strong className="text-gray-700 capitalize">
                  {term.replace(/([A-Z])/g, ' $1')}:
                </strong>
                <span className="ml-2 text-gray-700">{value}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-700">
            No terms and conditions present for this lot.
          </span>
        </div>
      )}
    </div>
  );
};

type TTermsAndConditionsCardProps = {
  className?: string;
  lotId?: string;
};

export default TermsAndConditionsCard;
