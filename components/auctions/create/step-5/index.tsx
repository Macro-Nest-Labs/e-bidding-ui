import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import toast, { LoaderIcon } from 'react-hot-toast';

import { NEXT_PUBLIC_ARG_BE_URL } from '@/constants';
import { ICreateListingResponse } from '@/utils/types/api-types';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import {
  IFormData,
  ILotItemPayload,
  ILotPayload,
  ITermsAndConditionData,
} from '../types';

interface Step5Props {
  formData: IFormData;
  TCData: ITermsAndConditionData;
  setFormData: React.Dispatch<React.SetStateAction<Step5Props['formData']>>;
  // eslint-disable-next-line no-unused-vars
  prev: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const getSavedLots = () => {
  const savedLots =
    typeof window !== 'undefined' ? localStorage.getItem('lots') : null;
  return savedLots ? JSON.parse(savedLots) : [];
};

const getBuyerId = () => {
  return typeof window !== 'undefined' ? localStorage.getItem('buyerId') : null;
};

const Step5: React.FC<Step5Props> = ({
  formData,
  setFormData,
  TCData,
  prev,
}) => {
  const [lots, setLots] = useState<ILotPayload[]>(getSavedLots());
  const [isLoading, setIsLoading] = useState(false);
  const buyerId = getBuyerId();

  const [quantityErrors, setQuantityErrors] = useState<boolean[][]>(
    lots.map(() => []),
  );
  const [localData, setLocalData] = useState<IFormData | null>(null);

  useEffect(() => {
    const existingDataString: string | null =
      typeof window !== 'undefined' ? localStorage.getItem('formData') : null;
    const existingData = existingDataString
      ? JSON.parse(existingDataString)
      : null;
    setLocalData(existingData);
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (localData) {
      setFormData((prev) => ({ ...prev, ...localData }));
    }
  }, [localData, setFormData]);

  useEffect(() => {
    localStorage.setItem('lots', JSON.stringify(lots));
  }, [lots]);

  const handleCreateAuction = async () => {
    // Validate lots before submission
    const newQuantityErrors = lots.map(() =>
      Array(lots[0]?.lotItems.length).fill(false),
    );
    if (
      lots.some((lot, lotIndex) =>
        lot.lotItems.some((item, itemIndex) => {
          const qtyError = item.qty === 0;
          newQuantityErrors[lotIndex][itemIndex] = qtyError;
          return qtyError;
        }),
      )
    ) {
      toast.error('Quantity field must be greater than zero for all products.');
      setQuantityErrors(newQuantityErrors);
      return;
    }

    // Check if there is at least one lot and one product
    const emptyLots = lots.filter((lot) => lot.lotItems.length === 0);
    if (emptyLots.length > 0) {
      toast.error(`Add at least one product in each lot.`);
      return;
    }

    // Check if all lots have a category selected
    if (lots.some((lot) => lot.category.trim() === '')) {
      toast.error('Category must be selected for all lots.');
      return;
    }

    // Ensure each lot has a positive integer price
    if (lots.some((lot) => lot.lotPrice <= 0)) {
      toast.error('Each lot must have a positive price.');
      return;
    }

    // Check if all product names and UOMs are provided
    if (
      lots.some((lot) =>
        lot.lotItems.some(
          (item) => item.product.name.trim() === '' || item.uom.trim() === '',
        ),
      )
    ) {
      toast.error('Product name and UOM must be provided for all products.');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Creating listing...');

    try {
      // Create Listing
      const listingPayload = {
        listing: {
          name: formData.name,
          description: formData.description,
          typesOfListing: formData.typeOfListing,
          region: formData.region,
          departmentCode: formData.deptCode,
          businessUnit: formData.businessUnit,
          startDate: formData.startDate,
          startTime: formData.startTime,
          duration: dayjs(formData.duration).format('HH:mm'),
          contractDuration: formData.contractDuration,
          bidDecrementPercentage: formData.bidDecrementPercentage,
          currency: formData.currency,
          projectOwner: formData.projectOwner,
          mobileNumber: formData.phoneNumber,
          suppliers: formData.suppliers,
          // TODO: make rules dynamic
          rules: [],
          buyer: buyerId,
        },
        lots: lots,
        TCData: TCData,
      };
      const listingResponse = await axios.post<ICreateListingResponse>(
        `${NEXT_PUBLIC_ARG_BE_URL}/listings/`,
        listingPayload,
      );

      //Redirect or update UI after successful creation
      if (window && listingResponse.status === 201) {
        localStorage.removeItem('formData');
        localStorage.removeItem('lots');
        localStorage.removeItem('terms-and-condition');
        toast.success('Listing created successfully!', { id: toastId });
        setIsLoading(false);
        setTimeout(() => {
          window.location.href = '/auctions';
        }, 1500);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error('Error while creating the listing. Check all Steps again!', {
        id: toastId,
      });
    }
  };

  const category = [
    { value: '653ffadfca54c9e1278cf94b', label: 'A' },
    { value: '654f2691eff9fbe9d9cbd019', label: 'B' },
  ];

  // Adds a new lot
  const addLot = () => {
    setLots([...lots, { lotItems: [], lotPrice: 0, category: '' }]);
  };

  // Adds a new product to a lot
  const addProductToLot = (lotIndex: number) => {
    const updatedLots = [...lots];
    updatedLots[lotIndex].lotItems.push({
      product: { name: '', description: '' },
      qty: 1,
      uom: '',
    });
    setLots(updatedLots);

    // Initialize the error state for the newly added quantity field
    setQuantityErrors((prevErrors) => [
      ...prevErrors,
      Array(updatedLots[lotIndex].lotItems.length).fill(false),
    ]);
  };

  // Updates product item details within a lot
  const updateProductItem = <K extends keyof ILotItemPayload>(
    lotIndex: number,
    productIndex: number,
    field: K,
    value: ILotItemPayload[K],
  ) => {
    setLots((prevLots) => {
      const newLots = [...prevLots];
      const product = newLots[lotIndex].lotItems[productIndex];
      product[field] = value;
      return newLots;
    });
  };

  const updateCategory = (lotIndex: number, value: string) => {
    const updatedLotItems = [...lots];
    updatedLotItems[lotIndex].category = value;
    setLots(updatedLotItems);
  };

  const updateLotPrice = (lotIndex: number, value: number) => {
    if (value < 0) {
      toast.error('Lot price cannot be negative.');
      return;
    }
    setLots((prevLots) => {
      const newLots = [...prevLots];
      newLots[lotIndex].lotPrice = value;
      return newLots;
    });
  };

  const removeLotItem = (index: number) => {
    setLots(lots.filter((_, i) => i !== index));
  };

  // Removes a product from a lot
  const removeProductFromLot = (lotIndex: number, productIndex: number) => {
    const newLots = [...lots];
    newLots[lotIndex].lotItems.splice(productIndex, 1);
    setLots(newLots);
  };

  return (
    <div
      className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200"
      style={{ marginBottom: '3rem' }}
    >
      {/* Overlay effect */}
      <div
        className={`fixed w-screen h-full top-0 left-0 bg-black ${
          isLoading ? 'opacity-50' : 'opacity-0'
        } z-10 transition-opacity ease-in-out duration-500 ${
          !isLoading && 'pointer-events-none'
        }`}
      ></div>

      <div className="py-4">
        <button
          className="w-full sm:w-full md:1/2 middle none center rounded-lg bg-blue-500 py-3 px-4 font-sans text-sm font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          onClick={addLot}
        >
          Add a Lot
        </button>
      </div>

      <div className="max-h-[500px] overflow-y-scroll">
        {lots.map((lot, lotIndex) => (
          <Stack
            gap={2}
            key={lotIndex}
            sx={{
              backgroundColor: lotIndex % 2 === 0 ? '#e7f5ff' : '#fffbea',
              p: 4,
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              marginBottom: '3rem',
            }}
            my={4}
            mr={2}
            position="relative"
          >
            <div className="font-bold text-2xl mb-2">Lot #{lotIndex + 1}</div>
            <TextField
              select
              label="Category"
              name="category"
              value={lot.category}
              onChange={(e) => updateCategory(lotIndex, e.target.value)}
              fullWidth
            >
              {category.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Lot Price"
              type="number"
              value={lot.lotPrice}
              onChange={(e) =>
                updateLotPrice(lotIndex, parseFloat(e.target.value))
              }
              fullWidth
              inputProps={{
                step: '1000',
                min: 0,
              }}
            />

            <div className="flex justify-center">
              <button
                onClick={() => addProductToLot(lotIndex)}
                className='className="w-1/5 sm:w-1/5 md:w-1/5 middle none center rounded-lg bg-green-300 py-3 px-4 font-sans text-sm font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"'
              >
                Add Product
              </button>
            </div>

            {lot.lotItems.map((lotItem, productIndex) => (
              <Paper key={productIndex} sx={{ position: 'relative' }}>
                <Stack gap={2} px={8} py={4}>
                  <TextField
                    label={`Product ${productIndex + 1}`}
                    name="product"
                    value={lotItem.product.name}
                    onChange={(e) =>
                      updateProductItem(lotIndex, productIndex, 'product', {
                        ...lotItem.product,
                        name: e.target.value,
                      })
                    }
                    fullWidth
                    inputProps={{
                      min: 0,
                      step: 100,
                      style: { textTransform: 'capitalize' },
                    }}
                  />
                  <TextField
                    label={`Quantity ${productIndex + 1}`}
                    name="quantity"
                    value={lotItem.qty}
                    onChange={(e) =>
                      updateProductItem(
                        lotIndex,
                        productIndex,
                        'qty',
                        Number(e.target.value),
                      )
                    }
                    type="number"
                    error={quantityErrors[lotIndex]?.[productIndex]}
                    fullWidth
                    inputProps={{
                      min: 0,
                      step: 100,
                    }}
                  />
                  <TextField
                    label={`UOM ${productIndex + 1}`}
                    name="uom"
                    value={lotItem.uom}
                    onChange={(e) =>
                      updateProductItem(
                        lotIndex,
                        productIndex,
                        'uom',
                        e.target.value,
                      )
                    }
                    fullWidth
                    inputProps={{
                      min: 0,
                      step: 100,
                    }}
                  />
                </Stack>
                <button
                  onClick={() => removeProductFromLot(lotIndex, productIndex)}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    padding: '2px',
                  }}
                >
                  <HighlightOffIcon sx={{ height: '25px', width: '25px' }} />
                </button>
              </Paper>
            ))}

            <button
              onClick={() => removeLotItem(lotIndex)}
              style={{ position: 'absolute', right: 0, top: 0, padding: '2px' }}
            >
              <RemoveCircleOutlineIcon
                sx={{ height: '25px', width: '25px', color: 'red' }}
              />
            </button>
          </Stack>
        ))}
      </div>

      <Stack
        direction={'row'}
        spacing={2}
        mt={2}
        justifyContent={'space-between'}
      >
        <Button variant="outlined" onClick={prev}>
          Back
        </Button>
        <Button
          variant="outlined"
          onClick={handleCreateAuction}
          disabled={isLoading}
        >
          {isLoading ? <LoaderIcon /> : 'Submit'}
        </Button>
      </Stack>
    </div>
  );
};

export default Step5;
