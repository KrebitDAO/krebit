import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import addYears from 'date-fns/addYears';

import { Wrapper } from './styles';
import { Loading } from 'components/Loading';
import { CredentialCard } from 'components/Credentials/credentialCard';
import { CREDENTIALS_INITIAL_STATE } from 'components/Credentials/initialState';
import { formatUrlImage, isValidJSON } from 'utils';
import { substring } from 'components/Groups/utils';
import { GeneralContext } from 'context';
import { Button } from 'components/Button';

const INITIAL_STATUS_METADATA = {
  None: {
    title: 'None',
    description: 'None means that you have initialized a new deal',
    color: 'tango'
  },
  Created: {
    title: 'Created',
    description: 'The owner just created this deal',
    color: 'melrose'
  },
  Delivered: {
    title: 'Delivered',
    description: 'The product has been delivered by the issuer',
    color: 'oliveDrab'
  },
  BuyerCanceled: {
    title: 'BuyerCanceled',
    description: 'The buyer just canceled this deal',
    color: 'redOrange'
  },
  SellerCanceled: {
    title: 'SellerCanceled',
    description: 'The seller just canceled this deal',
    color: 'redOrange'
  },
  Released: {
    title: 'Released',
    description: 'Deal completed',
    color: 'oliveDrab'
  },
  DisputeResolved: {
    title: 'DisputeResolved',
    description: 'This deal has an active dispute',
    color: 'tango'
  }
};
export const Deal = () => {
  const [status, setStatus] = useState('idle');
  const [credential, setCredential] = useState<any>();
  const [credentialStatus, setCredentialStatus] = useState<string>('None');
  const { query, push } = useRouter();
  const { auth, walletInformation } = useContext(GeneralContext);
  const isLoading = status === 'idle' || status === 'pending';
  const currentIssuer = credential?.issuer?.ethereumAddress;
  const issuers = credential?.credentialSubject?.value?.issueTo;

  useEffect(() => {
    if (!window) return;
    if (!query?.credential_id) return;
    if (auth.status !== 'resolved') return;
    if (!walletInformation?.passport) return;

    const getCredential = async () => {
      try {
        setStatus('pending');

        if (!query?.credential_id) {
          push(`/?credential_id=${query.credential_id}`);
          return;
        }

        if (auth.status === 'resolved' && !walletInformation?.passport) {
          push(`/?credential_id=${query.credential_id}`);
          return;
        }

        if (auth?.did) {
          const currentCredential =
            await walletInformation?.passport.getCredential(
              query?.credential_id
            );

          /* if (
            currentCredential?.issuer?.ethereumAddress !==
              walletInformation?.address &&
            !currentCredential?.credentialSubject?.value?.issueTo?.includes(
              walletInformation?.address
            )
          ) {
            push(`/${auth?.did}`);
            return;
          } */

          const dealStatus = await walletInformation?.deals?.checkStatus(
            currentCredential
          );

          const visualInformation = currentCredential.type
            .map(type =>
              CREDENTIALS_INITIAL_STATE.find(state =>
                type.toLowerCase().includes(state.type)
              )
            )
            .filter(value => value !== undefined);

          const credential = {
            ...currentCredential,
            credentialSubject: {
              ...currentCredential?.credentialSubject,
              value: isValidJSON(currentCredential?.credentialSubject?.value)
                ? JSON.parse(currentCredential?.credentialSubject?.value)
                : currentCredential?.credentialSubject?.value
            },
            visualInformation: visualInformation[0] || {}
          };

          setCredential(credential);
          setCredentialStatus(dealStatus);
          setStatus('resolved');
        }
      } catch (error) {
        console.error(error);
        setStatus('rejected');
      }
    };

    getCredential();
  }, [walletInformation, auth.status, auth?.did, query?.credential_id]);

  if (isLoading) {
    return (
      <Wrapper>
        <div className="loading">
          <Loading />
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper
      headerStatusColor={INITIAL_STATUS_METADATA[credentialStatus]?.color}
    >
      <div className="header">
        <p className="header-text">Payment deal</p>
        <div className="header-status">
          <p className="header-status-text">
            {INITIAL_STATUS_METADATA[credentialStatus]?.title}
          </p>
        </div>
      </div>
      <div className="card-container">
        <CredentialCard
          primaryColor={credential?.visualInformation?.primaryColor}
          secondaryColor={credential?.visualInformation?.secondaryColor}
          smaller={true}
          frontChildren={
            <>
              <p className="card-title">
                {credential?.credentialSubject?.value?.name ||
                  credential?.credentialSubject?.value?.title ||
                  'Credential Title'}
              </p>
              <p className="card-description">
                {credential?.credentialSubject?.value?.description || ''}
              </p>
              <div className="card-bottom">
                <div className="card-dates">
                  <div className="card-date">
                    <p className="card-date-title">ISSUED</p>
                    <p className="card-date-text">
                      {credential?.issuanceDate
                        ? new Date(credential?.issuanceDate).toLocaleDateString(
                            'en-US'
                          )
                        : new Date().toLocaleDateString('en-US')}
                    </p>
                  </div>
                  <div className="card-date">
                    <p className="card-date-title">EXPIRES</p>
                    <p className="card-date-text">
                      {credential?.expirationDate
                        ? new Date(
                            credential?.expirationDate
                          ).toLocaleDateString('en-US')
                        : addYears(new Date(), 3).toLocaleDateString('en-US')}
                    </p>
                  </div>
                </div>
                <div className="card-brand">
                  {credential?.visualInformation?.imageUrl ? (
                    <img
                      src={formatUrlImage(
                        credential?.visualInformation?.imageUrl
                      )}
                    />
                  ) : (
                    credential?.visualInformation?.icon
                  )}
                </div>
              </div>
            </>
          }
          backChildren={
            <>
              <p className="card-title">Deal proposed by Seller</p>
              <p className="card-description">Deal terms proposed by seller</p>
              <ul className="card-content-list">
                <li className="card-content-description">
                  Issuer:{' '}
                  <a
                    href={'/' + process.env.NEXT_PUBLIC_ISSUER_DID}
                    target="_blank"
                    className="card-content-description card-content-dots"
                    data-not-parent-click
                  >
                    {substring(process.env.NEXT_PUBLIC_ISSUER_DID, 30, true)}
                  </a>
                </li>
                <li className="card-content-description">
                  Verification Url:{' '}
                  <a
                    href={process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat(
                      '/none'
                    )}
                    target="_blank"
                    className="card-content-description card-content-dots"
                    data-not-parent-click
                  >
                    {process.env.NEXT_PUBLIC_ISSUER_NODE_URL?.concat('/none')}
                  </a>
                </li>
                <li className="card-content-description">
                  Price: ${' ' + credential?.credentialSubject?.price || 0}
                </li>
              </ul>
              <div className="card-bottom">
                <div className="card-brand">
                  {credential?.visualInformation?.imageUrl ? (
                    <img
                      src={formatUrlImage(
                        credential?.visualInformation?.imageUrl
                      )}
                    />
                  ) : (
                    credential?.visualInformation?.icon
                  )}
                </div>
              </div>
            </>
          }
        />
      </div>
      <p className="actions-description">
        {INITIAL_STATUS_METADATA[credentialStatus]?.description}
      </p>
      {currentIssuer && issuers ? (
        <>
          {currentIssuer === walletInformation?.address && (
            <div className="actions-buttons">
              <Button
                text="Cancel"
                onClick={() => {}}
                styleType="border"
                borderBackgroundColor="ebony"
                isDisabled={isLoading}
              />
              <Button text="Pay now" onClick={() => {}} isDisabled={false} />
            </div>
          )}
          {issuers?.includes(walletInformation?.address) && (
            <div className="actions-buttons">
              <Button
                text="Cancel"
                onClick={() => {}}
                styleType="border"
                borderBackgroundColor="ebony"
                isDisabled={isLoading}
              />
              <Button
                text="Mark Delivered"
                onClick={() => {}}
                isDisabled={false}
              />
            </div>
          )}
        </>
      ) : null}
    </Wrapper>
  );
};
