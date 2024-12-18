import React, { FunctionComponent, useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { IFormData } from '../types';
import { State } from '@/utils/functions/regions';
import { TypeOfListing } from '@/utils/types/be-model-types';

interface Step1Props {
  formData: IFormData;
  setFormData: React.Dispatch<React.SetStateAction<IFormData>>;
  // eslint-disable-next-line no-unused-vars
  next: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  // eslint-disable-next-line no-unused-vars
  prev: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Step1: FunctionComponent<Step1Props> = ({
  formData,
  setFormData,
  next,
  prev,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [localData, setLocalData] = useState<IFormData | null>(null);

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

  // const existingDataString: string | null = localStorage.getItem("formData");
  // const existingData = existingDataString
  // ? JSON.parse(existingDataString)
  // : null;

  return (
    <div
      className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200"
      style={{ marginBottom: '3rem' }}
    >
      <Stack spacing={2}>
        <TextField
          label="Name *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          inputProps={{ style: { textTransform: 'capitalize' } }}
          placeholder="Auction name must be unique"
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
        />
        <TextField
          select
          label="Type of Listing *"
          name="typeOfListing"
          value={formData.typeOfListing}
          onChange={handleChange}
          fullWidth
        >
          {Object.entries(TypeOfListing).map((option) => (
            <MenuItem key={option[1]} value={option[1]} className="capitalize">
              {option[1]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Region *"
          name="region"
          value={formData.region}
          onChange={handleChange}
          fullWidth
        >
          {Object.entries(State)?.map((option) => (
            <MenuItem key={option[0]} value={option[1]}>
              {option[1]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Department Code *"
          name="deptCode"
          value={formData.deptCode}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Business Unit *"
          name="businessUnit"
          value={formData.businessUnit}
          onChange={handleChange}
          fullWidth
        />
        {/* <TextField
        label="Starting Bid Price"
        name="startingBidPrice"
        value={formData.startingBidPrice}
        onChange={handleChange}
        type="number"
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: 0,
          step: 100,
        }}
      /> */}
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

export default Step1;
