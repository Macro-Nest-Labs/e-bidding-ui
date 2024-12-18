// import Autocomplete from '@mui/material/Autocomplete';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import React, { FunctionComponent, useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { TimeField } from '@mui/x-date-pickers/TimeField';

import { IFormData } from '../types';

dayjs.extend(utc);
dayjs.extend(timezone);

interface Step2Props {
  formData: IFormData;
  setFormData: React.Dispatch<React.SetStateAction<IFormData>>;
  // eslint-disable-next-line no-unused-vars
  next: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  // eslint-disable-next-line no-unused-vars
  prev: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Step2: FunctionComponent<Step2Props> = ({
  formData,
  setFormData,
  prev,
  next,
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (localData) {
      setFormData((prev) => ({ ...prev, ...localData }));
    }
  }, [localData, setFormData]);

  if (!formData) {
    return null;
  }

  return (
    <div
      className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200"
      style={{ marginBottom: '3rem' }}
    >
      <Stack sx={{ py: 3 }}>
        <Stack spacing={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              minDate={dayjs(new Date()).tz('Asia/Kolkata')}
              defaultValue={dayjs(new Date()).tz('Asia/Kolkata')}
              label="Start Date *"
              value={dayjs(formData.startDate).tz('Asia/Kolkata')}
              onChange={(newValue) =>
                setFormData((prev) => ({ ...prev, startDate: newValue }))
              }
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileTimePicker
              value={dayjs(formData.startTime).tz('Asia/Kolkata')}
              label="Start Time *"
              onChange={(startTime) => {
                setFormData((prev) => ({ ...prev, startTime: startTime }));
              }}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimeField
              label="Duration *"
              value={dayjs(formData.duration)}
              onChange={(newValue) =>
                setFormData((prev) => ({ ...prev, duration: newValue }))
              }
              format="HH:mm"
            />
          </LocalizationProvider>

          <TextField
            label="Contract Duration"
            name="contractDuration"
            value={formData.contractDuration}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Bid Decrement Percentage"
            name="bidDecrementPercentage"
            type="number"
            value={formData.bidDecrementPercentage}
            onChange={handleChange}
            fullWidth
            InputProps={{
              endAdornment: <InputAdornment position="start">%</InputAdornment>,
              inputProps: {
                step: '0.1',
                min: '0',
                max: '100',
              },
            }}
          />
        </Stack>

        <Stack
          direction={'row'}
          spacing={2}
          mt={3}
          justifyContent={'space-between'}
        >
          <Button variant="outlined" onClick={prev}>
            Back
          </Button>
          <Button variant="outlined" onClick={next}>
            Next
          </Button>
        </Stack>
      </Stack>
    </div>
  );
};

export default Step2;
