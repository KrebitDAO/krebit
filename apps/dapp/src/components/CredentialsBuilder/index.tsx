import { ethers } from 'ethers';
import {
  ChangeEvent,
  MouseEvent,
  useContext,
  useEffect,
  useState
} from 'react';
import { useRouter } from 'next/router';
import ErrorWrapper from 'next/error';
import Krebit from '@krebitdao/reputation-passport';

import { QuestionModalText, SuggestionBoxes, Wrapper } from './styles';
import { Card } from 'components/Credentials/styles';
import { Layout } from 'components/Layout';
import { Add, AddPhotoAlternate, ArrowForward, Close } from 'components/Icons';
import { Loading } from 'components/Loading';
import { Input } from 'components/Input';
import { Select } from 'components/Select';
import { DatePicker } from 'components/DatePicker';
import { Switch } from 'components/Switch';
import { Rating } from 'components/Rating';
import { QuestionModal } from 'components/QuestionModal';
import { Button } from 'components/Button';
import {
  CREDENTIALS_INITIAL_STATE,
  IState,
  IFormValues,
  SERVICES_INITIAL_STATE
} from '../Credentials/initialState';
import { GeneralContext } from 'context';
import {
  constants,
  yupSchema,
  formatFilename,
  formatUrlImage,
  generateUID,
  sendNotification,
  sortByDate
} from 'utils';

// types
import { SelectChangeEvent } from '@mui/material';

interface ICurrentInputModal {
  [name: string]: string | string[] | number[];
}

const BASE_URL = 'https://krebit.id/claim';
const BASE_URL_POSTS = 'https://krebit.id/posts';
const DEFAULT_FIELDS_QUERY_URL = 2;

// orbis information
const CERAMIC_URL = 'https://node1.orbis.club';
const postSchemaCommit =
  'k1dpgaqe3i64kjuyet4w0zyaqwamf9wrp1jim19y27veqkppo34yghivt2pag4wxp0fv2yl4hedynpfuynp2wvd8s7ctabea6lx732xrr8b0cgqauwlh0vwg6';
const job_channel =
  'kjzl6cwe1jw145l8g0ojf3ku355i6ybovcpbiir8nam0385w8ajalywyd8un11b';
const service_channel =
  'kjzl6cwe1jw14bnj2h9kzgwdve4vrz7gwjcq3suytizuvc3slaellqd6g7hr18y';

export const CredentialsBuilder = () => {
  const [status, setStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState<string>();
  const [values, setValues] = useState<IState>();
  const [formValues, setFormValues] = useState<IFormValues>({});
  const [currentInputModal, setCurrentInputModal] =
    useState<ICurrentInputModal>({});
  const [credentialId, setCredentialId] = useState<string>();
  const [serviceId, setServiceId] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const { query, push } = useRouter();
  const {
    auth,
    walletInformation: {
      passport,
      issuer,
      orbis,
      address,
      wallet,
      ethProvider
    },
    profileInformation: { profile },
    walletModal: { handleOpenConnectWallet },
    storage
  } = useContext(GeneralContext);
  const isLoading = status === 'idle' || status === 'pending';
  const isFormLoading = status === 'form_pending';

  useEffect(() => {
    if (auth.status !== 'resolved') return;

    if (!auth?.isAuthenticated) {
      setStatus('rejected_not_authenticated');
      return;
    }

    if (!passport) return;
    if (!issuer) return;
    if (!query?.type) return;

    setStatus('pending');

    const validateFormValues = async () => {
      try {
        let values: IState;

        const credentialsInitialState = CREDENTIALS_INITIAL_STATE.find(
          values => values.type === query.type
        );

        const servicesInitialState = SERVICES_INITIAL_STATE.find(
          values => values.type === query.type
        );

        if (credentialsInitialState) {
          values = credentialsInitialState;
        } else if (servicesInitialState) {
          values = servicesInitialState;
        } else {
          throw new Error('Not authorized');
        }

        const entityField = values.form.fields.findIndex(
          field => field.name === 'entity'
        );

        if (
          entityField !== -1 &&
          values.form.fields[entityField].type === 'select'
        ) {
          const entities = await getEntities();

          values.form.fields[entityField].items = entities;
        }

        let fields = [];

        const hasMoreThanOneDefaultField =
          Object.keys(query).length >= DEFAULT_FIELDS_QUERY_URL;

        if (hasMoreThanOneDefaultField) {
          const queryFields = Object.keys(query);

          fields = values.form?.fields.map(field => ({
            ...field,
            defaultValue: queryFields.includes(field.name)
              ? query[field.name]
              : ''
          }));
        } else {
          fields = values.form?.fields;
        }

        const formValues = fields?.reduce(
          (a, v) => ({
            ...a,
            ...(values.form?.issueTo
              ? {
                  [values.form.issueTo.name]: query['issueTo']
                    ? (query['issueTo'] as string).split(',')
                    : ([] as string[])
                }
              : undefined),
            [v.name]:
              v.type === 'datepicker'
                ? v?.defaultValue || constants.DEFAULT_DATE
                : v.type === 'switch'
                ? v?.defaultValue || false
                : v.type === 'boxes'
                ? v?.defaultValue || []
                : v?.defaultValue || ''
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
    };

    validateFormValues();
  }, [passport, issuer, query?.type, auth.status, auth?.isAuthenticated]);

  const getEntities = async () => {
    try {
      const guildAdminCredentials = (
        await passport.getCredentials(undefined, 'GuildXyzAdmin')
      )
        .sort((a, b) => sortByDate(a.issuanceDate, b.issuanceDate, 'des'))
        .slice(0, 10);
      const discordOwnerCredentials = (
        await passport.getCredentials(undefined, 'DiscordGuildOwner')
      )
        .sort((a, b) => sortByDate(a.issuanceDate, b.issuanceDate, 'des'))
        .slice(0, 10);
      const gitHubCredentials = (
        await passport.getCredentials(undefined, 'GithubOrgMember')
      )
        .sort((a, b) => sortByDate(a.issuanceDate, b.issuanceDate, 'des'))
        .slice(0, 10);

      const currentCredentials = [
        ...guildAdminCredentials,
        ...discordOwnerCredentials,
        ...gitHubCredentials
      ];
      console.log('admincredentials', currentCredentials);

      if (currentCredentials.length > 0) {
        const decriptedEntities = await Promise.all(
          currentCredentials.map(async credential => {
            let claimValue = null;
            const value = await passport.getClaimValue(credential);

            if (value?.encryptedString) {
              claimValue = await issuer.decryptClaimValue(value);
            } else {
              claimValue = value;
            }

            return {
              text: `${claimValue.entity} [${credential.credentialSubject.type}]`,
              value: claimValue.entity
            };
          })
        ).then(values => values.filter(val => val !== undefined));

        let entities = [{ text: 'Personal', value: 'personal' }];

        if (decriptedEntities.length > 0) {
          entities = entities.concat(decriptedEntities);
        }

        return entities;
      }

      return [];
    } catch (error) {
      console.log('error: ', error);
    }
  };

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

    if (value.indexOf(',') != -1) {
      setFormValues(prevValues => ({
        ...prevValues,
        [name]: [
          ...((prevValues[name] as string[]) || []),
          ...value
            .split(',')
            .map(val => val?.trim())
            .filter(val => val !== undefined)
        ]
      }));
    } else {
      setFormValues(prevValues => ({
        ...prevValues,
        [name]: (prevValues[name] as string[])?.includes(value)
          ? (prevValues[name] as string[]).filter(val => val !== value)
          : [...((prevValues[name] as string[]) || []), value.trim()]
      }));
    }

    handleCurrentInputModal(undefined);
  };

  const handleCurrentInputModal = (
    name: string,
    value?: string,
    isSuggestion?: boolean
  ) => {
    if (!name) {
      setCurrentInputModal({});
      return;
    }

    // There's a QuestionModal component that has the most popular skills, so if the user is interested in any of these, we want to know if the value passed is a suggestion
    if (isSuggestion) {
      setCurrentInputModal(prevValues => {
        return {
          ...prevValues,
          [name]:
            /,\s*$/.test(prevValues[name] as string) || prevValues[name] === ''
              ? prevValues[name] + value
              : `${prevValues[name]}, ${value}`
        };
      });
      return;
    }

    setCurrentInputModal(prevValues => ({
      ...prevValues,
      [name]: value || ''
    }));
  };

  const handleSubmitCredential = async () => {
    const validationFields = [
      ...values.form.fields,
      values.form?.issueTo ? values.form.issueTo : undefined
    ].filter(x => x !== undefined);

    const yupValidation = await yupSchema.validateYupSchema(
      validationFields,
      formValues
    );

    if (yupValidation?.error) {
      setStatus('form_rejected');
      setErrorMessage(yupValidation?.error);
      return;
    }

    setStatus('form_pending');
    setStatusMessage(constants.DEFAULT_MESSAGES_FOR_PROVIDERS.INITIAL);

    let imageUrl = '';

    if (formValues?.image instanceof File) {
      const node = await storage.put([formValues?.image] as any);

      if (node) {
        imageUrl = `https://${node}.ipfs.dweb.link/${formValues?.image.name}`;
      }
    }

    const currentValues = values.form.button.onClick({
      ...formValues,
      imageUrl: imageUrl
    });

    try {
      // Issue credential
      console.log('add: ', address);
      console.log('did: ', issuer.did);

      const expirationDate = currentValues?.values?.deliveryTime
        ? currentValues?.values?.deliveryTime
        : new Date();
      const expiresYears = 1;
      expirationDate.setFullYear(expirationDate.getFullYear() + expiresYears);
      console.log('expirationDate: ', expirationDate);

      console.log('deliveryTime: ', currentValues?.values?.deliveryTime);
      console.log(
        'deliveryTime type: ',
        typeof currentValues?.values?.deliveryTime
      );
      if (currentValues?.values?.deliveryTime) {
        currentValues.values.deliveryTime = new Date(
          currentValues?.values?.deliveryTime
        ).toISOString();
      }

      setStatusMessage(
        constants.DEFAULT_MESSAGES_FOR_PROVIDERS.ISSUER_CONNECTION
      );

      if (
        currentValues?.values?.issueTo?.length == 1 &&
        currentValues?.values?.issueTo[0].startsWith('0x')
      ) {
        const claim = {
          id: `${currentValues.credentialType}-${generateUID(10)}`,
          did: `did:pkh:eip155:1:${currentValues?.values?.issueTo[0]?.toLowerCase()}`,
          ethereumAddress: currentValues?.values?.issueTo[0]?.toLowerCase(),
          type: currentValues.credentialType,
          typeSchema: currentValues.credentialSchema,
          tags:
            currentValues?.tags?.length > 0
              ? ['Community'].concat(currentValues.tags)
              : ['Community'],
          value: currentValues.values,
          expirationDate: new Date(expirationDate).toISOString(),
          price: currentValues?.values?.price
            ? ethers.utils.parseEther(currentValues?.values?.price).toString()
            : 0,
          trust: currentValues?.values?.rating
            ? parseInt(currentValues?.values?.rating as string) * 20
            : 100
        };
        console.log('Issue directly to wallet: ', claim);
        const issuedCredential = await issuer.issue(claim);

        if (issuedCredential) {
          const addedCredentialId = await passport.addIssued(issuedCredential);
          const issueToValues = currentValues?.values?.issueTo;
          console.log('addedCredentialId: ', addedCredentialId);

          setStatusMessage(
            constants.DEFAULT_MESSAGES_FOR_PROVIDERS.ADDING_CREDENTIAL
          );

          if (issueToValues && issueToValues?.length > 0) {
            await sendNotification({
              orbis,
              authenticatedDID: auth.did,
              body: {
                subject: `Krebit.id Notification: ${
                  currentValues?.values?.name || currentValues?.values?.title
                }`,
                content: `<b>${profile?.name}</b> has created a new Krebit credential that you can claim, just follow the steps on the following link: <a href="${BASE_URL}/?credential_id=${addedCredentialId}">${BASE_URL}/?credential_id=${addedCredentialId}</a>`,
                recipients: issueToValues
              }
            });
          }

          setCredentialId(addedCredentialId);
          setStatus('form_resolved');
        }
      } else {
        const issueToValues = currentValues?.values?.issueTo;
        const encryptedList = await issuer.encryptClaimValue(
          currentValues?.values?.issueTo,
          currentValues.ethereumAddress
        );
        delete currentValues?.values?.issueTo;
        const claim = {
          id: `issuer-${generateUID(10)}`,
          did: currentValues.did,
          ethereumAddress: currentValues.ethereumAddress,
          type: 'Issuer',
          typeSchema: 'krebit://schemas/issuer',
          tags: ['Community', `${currentValues.credentialType}Issuer`],
          value: {
            ...currentValues,
            credentialSubjectList: encryptedList
          },
          expirationDate: new Date(expirationDate).toISOString(),
          trust: currentValues?.values?.rating
            ? parseInt(currentValues?.values?.rating as string) * 20
            : currentValues?.values?.level
            ? parseInt(currentValues?.values?.level as string) * 20
            : 100
        };
        console.log('Issue via delegate: ', claim);

        const delegatedCredential = await issuer.issue(claim);
        console.log('delegatedCredential: ', delegatedCredential);

        // Save delegatedCredential
        if (delegatedCredential) {
          const delegatedCredentialId = await passport.addIssued(
            delegatedCredential
          );
          console.log('delegatedCredentialId: ', delegatedCredentialId);

          setStatusMessage(
            constants.DEFAULT_MESSAGES_FOR_PROVIDERS.ADDING_CREDENTIAL
          );

          if (issueToValues && issueToValues?.length > 0) {
            await sendNotification({
              orbis,
              authenticatedDID: auth.did,
              body: {
                subject: `Krebit.id Notification: ${
                  currentValues?.values?.name || currentValues?.values?.title
                }`,
                content: `<b>${profile?.name}</b> has created a new Krebit credential that you can claim, just follow the steps on the following link: <a href="${BASE_URL}/?credential_id=${delegatedCredentialId}">${BASE_URL}/?credential_id=${delegatedCredentialId}</a>`,
                recipients: issueToValues
              }
            });
          }

          setCredentialId(delegatedCredentialId);
          setStatus('form_resolved');
        }
      }
    } catch (error) {
      setStatus('form_rejected');
      setErrorMessage(
        constants.DEFAULT_ERROR_MESSAGE_FOR_PROVIDERS.ERROR_CREDENTIAL
      );
      console.error(error);
    }
  };

  const handleSubmitServices = async () => {
    const validationFields = [
      ...values.form.fields,
      values.form?.issueTo ? values.form.issueTo : undefined
    ].filter(x => x !== undefined);

    const yupValidation = await yupSchema.validateYupSchema(
      validationFields,
      formValues
    );

    if (yupValidation?.error) {
      setStatus('form_rejected');
      setErrorMessage(yupValidation?.error);
      return;
    }

    setStatus('form_pending');
    setStatusMessage(constants.DEFAULT_MESSAGES_FOR_SERVICES.INITIAL);

    let imageUrl = '';

    if (formValues?.image instanceof File) {
      const node = await storage.put([formValues?.image] as any);

      if (node) {
        imageUrl = `https://${node}.ipfs.dweb.link/${formValues?.image.name}`;
      }
    }

    const currentValues = values.form.button.onClick({
      ...formValues,
      type: values.type,
      imageUrl,
      publishedDate: new Date().toISOString()
    });

    try {
      const Issuer = new Krebit.core.Krebit({
        wallet,
        ethProvider,
        address,
        ceramicUrl: CERAMIC_URL
      });
      const session = window.localStorage.getItem('did-session');
      const currentSession = JSON.parse(session);
      const did = await Issuer.connect(currentSession);
      console.log('DID:', did);

      let metadata: { tags: Array<Object>; channel: string };

      const skillTags = currentValues?.skills?.map(skill => ({
        slug: skill
          ?.toLowerCase()
          ?.trim()
          ?.replace(/[^a-z0-9. ]/g, '')
          ?.replace(/\s+/g, '-'),
        title: skill
      }));

      if (currentValues.type === 'job') {
        metadata = {
          tags: [
            {
              slug: 'krebit-job',
              title: 'Krebit Job'
            },
            ...skillTags.map(tag => ({
              ...tag,
              slug: `krebit-job:${tag.slug}`
            }))
          ],
          channel: job_channel
        };
      }

      if (currentValues.type === 'service') {
        metadata = {
          tags: [
            {
              slug: 'krebit-service',
              title: 'Krebit Service'
            },
            ...skillTags.map(tag => ({
              ...tag,
              slug: `krebit-service:${tag.slug}`
            }))
          ],
          channel: service_channel
        };
      }

      if (!metadata) return;

      const jobDoc = {
        context: metadata.channel,
        title: currentValues.title,
        body: '',
        tags: metadata.tags,
        data: currentValues
      };
      console.log('jobDoc:', jobDoc);

      let streamId = await Issuer.createDocument(
        jobDoc,
        ['orbis', 'post'],
        postSchemaCommit,
        'orbis'
      );

      await Issuer.updateDocument(
        {
          ...jobDoc,
          body:
            currentValues.type === 'job'
              ? `Job offer: ${jobDoc?.data?.title}\nCompany: ${jobDoc?.data?.entity} #hiring\nApply: https://krebit.id/posts?post_id=${streamId}`
              : `Service included: ${jobDoc?.data?.title}\nApply: https://krebit.id/posts?post_id=${streamId}`
        },
        streamId
      );
      console.log('streamId: ', streamId);

      await fetch('https://api.orbis.club/index-stream/mainnet/' + streamId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      console.log('Indexed ' + streamId + ' with success.');

      setServiceId(streamId);
      setStatus('form_resolved');
    } catch (error) {
      setStatus('form_rejected');
      setErrorMessage(
        constants.DEFAULT_ERROR_MESSAGE_FOR_SERVICES.ERROR_INFORMATION
      );
      console.error(error);
    }
  };

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const isCredentialType = CREDENTIALS_INITIAL_STATE.find(
      vals => vals.type === values.type
    );
    const isServicesType = SERVICES_INITIAL_STATE.find(
      vals => vals.type === values.type
    );

    if (isCredentialType) {
      await handleSubmitCredential();
    }

    if (isServicesType) {
      await handleSubmitServices();
    }
  };

  const handleCopyURL = async (url: string) => {
    setStatus('form_pending');

    if (!url) return;

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

  const handleCloseModal = () => {
    setCredentialId(undefined);
    setServiceId(undefined);
    setErrorMessage(undefined);
  };

  const handleGoBack = () => {
    if (isLoading || isFormLoading) return;

    push('/create');
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
              The credential is ready to be claimed! You can now copy and share
              it with the recipients.{' '}
              <a
                href={`${BASE_URL}/?credential_id=${credentialId}`}
                target="_blank"
              >
                {BASE_URL}/?credential_id={credentialId}
              </a>
            </QuestionModalText>
          )}
          continueButton={{
            text: 'Copy URL',
            onClick: () =>
              handleCopyURL(`${BASE_URL}/?credential_id=${credentialId}`)
          }}
          cancelButton={{
            text: 'Close',
            onClick: handleCloseModal
          }}
        />
      )}
      {serviceId && (
        <QuestionModal
          title="Service created"
          text="This service was created. You can check it out by clicking Copy URL"
          continueButton={{
            text: 'Copy URL',
            onClick: () =>
              handleCopyURL(`${BASE_URL_POSTS}/?post_id=${serviceId}`)
          }}
          cancelButton={{
            text: 'Close',
            onClick: handleCloseModal
          }}
        />
      )}
      {errorMessage && (
        <QuestionModal
          title="Error creating credential"
          text={errorMessage}
          continueButton={{ text: 'Accept', onClick: handleCloseModal }}
          cancelButton={{
            text: 'Close',
            onClick: handleCloseModal
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
            <>
              <Input
                name={Object.keys(currentInputModal)[0]}
                value={Object.values(currentInputModal)[0] as string}
                onChange={event =>
                  handleCurrentInputModal(event.target.name, event.target.value)
                }
                placeholder="Enter new value"
              />
              {constants.DEFAULT_SKILL_TAGS?.length > 0 &&
              Object.keys(currentInputModal)[0] === 'skills' ? (
                <SuggestionBoxes>
                  <p className="suggestion-boxes-text">Most popular skills</p>
                  <div className="suggestion-boxes-container">
                    <div className="suggestion-boxes">
                      {constants.DEFAULT_SKILL_TAGS.map((tag, index) => (
                        <div
                          className="suggestion-box"
                          onClick={() =>
                            handleCurrentInputModal(
                              Object.keys(currentInputModal)[0],
                              tag.text,
                              true
                            )
                          }
                          key={index}
                        >
                          <p className="suggestion-box-text">{tag.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </SuggestionBoxes>
              ) : null}
            </>
          )}
        />
      )}
      <Layout>
        <Wrapper>
          {isLoading ? (
            <div className="credential-loading">
              <Loading />
            </div>
          ) : status === 'rejected_not_authenticated' ? (
            <div className="credential-not-authenticated">
              <h1 className="credential-not-authenticated-title">
                You have to be authenticated to continue
              </h1>
              <div className="credential-not-authenticated-button">
                <Button
                  text="Connect wallet"
                  onClick={handleOpenConnectWallet}
                />
              </div>
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
                </div>
              </div>
              <div className="credential-card">
                <div className="credential-card-header">
                  <p className="credential-card-header-title">Preview:</p>
                </div>
                <Card
                  primaryColor={values.primaryColor}
                  secondaryColor={values.secondaryColor}
                >
                  <div className="card-title-header">
                    <p className="card-title">
                      {(formValues?.name as string) ||
                        (formValues?.title as string) ||
                        'Card Title'}
                    </p>
                  </div>
                  <p className="card-description">
                    {(formValues?.description as string) || 'Card description'}
                  </p>
                  <div className="card-bottom">
                    <div className="card-brand">
                      {(formValues?.image as string) ? (
                        <img
                          src={formatUrlImage(formValues?.image as string)}
                        />
                      ) : (
                        values.icon
                      )}
                    </div>
                  </div>
                </Card>
              </div>
              {isFormLoading ? (
                <div className="credential-form-loading">
                  <div className="credential-form-loading-animation">
                    <Loading />
                  </div>
                  <p className="credential-form-loading-text">
                    {statusMessage}
                  </p>
                </div>
              ) : (
                <>
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
                                onClick={() =>
                                  handleCurrentInputModal(input.name)
                                }
                              >
                                <Add />
                              </div>
                            </div>
                          </div>
                        );
                      }

                      if (input.type === 'upload') {
                        return (
                          <div
                            className="credential-form-upload-input"
                            key={index}
                          >
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
                              formValues[
                                values.form.fields[index].name
                              ] as string
                            }
                            onChange={handleChange}
                            items={input?.items || []}
                            isDisabled={input.isDisabled}
                            isRequired={input.isRequired}
                            asyncFunction={
                              input?.asyncFunction
                                ? () => input?.asyncFunction({ passport })
                                : undefined
                            }
                          />
                        );
                      }

                      if (input.type === 'rating') {
                        return (
                          <Rating
                            key={index}
                            label={input.placeholder}
                            name={input.name}
                            value={
                              formValues[
                                values.form.fields[index].name
                              ] as number
                            }
                            onChange={handleChange}
                            isDisabled={input.isDisabled}
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
                              formValues[
                                values.form.fields[index].name
                              ] as boolean
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

                      if (input.type === 'datetimepicker') {
                        return (
                          <DatePicker
                            type="datetimepicker"
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
                          (formValues[values.form.issueTo.name] as string[]) ||
                          []
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
                            <p className="credential-issue-to-item-text">
                              {value}
                            </p>
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
                          Add new address or email
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="credential-button">
                    <Button
                      text={
                        values.form.button.text
                          ? values.form.button.text
                          : 'Issue credential'
                      }
                      onClick={handleSubmit}
                      isDisabled={isFormLoading}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </Wrapper>
      </Layout>
    </>
  );
};
