import React, { useEffect, useState } from 'react';

import {
  FormControlLabel,
  Button,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Autocomplete,
} from '@mui/material';
import { IFormData } from '../types';
import axios from 'axios';
import { NEXT_PUBLIC_ARG_BE_URL } from '@/constants';
import { ISuppliersResponse } from '@/utils/types/api-types';
import { ISupplierModel } from '@/utils/types/be-model-types';
import { toast } from 'react-hot-toast';
import { currencyArray } from '@/utils/functions/currency';

// Placeholder for supplier options - replace with actual data as needed
const ruleOptions = ['Rule 1', 'Rule 2', 'Rule 3'];
const projectOwner = [
  { value: '1001', label: 'Owner-1' },
  { value: '1002', label: 'Owner-2' },
];
interface Step3Props {
  formData: IFormData;
  setFormData: React.Dispatch<React.SetStateAction<Step3Props['formData']>>;
  // eslint-disable-next-line no-unused-vars
  next: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  // eslint-disable-next-line no-unused-vars
  prev: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Step3: React.FC<Step3Props> = ({ formData, setFormData, next, prev }) => {
  const [localData, setLocalData] = useState<IFormData | null>(null);
  const [suppliers, setSuppliers] = useState<ISupplierModel[]>([]);

  const handleRulesChange = (
    event: React.SyntheticEvent,
    newValue: string[],
  ) => {
    // Assuming rules are input as a comma-separated string
    setFormData((prev) => ({ ...prev, rules: newValue }));
  };

  const handleRequiresSupplierLoginChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      requiresSupplierLogin: event.target.checked,
    }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const existingDataString: string | null =
      typeof window !== 'undefined' ? localStorage.getItem('formData') : null;
    const existingData = existingDataString
      ? JSON.parse(existingDataString)
      : null;
    setLocalData(existingData);
  }, []);

  useEffect(() => {
    if (localData) {
      setFormData((prev) => ({ ...prev, ...localData }));
    }
  }, [localData, setFormData]);

  useEffect(() => {
    let isMounted = true;

    async function fetchSuppliers() {
      const suppliersSlugPath = '/suppliers/';
      try {
        const response = await axios.get<ISuppliersResponse>(
          `${NEXT_PUBLIC_ARG_BE_URL}${suppliersSlugPath}`,
        );
        if (isMounted) {
          setSuppliers(response.data.data);
        }
      } catch (error) {
        toast.error(`Error fetching suppliers data: ${error}`);
      }
    }

    fetchSuppliers();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!formData) {
    return null;
  }

  return (
    <div
      className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200"
      style={{ marginBottom: '3rem' }}
    >
      <Stack sx={{ py: 3 }} gap={2}>
        <TextField
          select
          label="Currency *"
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          fullWidth
        >
          {currencyArray?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Project Owner"
          name="projectOwner"
          value={formData.projectOwner}
          onChange={handleChange}
          fullWidth
        >
          {projectOwner.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          fullWidth
        />
        {/*TODO: Looks odd, look into more appealing input type */}
        <FormControlLabel
          control={
            <Switch
              checked={formData.requiresSupplierLogin}
              onChange={handleRequiresSupplierLoginChange}
              name="requiresSupplierLogin"
            />
          }
          label="Requires Supplier Login"
        />
        <Autocomplete
          multiple
          options={suppliers}
          getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
          value={suppliers.filter((supplier) =>
            formData.suppliers.includes(supplier._id),
          )}
          onChange={(event, newValue) => {
            setFormData((prev) => ({
              ...prev,
              suppliers: newValue.map((supplier) => supplier._id),
            }));
          }}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Suppliers *" />
          )}
          fullWidth
        />

        <Autocomplete
          multiple
          options={ruleOptions}
          value={formData.rules}
          onChange={handleRulesChange}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Auction Rules *" />
          )}
          fullWidth
        />
      </Stack>
      <Stack
        direction={'row'}
        spacing={2}
        mt={2}
        justifyContent={'space-between'}
      >
        <Button variant="outlined" onClick={prev}>
          Back
        </Button>
        <Button variant="outlined" onClick={next}>
          Next
        </Button>
      </Stack>
    </div>
  );
};

export default Step3;
