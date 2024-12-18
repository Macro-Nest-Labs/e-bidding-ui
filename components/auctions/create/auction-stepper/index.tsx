import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import React, { FunctionComponent, useState } from 'react';
import { toast } from 'react-hot-toast';

import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';

import Step1 from '../step-1';
import Step2 from '../step-2';
import Step3 from '../step-3';
import Step4 from '../step-4';
import Step5 from '../step-5';
import { IFormData, ITermsAndConditionData } from '../types';
import { TypeOfListing } from '@/utils/types/be-model-types';

dayjs.extend(utc);
dayjs.extend(timezone);

const AuctionStepper: FunctionComponent<TAuctionStepperProps> = ({ steps }) => {
  const [formData, setFormData] = useState<IFormData>({
    // Step 1 fields
    name: '',
    description: '',
    typeOfListing: TypeOfListing.CLASSIC,
    startingBidPrice: 0,
    region: '',
    deptCode: '',
    businessUnit: '',
    // Step 2 fields
    startDate: dayjs(new Date()).tz('Asia/Kolkata'),
    startTime: dayjs(new Date()).tz('Asia/Kolkata'),
    duration: dayjs().startOf('day').tz('Asia/Kolkata'),
    contractDuration: '',
    bidDecrementPercentage: 0.1,
    rules: [],
    // Step 3 fields
    suppliers: [],
    currency: '',
    projectOwner: '',
    phoneNumber: '',
    requiresSupplierLogin: false,
    //Step 5 fields
    lotPrice: 0,
    category: '',
  });

  const [TCdata, setTCData] = useState<ITermsAndConditionData>({
    priceBasis: '',
    taxesAndDuties: '',
    delivery: '',
    paymentTerms: '',
    warrantyGurantee: '',
    inspectionRequired: false,
    otherTerms: '',
    awardingDecision: '',
  });

  // Retrieve existing data from localStorage
  const existingDataString: string | null =
    typeof window !== 'undefined' ? localStorage.getItem('formData') : null;

  // Parse the existing data or use default values if it doesn't exist
  const existingData: { step: number; formData: IFormData } = existingDataString
    ? JSON.parse(existingDataString)
    : { step: 0, formData: formData };

  const [activeStep, setActiveStep] = useState(existingData.step);

  // Step 2: Validate Time Duration
  const validateTimeDuration = () => {
    const totalDuration =
      dayjs(formData.duration).hour() * 60 + dayjs(formData.duration).minute();

    if (totalDuration <= 0) {
      toast.error('Time Duration cannot be zero');
      return false;
    }
    return true;
  };

  const next = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void => {
    event.preventDefault();

    const validateStep = () => {
      switch (activeStep) {
        case 0:
          validateStep1();
          break;
        case 1:
          validateStep2();
          break;
        case 2:
          validateStep3();
          break;
        case 3:
          validateStep4();
          break;
        default:
          break;
      }
    };

    const validateStep1 = () => {
      if (!formData.name) {
        toast.error('Name field is required');
        return;
      }

      if (!formData.typeOfListing) {
        toast.error('Type of Listing is required');
        return;
      }

      if (!formData.region) {
        toast.error('Region is required');
        return;
      }

      if (!formData.deptCode) {
        toast.error('Department Code is required');
        return;
      }

      if (!formData.businessUnit) {
        toast.error('Business Unit is required');
        return;
      }

      proceedToNextStep();
    };

    const validateStep2 = () => {
      if (!validateTimeDuration()) {
        return;
      }

      proceedToNextStep();
    };

    const validateStep3 = () => {
      if (!formData.currency) {
        toast.error('Currency field is required');
        return;
      }

      if (formData.suppliers.length === 0) {
        toast.error('At least one Supplier must be selected');
        return;
      }

      if (formData.rules.length === 0) {
        toast.error('At least one Auction Rule must be selected');
        return;
      }

      proceedToNextStep();
    };

    const validateStep4 = () => {
      if (!TCdata.priceBasis) {
        toast.error('Price Basis is required');
        return;
      }

      if (!TCdata.taxesAndDuties) {
        toast.error('Taxes And Duties is required');
        return;
      }

      if (!TCdata.delivery) {
        toast.error('Delivery is required');
        return;
      }

      if (!TCdata.paymentTerms) {
        toast.error('paymentTerms Code is required');
        return;
      }

      if (!TCdata.warrantyGurantee) {
        toast.error('warranty And Gurantee is required');
        return;
      }

      if (!TCdata.otherTerms) {
        toast.error('Other Terms  is required');
        return;
      }

      if (!TCdata.awardingDecision) {
        toast.error('Awarding Terms  is required');
        return;
      }

      proceedToNextStep();
    };

    const proceedToNextStep = () => {
      const totalSteps = steps?.length ?? 0;
      if (activeStep + 1 < totalSteps) {
        setActiveStep((prev) => prev + 1);
        const updatedData = { ...formData, step: activeStep + 1 };
        localStorage.setItem('formData', JSON.stringify(updatedData));
      }
    };

    validateStep();
  };

  const prev = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void => {
    event.preventDefault();
    if (activeStep - 1 >= 0) {
      setActiveStep((prev) => prev - 1);
    }

    const updatedData = { ...existingData, step: activeStep - 1 };
    const updatedDataString: string = JSON.stringify(updatedData);
    localStorage.setItem('formData', updatedDataString);
  };

  const getActiveStepComponent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Step1
            formData={formData}
            setFormData={setFormData}
            next={next}
            prev={prev}
          />
        );
      case 1:
        return (
          <Step2
            formData={formData}
            setFormData={setFormData}
            next={next}
            prev={prev}
          />
        );
      case 2:
        return (
          <Step3
            formData={formData}
            setFormData={setFormData}
            next={next}
            prev={prev}
          />
        );

      case 3:
        return (
          <Step4
            next={next}
            prev={prev}
            TCData={TCdata}
            setTCData={setTCData}
          />
        );

      case 4:
        return (
          <Step5
            formData={formData}
            setFormData={setFormData}
            TCData={TCdata}
            prev={prev}
          />
        );
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '100%', p: 2, marginTop: 6 },
        }}
        noValidate
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        {getActiveStepComponent()}
      </Box>
    </Box>
  );
};

type TAuctionStepperProps = {
  steps: string[];
};

export default AuctionStepper;
