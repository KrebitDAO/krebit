import {
  ChangeEvent,
  MouseEvent,
  useContext,
  useEffect,
  useState
} from 'react';
import { useRouter } from 'next/router';
import ErrorWrapper from 'next/error';

import { QuestionModalText, Wrapper } from './styles';
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
  ICredentialsState,
  IFormValues
} from '../Credentials/initialState';
import { GeneralContext } from 'context';
import { constants, formatFilename, formatUrlImage } from 'utils';

// types
import { SelectChangeEvent } from '@mui/material';
import { QuestionModal } from 'components/QuestionModal';
import { Button } from 'components/Button';

interface ICurrentInputModal {
  [name: string]: string | string[] | number[];
}

const BASE_URL = 'https://krebit.id/claim';

export const CredentialsBuilder = () => {
  const [status, setStatus] = useState('idle');
  const [values, setValues] = useState<ICredentialsState>();
  const [formValues, setFormValues] = useState<IFormValues>({});
  const [currentInputModal, setCurrentInputModal] =
    useState<ICurrentInputModal>({});
  const [credentialId, setCredentialId] = useState<string>();
  const { query, push } = useRouter();
  const { auth } = useContext(GeneralContext);
  const isLoading = status === 'idle' || status === 'pending';
  const isFormLoading = status === 'form_pending';

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

      const formValues = values.form?.fields?.reduce(
        (a, v) => ({
          ...a,
          ...(values.form?.issueTo
            ? { [values.form.issueTo.name]: [] as string[] }
            : undefined),
          [v.name]:
            v.type === 'datepicker'
              ? constants.DEFAULT_DATE
              : v.type === 'switch'
              ? false
              : v.type === 'boxes'
              ? ([] as string[] | number[])
              : ''
        }),
        {}
      );

      setValues(values);
      setFormValues(formValues);
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

  const handleChangeArrayValues = (name: string, value: string) => {
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

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      const id = await values.form.button.onClick(formValues);

      if (!id) {
        throw new Error('Not id found');
      }

      setCredentialId(id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopyIssuedId = async () => {
    setStatus('form_pending');

    const url = `${BASE_URL}/?credential_id=${credentialId}`;

    try {
      await navigator?.clipboard?.writeText(url).then(() => {
        push(`/${auth.did}`);
      });
      setStatus('form_resolved');
    } catch (error) {
      setStatus('form_rejected');
      console.error(error);
    }
  };

  const handleCloseCredentialIdModal = () => {
    setCredentialId(undefined);
  };

  const handleGoBack = () => {
    push('/credentials');
  };

  if (status === 'rejected') {
    return <ErrorWrapper statusCode={404} />;
  }

  return (
    <>
      {credentialId && (
        <QuestionModal
          title="Credential Issued"
          component={() => (
            <QuestionModalText>
              The credential has been issued! You can now copy and share it
              everywhere.{' '}
              <a
                href={`${BASE_URL}/?credential_id=${credentialId}`}
                target="_blank"
              >
                {BASE_URL}/?credential_id={credentialId}
              </a>
            </QuestionModalText>
          )}
          continueButton={{ text: 'Copy URL', onClick: handleCopyIssuedId }}
          cancelButton={{
            text: 'Close',
            onClick: handleCloseCredentialIdModal
          }}
        />
      )}
      {Object.keys(currentInputModal).length !== 0 && (
        <QuestionModal
          title="Add new value to form"
          continueButton={{
            text: 'Add',
            onClick: () =>
              handleChangeArrayValues(
                Object.keys(currentInputModal)[0],
                Object.values(currentInputModal)[0] as string
              )
          }}
          cancelButton={{
            text: 'Cancel',
            onClick: () => handleCurrentInputModal(undefined)
          }}
          component={() => (
            <Input
              name={Object.keys(currentInputModal)[0]}
              value={Object.values(currentInputModal)[0] as string}
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
            <div className="credential-container">
              <div className="credential-header">
                <div className="credential-header-icon" onClick={handleGoBack}>
                  <ArrowForward />
                </div>
                <div className="credential-header-texts">
                  <p
                    className="credential-header-texts-title"
                    onClick={handleGoBack}
                  >
                    {values.title}
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
                                  handleChangeArrayValues(input.name, value)
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
              {values.form?.issueTo && (
                <div className="credential-issue-to">
                  <p className="credential-issue-to-title">
                    {values.form.issueTo.placeholder}
                  </p>
                  <div className="credential-issue-to-list">
                    {(
                      (formValues[values.form.issueTo.name] as string[]) || []
                    ).map((value, index) => (
                      <div
                        className="credential-issue-to-item"
                        key={index}
                        onClick={() =>
                          handleChangeArrayValues(
                            values.form.issueTo.name,
                            value
                          )
                        }
                      >
                        <p className="credential-issue-to-item-text">{value}</p>
                        <div className="credential-issue-to-item-close">
                          <Close />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    className="credential-issue-to-new-cred"
                    onClick={() =>
                      handleCurrentInputModal(values.form.issueTo.name)
                    }
                  >
                    <div className="credential-issue-to-new-cred-icon">
                      <Add />
                    </div>
                    <p className="credential-issue-to-new-cred-text">
                      Add new address
                    </p>
                  </div>
                </div>
              )}
              <div className="credential-button">
                <Button
                  text="Issue credential"
                  onClick={handleSubmit}
                  isDisabled={isFormLoading}
                />
              </div>
            </div>
          )}
        </Wrapper>
      </Layout>
    </>
  );
};
