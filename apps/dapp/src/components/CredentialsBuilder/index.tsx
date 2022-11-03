import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ErrorWrapper from 'next/error';

import { Wrapper } from './styles';
import { Card } from 'components/Credentials/styles';
import { Layout } from 'components/Layout';
import {
  Add,
  AddPhotoAlternate,
  ArrowForward,
  Close,
  OpenInNew
} from 'components/Icons';
import { Loading } from 'components/Loading';
import { Input } from 'components/Input';
import { Select } from 'components/Select';
import { DatePicker } from 'components/DatePicker';
import { Switch } from 'components/Switch';
import {
  CREDENTIALS_INITIAL_STATE,
  ICredentialsState
} from '../Credentials/initialState';
import { GeneralContext } from 'context';
import { constants, formatFilename, formatUrlImage } from 'utils';

// types
import { SelectChangeEvent } from '@mui/material';
import { QuestionModal } from 'components/QuestionModal';

interface IFormValues {
  [key: string]: string | string[] | number | boolean | File;
}

interface ICurrentInputModal {
  [name: string]: string;
}

export const CredentialsBuilder = () => {
  const [status, setStatus] = useState('idle');
  const [values, setValues] = useState<ICredentialsState>();
  const [formValues, setFormValues] = useState<IFormValues>({});
  const [currentInputModal, setCurrentInputModal] =
    useState<ICurrentInputModal>({});
  const { query } = useRouter();
  const { auth } = useContext(GeneralContext);
  const isLoading = status === 'idle' || status === 'pending';

  useEffect(() => {
    if (!query?.type) return;
    if (auth.status !== 'resolved') return;

    setStatus('pending');

    try {
      if (!auth?.isAuthenticated) {
        throw new Error('Not authorized');
      }

      const values = CREDENTIALS_INITIAL_STATE.find(
        values => values.id === query.type
      );

      if (!values) {
        throw new Error('Not authorized');
      }

      setValues(values);
      setStatus('resolved');
    } catch (error) {
      console.error(error);
      setStatus('rejected');
    }
  }, [query?.type, auth.status, auth?.isAuthenticated]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement> & SelectChangeEvent
  ) => {
    if (event.target?.files?.length > 0) {
      const reader = new FileReader();
      const file = new File(
        [event.target.files[0]],
        formatFilename(event.target.files[0].name),
        {
          type: event.target.files[0].type
        }
      );

      if (!constants.DEFAULT_IMAGE_FILE_TYPES.includes(file.type)) return;

      reader.readAsDataURL(event.target.files[0]);
      setFormValues(prevValues => ({
        ...prevValues,
        [event.target.name]: file
      }));
    } else {
      setFormValues(prevValues => ({
        ...prevValues,
        [event.target.name]:
          event.target?.type === 'checkbox'
            ? event.target?.checked
            : event.target.value
      }));
    }
  };

  const handleChangeBoxes = (name: string, value: string) => {
    if (!name || !value) return;

    setFormValues(prevValues => ({
      ...prevValues,
      [name]: (prevValues[name] as string[])?.includes(value)
        ? (prevValues[name] as string[]).filter(val => val !== value)
        : [...((prevValues[name] as string[]) || []), value]
    }));
    handleCurrentInputModal(undefined);
  };

  const handleCurrentInputModal = (name: string, value?: string) => {
    if (!name) {
      setCurrentInputModal({});
      return;
    }

    setCurrentInputModal(prevValues => ({
      ...prevValues,
      [name]: value || ''
    }));
  };

  if (status === 'rejected') {
    return <ErrorWrapper statusCode={404} />;
  }

  return (
    <>
      {Object.keys(currentInputModal).length !== 0 && (
        <QuestionModal
          title="Add new value to form"
          continueButton={{
            text: 'Add',
            onClick: () =>
              handleChangeBoxes(
                Object.keys(currentInputModal)[0],
                Object.values(currentInputModal)[0]
              )
          }}
          cancelButton={{
            text: 'Cancel',
            onClick: () => handleCurrentInputModal(undefined)
          }}
          component={() => (
            <Input
              name={Object.keys(currentInputModal)[0]}
              value={Object.values(currentInputModal)[0]}
              onChange={event =>
                handleCurrentInputModal(event.target.name, event.target.value)
              }
              placeholder="Enter new value"
            />
          )}
        />
      )}
      <Layout>
        <Wrapper>
          {isLoading ? (
            <div className="credential-loading">
              <Loading />
            </div>
          ) : (
            <>
              <div className="credential-header">
                <div className="credential-header-icon">
                  <ArrowForward />
                </div>
                <div className="credential-header-texts">
                  <p className="credential-header-texts-title">
                    Work credential
                  </p>
                  <p className="credential-header-texts-subtitle">
                    Organization: <span>andresmontoya.eth</span>
                  </p>
                </div>
              </div>
              <div className="credential-card">
                <div className="credential-card-header">
                  <p className="credential-card-header-title">
                    Preview: <span>krebit.id/claim/140</span>
                  </p>
                  <div className="credential-card-header-icon">
                    <OpenInNew />
                  </div>
                </div>
                <Card
                  primaryColor={values.primaryColor}
                  secondaryColor={values.secondaryColor}
                >
                  <p className="card-title">
                    {(formValues?.name as string) || 'Name'}
                  </p>
                  <p className="card-description">
                    {(formValues?.description as string) ||
                      'Here your description'}
                  </p>
                  <div className="card-brand">
                    {(formValues?.image as string) ? (
                      <img src={formatUrlImage(formValues?.image as string)} />
                    ) : (
                      <p className="card-title">Image</p>
                    )}
                  </div>
                </Card>
              </div>
              <div className="credential-form">
                {values.form.fields.map((input, index) => {
                  if (input.type === 'boxes') {
                    return (
                      <div className="credential-form-boxes" key={index}>
                        <p className="credential-form-boxes-title">
                          {input.placeholder}
                        </p>
                        <div className="credential-form-boxes-content">
                          {((formValues[input.name] as string[]) || []).map(
                            (value, index) => (
                              <div
                                className="credential-form-box"
                                key={index}
                                onClick={() =>
                                  handleChangeBoxes(input.name, value)
                                }
                              >
                                <div className="credential-form-box-close">
                                  <Close />
                                </div>
                                <p className="credential-form-box-text">
                                  {value}
                                </p>
                              </div>
                            )
                          )}
                          <div
                            className="credential-form-box-add"
                            onClick={() => handleCurrentInputModal(input.name)}
                          >
                            <Add />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (input.type === 'upload') {
                    return (
                      <div className="credential-form-upload-input" key={index}>
                        <input
                          type="file"
                          id={input.name}
                          accept="image/*"
                          name={input.name}
                          onChange={handleChange}
                        />
                        <label
                          className="credential-form-upload-input-label"
                          htmlFor={input.name}
                        >
                          <p>{input.placeholder}</p>
                          <AddPhotoAlternate />
                        </label>
                      </div>
                    );
                  }

                  if (input.type === 'select') {
                    return (
                      <Select
                        key={index}
                        id={input.name}
                        name={input.name}
                        label={input.placeholder}
                        value={
                          formValues[values.form.fields[index].name] as string
                        }
                        onChange={handleChange}
                        items={input.items}
                        isDisabled={input.isDisabled}
                        isRequired={input.isRequired}
                      />
                    );
                  }

                  if (input.type === 'switch') {
                    return (
                      <Switch
                        key={index}
                        name={input.name}
                        label={input.placeholder}
                        value={
                          formValues[values.form.fields[index].name] as boolean
                        }
                        onChange={handleChange}
                        isDisabled={input.isDisabled}
                        isRequired={input.isRequired}
                      />
                    );
                  }

                  if (input.type === 'datepicker') {
                    return (
                      <DatePicker
                        key={index}
                        name={input.name}
                        placeholder={input.placeholder}
                        value={
                          formValues[values.form.fields[index].name] as
                            | string
                            | number
                        }
                        onChange={handleChange}
                        isDisabled={input.isDisabled}
                        isRequired={input.isRequired}
                      />
                    );
                  }

                  return (
                    <Input
                      key={index}
                      type={(input.type as any) || 'text'}
                      name={input.name}
                      placeholder={input.placeholder}
                      value={
                        formValues[values.form.fields[index].name] as
                          | string
                          | number
                      }
                      onChange={handleChange}
                      isMultiline={input.isMultiline}
                      isDisabled={input.isDisabled}
                      isRequired={input.isRequired}
                      pattern={input.pattern}
                    />
                  );
                })}
              </div>
              <div className="credential-issue-to">
                <p className="credential-issue-to-title">Issue to</p>
                <div className="credential-issue-to-list">
                  <div className="credential-issue-to-item">
                    <p className="credential-issue-to-item-text">
                      x0e4rdee14xf184010371c782rcykk
                    </p>
                    <div className="credential-issue-to-item-close">
                      <Close />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Wrapper>
      </Layout>
    </>
  );
};
