import React, { useEffect, useState } from 'react';

import { Wrapper } from './styles';
import {
  ArrowForward,
  Close,
  Visibility,
  VisibilityOff
} from 'components/Icons';
import { Button } from 'components/Button';
import { Badge } from 'components/Badge';
import { Input } from 'components/Input';
import { DatePicker } from 'components/DatePicker';
import { Select } from 'components/Select';
import { Switch } from 'components/Switch';
import { Loading } from 'components/Loading';
import { substring } from 'components/Groups/utils';

// types
import { ICredential } from 'utils/normalizeSchema';
import { IIssuerParams } from 'utils/getIssuers';
import { checkCredentialsURLs } from 'utils';
import { IWalletInformation } from 'context';

type IViewStatusProps = 'init' | 'steps';

interface IProps {
  initialList: IIssuerParams[];
  onClose: () => void;
  onClean: (credentialType: string) => void;
  verifyId: string;
  credential: ICredential;
  getProvider: (credentialType: string) => any;
  isAuthenticated: boolean;
  formatCredentialName: (value: any) => string;
  formatLitValue: (type: string, credential: any) => Promise<void>;
  updateCredential: (vcId: string) => Promise<void>;
  walletInformation: IWalletInformation;
}

export const Verify = (props: IProps) => {
  const {
    initialList,
    onClose,
    onClean,
    verifyId,
    credential,
    getProvider,
    isAuthenticated,
    formatCredentialName,
    formatLitValue,
    updateCredential,
    walletInformation
  } = props;
  const [viewStatus, setViewStatus] = useState<IViewStatusProps>('init');
  const [currentVerify, setCurrentVerify] = useState<
    IIssuerParams | undefined
  >();
  const [currentStep, setCurrentStep] = useState(0);
  const [currentStepsCompleted, setCurrentStepsCompleted] = useState({});
  const [areStepsCompleted, setAreStepsCompleted] = useState(false);
  const provider = getProvider(currentVerify?.credentialType);
  const isInitialStep = currentStep === 0;
  const isLoading =
    provider?.status === 'credential_pending' ||
    provider?.status === 'mint_pending';
  const hasError =
    provider?.status === 'credential_rejected' ||
    provider?.status === 'mint_rejected';
  const allStepsCompleted =
    !areStepsCompleted &&
    (provider?.currentCredential ||
      provider?.currentVerificationId ||
      credential?.credential) &&
    (provider?.currentMint || credential?.stamps?.length > 0);
  const canClaimBuilderCredentials = Boolean(
    credential?.credential?.value?.values?.issueTo?.find(element => {
      return (
        element?.toLowerCase() === walletInformation?.address?.toLowerCase()
      );
    }) &&
      walletInformation?.address?.toLowerCase() !==
        credential?.credential?.credentialSubject?.ethereumAddress
  );
  const isReadOnly = credential?.isCustomCredential
    ? !canClaimBuilderCredentials
    : !isAuthenticated;

  console.log(
    canClaimBuilderCredentials,
    credential?.credential?.credentialSubject?.ethereumAddress,
    walletInformation?.address?.toLowerCase()
  );

  useEffect(() => {
    if (verifyId) {
      const currentElement = initialList.find(
        list => list.credentialType === verifyId
      );

      if (currentElement) {
        setViewStatus('steps');
        setCurrentVerify(currentElement);
      }
    }
  }, [verifyId]);

  useEffect(() => {
    if (currentStep === 0) return;
    if (!provider) return;
    if (!credential) return;
    if (!currentVerify) return;

    if (currentStep >= currentVerify.steps.length) {
      setAreStepsCompleted(true);
      return;
    }

    if (
      provider?.status === 'credential_pending' ||
      provider?.status === 'mint_pending'
    )
      return;

    if (
      provider?.status === 'credential_rejected' ||
      provider?.status === 'mint_rejected'
    ) {
      return;
    }

    if (
      provider?.status === 'credential_resolved' ||
      provider?.status === 'mint_resolved'
    ) {
      provider?.handleCleanClaimValues();
      handleCurrentStep(currentStep + 1);
      return;
    }
  }, [currentStep, provider, credential, currentVerify]);

  const handleViewStatus = (status: IViewStatusProps) => {
    if (isReadOnly || isLoading) return;

    if (status === 'init') {
      onClean(currentVerify.credentialType);
      setCurrentStep(0);
      setCurrentVerify(undefined);
      setAreStepsCompleted(false);
    }

    setViewStatus(status);
  };

  const handleCurrentVerify = (value: IIssuerParams) => {
    if (isReadOnly || isLoading) return;

    setCurrentVerify(value);
    handleViewStatus('steps');
  };

  const handleCurrentStep = (step = 0) => {
    if (isReadOnly || isLoading || hasError) return;

    if (step > currentVerify.steps.length) return;

    const newCompleted = currentStepsCompleted;

    if (
      currentVerify?.steps[step]?.type === 'verification' &&
      (provider?.currentVerificationId || credential?.credential)
    ) {
      newCompleted[step] = 'Verification step completed';
    }

    if (
      currentVerify?.steps[step]?.type === 'credential' &&
      (provider?.currentCredential || credential?.credential)
    ) {
      if (!canClaimBuilderCredentials) {
        newCompleted[step] = 'Credential step completed';
      }
    }

    if (
      currentVerify?.steps[step]?.type === 'mint' &&
      (provider?.currentMint || credential?.stamps?.length > 0)
    ) {
      newCompleted[step] = 'Stamp step completed';
    }

    setCurrentStepsCompleted(newCompleted);
    setCurrentStep(step);
  };

  const handleEverythingCompleted = async (shouldUpdateCredential = true) => {
    if (shouldUpdateCredential) {
      await updateCredential(provider?.currentCredential?.vcId);
    }

    if (provider) {
      provider?.handleCleanClaimValues();
    }

    onClean(currentVerify.credentialType);
    setCurrentStep(0);
    setCurrentStepsCompleted({});
    setAreStepsCompleted(false);
  };

  return (
    <>
      <style global jsx>{`
        html,
        body {
          overflow: hidden;
        }
      `}</style>
      <Wrapper
        viewStatus={viewStatus}
        stepsWidth={
          currentVerify?.steps?.length
            ? currentVerify?.steps?.length * 230
            : 577
        }
      >
        <div className="verify-box">
          <div className="verify-box-header">
            <div className="verify-box-header-content">
              {viewStatus === 'steps' && !verifyId ? (
                <div
                  className="verify-box-header-content-icon"
                  onClick={() => handleViewStatus('init')}
                >
                  <ArrowForward />
                </div>
              ) : null}
              <p className="verify-box-header-content-title">
                {viewStatus === 'steps'
                  ? `Verify ${currentVerify.entity}`
                  : 'Verify your credentials'}
              </p>
            </div>
            <div
              className="verify-box-header-close"
              onClick={isLoading ? undefined : onClose}
            >
              <Close />
            </div>
          </div>
          {viewStatus === 'init' && (
            <div className="verify-box-list">
              {initialList.map((item, index) => (
                <div className="verify-box-item" key={index}>
                  <div className="verify-box-item-content">
                    <div className="verify-box-item-content-icon">
                      {item.badgeText ? (
                        <Badge
                          icon={item.icon}
                          text={item.badgeText}
                          color={item.badgeColor}
                          iconColor={item.badgeIconColor}
                        />
                      ) : (
                        item.icon
                      )}
                    </div>
                    <p className="verify-box-item-content-text">
                      {item.entity}
                    </p>
                  </div>
                  <div className="verify-box-item-button">
                    <Button
                      text={item.isDisabled ? 'Soon' : 'Verify'}
                      onClick={
                        item.isDisabled
                          ? undefined
                          : () => handleCurrentVerify(item)
                      }
                      styleType="border"
                      borderBackgroundColor="bunting"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          {viewStatus === 'steps' && (
            <>
              {!allStepsCompleted && !isReadOnly ? (
                <div className="verify-steps-header">
                  {currentVerify.steps.map((step, index) => (
                    <React.Fragment key={index}>
                      <div
                        className={`verify-step ${
                          currentStep === index ? 'active' : ''
                        }`}
                      >
                        <span
                          className={`verify-step-indicator ${
                            currentStep === index || areStepsCompleted
                              ? 'active'
                              : ''
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="verify-step-text">{step.title}</span>
                      </div>
                      {currentVerify.steps.length > index + 1 && (
                        <div className="verify-steps-line"></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ) : null}
              <div className="verify-steps-container">
                <div className="verify-steps-content">
                  <div className="verify-steps-content-titles">
                    {currentVerify.steps[currentStep || 0]?.metadata.title && (
                      <p className="verify-steps-content-title">
                        {currentVerify.steps[currentStep || 0]?.metadata.title}
                      </p>
                    )}
                    {currentVerify.steps[currentStep || 0]?.metadata
                      .description && (
                      <p className="verify-steps-content-description">
                        {
                          currentVerify.steps[currentStep || 0]?.metadata
                            .description
                        }
                      </p>
                    )}
                  </div>
                  {currentVerify.steps[currentStep || 0]?.metadata.icon && (
                    <div className="verify-steps-content-icon">
                      {currentVerify.steps[currentStep || 0]?.metadata.icon}
                    </div>
                  )}
                </div>
                {currentVerify.steps[currentStep || 0]?.metadata?.did &&
                currentVerify.steps[currentStep || 0]?.metadata
                  ?.verificationUrl &&
                currentVerify.steps[currentStep || 0]?.metadata?.price ? (
                  <ul className="verify-steps-content-list">
                    <li className="verify-steps-content-description">
                      <a
                        href={
                          '/' +
                          currentVerify.steps[currentStep || 0]?.metadata?.did
                        }
                        className="verify-steps-content-description verify-steps-content-dots"
                      >
                        {substring(
                          currentVerify.steps[currentStep || 0]?.metadata?.did,
                          30,
                          true
                        )}
                      </a>
                    </li>
                    <li className="verify-steps-content-description">
                      {
                        currentVerify.steps[currentStep || 0]?.metadata
                          ?.verificationUrl
                      }
                    </li>
                    <li className="verify-steps-content-description">
                      ${currentVerify.steps[currentStep || 0]?.metadata?.price}
                    </li>
                  </ul>
                ) : null}
                {isInitialStep &&
                credential?.credential?.issuanceDate &&
                credential?.credential?.expirationDate &&
                credential.credential?.value ? (
                  <div className="verify-steps-content-credential">
                    <p className="verify-steps-content-title">Credential</p>
                    <div className="verify-steps-content-visibility-container">
                      <p className="verify-steps-content-description">
                        {formatCredentialName(credential.credential?.value)}
                      </p>
                      {credential.credential?.visualInformation
                        ?.isEncryptedByDefault && (
                        <div
                          className="verify-steps-content-visibility"
                          onClick={() =>
                            formatLitValue(
                              credential.credential?.value?.encryptedString
                                ? 'decrypt'
                                : 'encrypt',
                              credential.credential
                            )
                          }
                        >
                          {!isReadOnly &&
                            (credential.credential?.value?.encryptedString ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            ))}
                        </div>
                      )}
                    </div>
                    <div className="verify-steps-content-dates">
                      <div className="verify-steps-content-date">
                        <p className="verify-steps-content-date-title">
                          ISSUED
                        </p>
                        <p className="verify-steps-content-date-text">
                          {new Date(
                            credential?.credential?.issuanceDate
                          ).toLocaleDateString('en-US')}
                        </p>
                      </div>
                      <div className="verify-steps-content-date">
                        <p className="verify-steps-content-date-title">
                          EXPIRES
                        </p>
                        <p className="verify-steps-content-date-text">
                          {new Date(
                            credential?.credential?.expirationDate
                          ).toLocaleDateString('en-US')}
                        </p>
                      </div>
                    </div>
                    <div className="verify-steps-content-external-urls">
                      <img
                        src="/imgs/logos/ceramic.png"
                        width={25}
                        height={25}
                        onClick={() =>
                          checkCredentialsURLs(
                            'ceramic',
                            'credential',
                            credential?.credential
                          )
                        }
                      />
                      {credential?.stamps?.length > 0 && (
                        <>
                          <img
                            src="/imgs/logos/rarible.png"
                            width={25}
                            height={25}
                            onClick={() =>
                              checkCredentialsURLs(
                                'rarible',
                                'nft',
                                credential?.credential
                              )
                            }
                          />
                          <img
                            src="/imgs/logos/opensea.svg"
                            width={25}
                            height={25}
                            onClick={() =>
                              checkCredentialsURLs(
                                'opensea',
                                'nft',
                                credential?.credential
                              )
                            }
                          />
                        </>
                      )}
                    </div>
                    <div className="verify-steps-content-skills">
                      {credential.skills.map((skill, index) => (
                        <div className="verify-steps-content-skill" key={index}>
                          <p className="verify-steps-content-skill-text">
                            {skill}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                {!currentStepsCompleted[currentStep] &&
                provider &&
                credential &&
                currentVerify.steps[currentStep || 0]?.form ? (
                  <div className="verify-steps-content-fields">
                    {currentVerify.steps[currentStep || 0]
                      ?.form(
                        provider,
                        credential,
                        currentVerify,
                        walletInformation
                      )
                      ?.fields?.map((input, index) => {
                        if (input.type === 'select') {
                          return (
                            <Select
                              key={index}
                              id={input.name}
                              name={input.name}
                              label={input.placeholder}
                              value={input.value as string}
                              onChange={input.onChange}
                              items={input.items}
                              isDisabled={
                                input.isDisabled || isLoading || hasError
                              }
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
                              value={input.value as boolean}
                              isDisabled={
                                input.isDisabled || isLoading || hasError
                              }
                              isRequired={input.isRequired}
                              onChange={input.onChange}
                            />
                          );
                        }

                        if (input.type === 'datepicker') {
                          return (
                            <DatePicker
                              key={index}
                              name={input.name}
                              placeholder={input.placeholder}
                              value={input.value as string | number}
                              isDisabled={
                                input.isDisabled || isLoading || hasError
                              }
                              isRequired={input.isRequired}
                              onChange={input.onChange}
                            />
                          );
                        }

                        return (
                          <Input
                            key={index}
                            type={(input.type as any) || 'text'}
                            name={input.name}
                            placeholder={input.placeholder}
                            value={input.value as string | number}
                            onChange={input.onChange}
                            isDisabled={
                              input.isDisabled || isLoading || hasError
                            }
                            isRequired={input.isRequired}
                            pattern={input.pattern}
                          />
                        );
                      })}
                  </div>
                ) : null}
                {isLoading && (
                  <div className="verify-steps-loading">
                    <div className="verify-steps-loading-box">
                      <Loading />
                    </div>
                    <p className="verify-steps-loading-text">
                      {provider?.statusMessage || 'Loading...'}
                    </p>
                  </div>
                )}
                {hasError && (
                  <p className="verify-steps-error">
                    {provider?.errorMessage ||
                      'Something went wrong, try later'}
                  </p>
                )}
                {areStepsCompleted || currentStepsCompleted[currentStep] ? (
                  <div className="verify-steps-completed">
                    <p className="verify-steps-completed-title">
                      {currentStepsCompleted[currentStep] ||
                        'All steps completed!'}
                    </p>
                    {areStepsCompleted && (
                      <div className="verify-steps-completed-button">
                        <Button
                          text="See details"
                          onClick={() => handleEverythingCompleted()}
                          isDisabled={isLoading}
                        />
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
              <div className="verify-steps-bottom">
                <div className="verify-steps-bottom-button">
                  {!allStepsCompleted && !isReadOnly ? (
                    <Button
                      text="Close"
                      onClick={() => handleViewStatus('init')}
                      styleType="border"
                      borderBackgroundColor="bunting"
                      isDisabled={isLoading}
                    />
                  ) : null}
                </div>
                <div className="verify-steps-bottom-button">
                  <Button
                    text={
                      currentStepsCompleted[currentStep]
                        ? 'Next'
                        : isReadOnly || allStepsCompleted
                        ? 'Close'
                        : areStepsCompleted
                        ? 'Complete'
                        : isLoading
                        ? 'Loading...'
                        : currentVerify?.steps[currentStep || 0]?.form
                        ? currentVerify?.steps[currentStep || 0]?.form(
                            undefined,
                            undefined,
                            undefined,
                            undefined
                          )?.action?.text
                        : 'Next'
                    }
                    isDisabled={
                      isLoading ||
                      hasError ||
                      Boolean(
                        currentVerify?.steps[currentStep || 0]?.form
                          ? currentStepsCompleted[currentStep]
                            ? false
                            : currentVerify?.steps[currentStep || 0]?.form(
                                provider,
                                credential,
                                currentVerify,
                                walletInformation
                              )?.action?.isDisabled
                          : false
                      )
                    }
                    onClick={
                      isLoading || hasError
                        ? undefined
                        : currentStepsCompleted[currentStep]
                        ? () => handleCurrentStep(currentStep + 1)
                        : isReadOnly || allStepsCompleted || areStepsCompleted
                        ? () => onClose()
                        : currentVerify?.steps[currentStep || 0]?.form
                        ? () =>
                            currentVerify?.steps[currentStep || 0]
                              ?.form(
                                provider,
                                credential,
                                currentVerify,
                                walletInformation
                              )
                              ?.action.method()
                        : () => handleCurrentStep(currentStep + 1)
                    }
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </Wrapper>
    </>
  );
};
