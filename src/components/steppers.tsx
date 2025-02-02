import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ReactNode, forwardRef, useImperativeHandle, useState } from 'react';

/** 元件參數型別 */
interface StepperProps {
  /** 步驟說明文字 */
  steps: string[];
  /** 子元件，可以是任何 React 元素 */
  children: ReactNode[];
  /** 步驟數值 */
  activeStepNum?: number;
}

export const Steppers = forwardRef<{ nextStep: () => void }, StepperProps>(
  ({ steps, children, activeStepNum }, ref) => {
    const [activeStep, setActiveStep] = useState(activeStepNum ?? 0);

    const handleNext = () => {
      setActiveStep((prevActiveStep) => {
        const newStep = prevActiveStep + 1;
        console.log('handleNext 被執行，當前步驟:', newStep);
        return newStep;
      });
    };

    // const handleBack = () => {
    //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
    // };

    const handleReset = () => {
      setActiveStep(0);
    };

    useImperativeHandle(ref, () => ({
      nextStep: handleNext,
    }));

    return (
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className='container py-4'>{children[activeStep]}</div>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              {/* <Button
                color='inherit'
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                上一步
              </Button> */}
              {/* <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? '完成' : '下一步'}
              </Button> */}
            </Box>
          </React.Fragment>
        )}
      </Box>
    );
  }
);

export default Steppers;
