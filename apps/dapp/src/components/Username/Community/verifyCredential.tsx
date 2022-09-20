import { ChangeEvent, useContext, useState } from 'react';

import { Verify } from 'components/Verify';
import { BoxStep } from 'components/Verify/boxStep';
import { Explore } from 'components/Icons';
import { GeneralContext } from 'context';

interface IProps {
  currentEducation: {
    credential: any;
    stamps: any[];
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

export const VerifyCredential = (props: IProps) => {
  const { currentEducation, onClose } = props;
  const [values, setValues] = useState<MOCK_IValues>({});
  const { walletInformation } = useContext(GeneralContext);

  const handleClose = () => {
    if (!window) return;

    // TODO: WE SHOULD USE onClose INSTEAD
    window.location.reload();
  };

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
  };

  const handleStep2 = (stamp: Object, id: string) => {
    console.log('Stamp added!');
  };

  return (
    <Verify
      initialList={MOCK_EDUCATION}
      onClose={handleClose}
      component={({ currentVerify }) => (
        <>
          {currentVerify?.id === 'platzi' && (
            <>
              <BoxStep
                title="Step 1"
                description={
                  currentEducation?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Enter your information'
                }
                form={{
                  inputs: currentEducation?.credential
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
                  button: currentEducation?.credential
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
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  currentEducation?.stamps?.length !== 0
                    ? 'Step completed, you can now check your stamp'
                    : 'Step 2 to stamp verification'
                }
                form={{
                  button:
                    currentEducation?.stamps?.length !== 0
                      ? { text: 'Check it', onClick: () => {} }
                      : {
                          text: 'Stamp',
                          onClick: () =>
                            handleStep2({ did: 123 }, currentVerify.id)
                        }
                }}
                isLoading={false}
                iconType="stamp"
              />
            </>
          )}
          {currentVerify?.id === 'udemy' && (
            <>
              <BoxStep
                title="Step 1"
                description={
                  currentEducation?.credential
                    ? 'Step completed, you can now check your credential'
                    : 'Enter your information'
                }
                form={{
                  inputs: currentEducation?.credential
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
                  button: currentEducation?.credential
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
                iconType="credential"
              />
              <BoxStep
                title="Step 2"
                description={
                  currentEducation?.stamps?.length !== 0
                    ? 'Step completed, you can now check your stamp'
                    : 'Step 2 to stamp verification'
                }
                form={{
                  button:
                    currentEducation?.stamps?.length !== 0
                      ? { text: 'Check it', onClick: () => {} }
                      : {
                          text: 'Stamp',
                          onClick: () =>
                            handleStep1({ did: 123 }, currentVerify.id)
                        }
                }}
                isLoading={false}
                iconType="stamp"
              />
            </>
          )}
        </>
      )}
    />
  );
};
