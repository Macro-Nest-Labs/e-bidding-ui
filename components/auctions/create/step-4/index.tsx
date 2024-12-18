import React, { useState, useEffect } from 'react';
import {
  Button,
  Stack,
  TextField,
  Switch,
  Typography,
  MenuItem,
} from '@mui/material';

import { ITermsAndConditionData } from '../types';

interface Step4Props {
  TCData: ITermsAndConditionData;
  setTCData: React.Dispatch<React.SetStateAction<ITermsAndConditionData>>;
  // eslint-disable-next-line no-unused-vars
  next: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  // eslint-disable-next-line no-unused-vars
  prev: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const step4: React.FC<Step4Props> = ({ next, prev, TCData, setTCData }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTCData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInspectionRequiredChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTCData((prev) => ({
      ...prev,
      inspectionRequired: event.target.checked,
    }));
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [localData, setLocalData] = useState<ITermsAndConditionData | null>(
    null,
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const existingDataString: string | null =
      typeof window !== 'undefined'
        ? localStorage.getItem('terms-and-condition')
        : null;
    const existingData = existingDataString
      ? JSON.parse(existingDataString)
      : null;
    setLocalData(existingData);
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (localData) {
      setTCData((prev) => ({ ...prev, ...localData }));
    }
  }, [localData, setTCData]);

  const handleNext = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    localStorage.setItem('terms-and-condition', JSON.stringify(TCData));

    next(event);
  };

  return (
    <div
      className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200"
      style={{ marginBottom: '3rem' }}
    >
      <Stack sx={{ py: 3 }} gap={2}>
        <TextField
          multiline
          label="Price Basis"
          name="priceBasis"
          value={TCData.priceBasis}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          multiline
          label="Taxes And Duties"
          name="taxesAndDuties"
          value={TCData.taxesAndDuties}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          multiline
          label="Delivery"
          name="delivery"
          value={TCData.delivery}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          multiline
          label="Payment Terms"
          name="paymentTerms"
          value={TCData.paymentTerms}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          multiline
          label="Warrenty And Gurantee"
          name="warrantyGurantee"
          value={TCData.warrantyGurantee}
          onChange={handleChange}
          fullWidth
        />

        <Stack>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Typography color="#1894e0">Inspection Required</Typography>
            <Switch
              size="medium"
              name="inspectionRequired"
              checked={TCData.inspectionRequired}
              onChange={handleInspectionRequiredChange}
            />
          </div>
        </Stack>

        <TextField
          multiline
          label="Other Terms"
          name="otherTerms"
          value={TCData.otherTerms}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          select
          label="AwardingDecision"
          name="awardingDecision"
          value={TCData.awardingDecision}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem key="ONE" value="one">
            One
          </MenuItem>
          <MenuItem key="TWO" value="two">
            Two
          </MenuItem>
          <MenuItem key="MULTIPLE" value="multiple">
            Multiple
          </MenuItem>
        </TextField>
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
        <Button variant="outlined" onClick={handleNext}>
          Next
        </Button>
      </Stack>
    </div>
  );
};

export default step4;
