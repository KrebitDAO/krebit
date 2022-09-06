import { ChangeEvent, useContext, useState } from 'react';

import { Verify } from 'components/Verify';
import { BoxStep } from 'components/Verify/boxStep';
import { Explore } from 'components/Icons';
import { constants } from 'utils';
import { GeneralContext } from 'context';

interface IProps {
  currentEducation: {
    platzi: {
      credential: Object;
      stamp: Object;
    };
    udemy: {
      credential: Object;
      stamp: Object;
    };
  };
  onClose: () => void;
}

interface MOCK_IValues {
  [id: string]: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
  };
}

const MOCK_EDUCATION = [
  {
    id: 'platzi',
    text: 'Platzi',
    icon: <Explore />
  },
  {
    id: 'udemy',
    text: 'Udemy',
    icon: <Explore />
  }
];

export const VerifyEducationCredential = (props: IProps) => {
  const { currentEducation, onClose } = props;
  const [values, setValues] = useState<MOCK_IValues>({});
  const [currentCredentials, setCurrentCredentials] = useState({});
  const [currentStamps, setCurrentStamps] = useState({});
  const { walletInformation } = useContext(GeneralContext);

  const handleValues = (event: ChangeEvent<HTMLInputElement>, id: string) => {
    const { name, value } = event.target;

    setValues(prevValues => ({
      ...prevValues,
      [id]: {
        ...prevValues[id],
        [name]: value
      }
    }));
  };

  const handleStep1 = (credential: Object, id: string) => {
    console.log('Credential added!');
    setCurrentCredentials(prevValues => ({
      ...prevValues,
      [id]: {
        credential
      }
    }));
  };

  const handleStep2 = (stamp: Object, id: string) => {
    console.log('Stamp added!');
    setCurrentStamps(prevValues => ({
      ...prevValues,
      [id]: {
        stamp
      }
    }));
  };

  console.log(values, currentCredentials, currentStamps);

  return (
    <Verify
      initialList={MOCK_EDUCATION}
      onClose={onClose}
      component={({ currentVerify }) => (
        <>
          {currentVerify?.id === 'platzi' && (
            <>
              <BoxStep
                title="Step 1"
                description={
                  currentEducation.platzi.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Enter your information'
                }
                form={{
                  inputs: currentEducation.platzi.credential
                    ? undefined
                    : [
                        {
                          name: 'name',
                          placeholder: 'Enter the name',
                          value: values[currentVerify?.id]?.name || '',
                          onChange: event =>
                            handleValues(event, currentVerify.id)
                        },
                        {
                          name: 'description',
                          placeholder: 'Enter the description',
                          value: values[currentVerify?.id]?.description || '',
                          onChange: event =>
                            handleValues(event, currentVerify.id)
                        },
                        {
                          type: 'date',
                          name: 'startDate',
                          placeholder: 'Enter the startDate',
                          value: values[currentVerify?.id]?.startDate,
                          onChange: event =>
                            handleValues(event, currentVerify.id)
                        },
                        {
                          type: 'date',
                          name: 'endDate',
                          placeholder: 'Enter the endDate',
                          value: values[currentVerify?.id]?.endDate,
                          onChange: event =>
                            handleValues(event, currentVerify.id)
                        }
                      ],
                  button: currentEducation.platzi.stamp
                    ? { text: 'Check it', onClick: () => {} }
                    : {
                        text: 'Verify',
                        onClick:
                          !values[currentVerify?.id]?.name ||
                          !values[currentVerify?.id]?.description ||
                          !values[currentVerify?.id]?.startDate ||
                          !values[currentVerify?.id]?.endDate
                            ? undefined
                            : () => handleStep1({ did: 123 }, currentVerify.id),
                        isDisabled:
                          !values[currentVerify?.id]?.name ||
                          !values[currentVerify?.id]?.description ||
                          !values[currentVerify?.id]?.startDate ||
                          !values[currentVerify?.id]?.endDate
                      }
                }}
              />
              <BoxStep
                title="Step 2"
                description={
                  currentEducation.platzi.credential
                    ? 'Step completed, you can now check your stamp'
                    : 'Step 2 to stamp verification'
                }
                form={{
                  button: currentEducation.platzi.credential
                    ? { text: 'Check it', onClick: () => {} }
                    : {
                        text: 'Stamp',
                        onClick: () =>
                          handleStep2({ did: 123 }, currentVerify.id)
                      }
                }}
                isLoading={false}
              />
            </>
          )}
          {currentVerify?.id === 'udemy' && (
            <>
              <BoxStep
                title="Step 1"
                description={
                  currentEducation.udemy.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Enter your information'
                }
                form={{
                  inputs: currentEducation.udemy.credential
                    ? undefined
                    : [
                        {
                          name: 'name',
                          placeholder: 'Enter the name',
                          value: values[currentVerify?.id]?.name || '',
                          onChange: event =>
                            handleValues(event, currentVerify.id)
                        },
                        {
                          name: 'description',
                          placeholder: 'Enter the description',
                          value: values[currentVerify?.id]?.description || '',
                          onChange: event =>
                            handleValues(event, currentVerify.id)
                        },
                        {
                          type: 'date',
                          name: 'startDate',
                          placeholder: 'Enter the startDate',
                          value: values[currentVerify?.id]?.startDate,
                          onChange: event =>
                            handleValues(event, currentVerify.id)
                        },
                        {
                          type: 'date',
                          name: 'endDate',
                          placeholder: 'Enter the endDate',
                          value: values[currentVerify?.id]?.endDate,
                          onChange: event =>
                            handleValues(event, currentVerify.id)
                        }
                      ],
                  button: currentEducation.udemy.stamp
                    ? { text: 'Check it', onClick: () => {} }
                    : {
                        text: 'Verify',
                        onClick:
                          !values[currentVerify?.id]?.name ||
                          !values[currentVerify?.id]?.description ||
                          !values[currentVerify?.id]?.startDate ||
                          !values[currentVerify?.id]?.endDate
                            ? undefined
                            : () => handleStep1({ did: 123 }, currentVerify.id),
                        isDisabled:
                          !values[currentVerify?.id]?.name ||
                          !values[currentVerify?.id]?.description ||
                          !values[currentVerify?.id]?.startDate ||
                          !values[currentVerify?.id]?.endDate
                      }
                }}
              />
              <BoxStep
                title="Step 2"
                description={
                  currentEducation.udemy.credential
                    ? 'Step completed, you can now check your stamp'
                    : 'Step 2 to stamp verification'
                }
                form={{
                  button: currentEducation.udemy.credential
                    ? { text: 'Check it', onClick: () => {} }
                    : {
                        text: 'Stamp',
                        onClick: () =>
                          handleStep1({ did: 123 }, currentVerify.id)
                      }
                }}
                isLoading={false}
              />
            </>
          )}
        </>
      )}
    />
  );
};
