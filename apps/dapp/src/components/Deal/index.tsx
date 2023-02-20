import { ethers } from 'ethers';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import addYears from 'date-fns/addYears';

import { Wrapper } from './styles';
import { Loading } from 'components/Loading';
import { CredentialCard } from 'components/Credentials/credentialCard';
import { CREDENTIALS_INITIAL_STATE } from 'components/Credentials/initialState';
import {
  checkCredentialsURLs,
  sendNotification,
  formatUrlImage,
  isValidJSON,
  sleep
} from 'utils';
import { GeneralContext } from 'context';
import { Button } from 'components/Button';
import { Flip } from 'components/Icons';

const BASE_URL = 'https://krebit.id/deal';
const TX_URL = 'https://polygonscan.com/tx/';
const SLEEP_TIME = 30000;

const INITIAL_STATUS_METADATA = {
  None: {
    title: 'New',
    description: 'Deal waiting for buyer to add funds',
    color: 'tango'
  },
  Created: {
    title: 'Started',
    description: 'The buyer added funds to this deal',
    color: 'melrose'
  },
  Delivered: {
    title: 'Delivered',
    description: 'The product has been delivered by the seller',
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
    title: 'Completed',
    description: 'Deal completed',
    color: 'tango'
  },
  DisputeResolved: {
    title: 'DisputeResolved',
    description: 'The disputed was resolved',
    color: 'tango'
  }
};

export const Deal = () => {
  const [status, setStatus] = useState('idle');
  const [credential, setCredential] = useState<any>();
  const [referral, setReferral] = useState<any>();
  const [credentialStatus, setCredentialStatus] = useState<string>('None');
  const [balance, setBalance] = useState<string>('0.00');
  const [result, setResult] = useState<string>('');
  const { query, push } = useRouter();
  const {
    auth,
    walletInformation,
    walletInformation: { orbis }
  } = useContext(GeneralContext);
  const isLoading = status === 'idle' || status === 'pending';
  const seller = credential?.issuer?.ethereumAddress.toLowerCase();
  const buyers = credential?.value?.issueTo;
  const hasCompletedStatus =
    credentialStatus === 'Released' ||
    credentialStatus === 'BuyerCanceled' ||
    credentialStatus === 'SellerCanceled' ||
    credentialStatus === 'Completed' ||
    credentialStatus === 'DisputeResolved';

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

          /*if (
            currentCredential?.issuer?.ethereumAddress !==
              walletInformation?.address ||
            !currentCredential?.value?.issueTo?.includes(
              walletInformation?.address
            )
          ) {
            push(`/${auth?.did}`);
            return;
          }*/

          const dealStatus = await walletInformation?.deals?.checkStatus(
            currentCredential
          );

          const balance = await walletInformation?.deals?.paymentsBalance();

          const visualInformation = currentCredential.type
            .map(type =>
              CREDENTIALS_INITIAL_STATE.find(state =>
                type.toLowerCase().includes(state.type)
              )
            )
            .filter(value => value !== undefined);

          const priceWei = ethers.BigNumber.from(
            currentCredential?.credentialSubject?.price
          );

          const credential = {
            ...currentCredential,
            value: isValidJSON(currentCredential?.credentialSubject?.value)
              ? JSON.parse(currentCredential?.credentialSubject?.value)
              : currentCredential?.credentialSubject?.value,
            price: ethers.utils.formatEther(priceWei),
            visualInformation: visualInformation[0] || {}
          };

          const referralCredential =
            await walletInformation?.passport.getCredential(
              credential?.value?.referral
            );

          const referral = {
            ...referralCredential,
            value: isValidJSON(referralCredential?.credentialSubject?.value)
              ? JSON.parse(referralCredential?.credentialSubject?.value)
              : referralCredential?.credentialSubject?.value
          };

          setCredential(credential);
          setReferral(referral);
          setCredentialStatus(dealStatus);
          setBalance(balance);
          setStatus('resolved');
          setResult('');
        }
      } catch (error) {
        console.error(error);
        setStatus('rejected');
      }
    };

    getCredential();
  }, [walletInformation, auth.status, auth?.did, query?.credential_id]);

  const createDeal = async () => {
    setStatus('pending_tx');
    console.log('deal Credential: ', credential);
    console.log('referral Credential: ', referral);
    const result = await walletInformation?.deals?.createDeal(
      referral,
      credential
    );
    console.log('createDeal: ', result);
    setResult(result);

    await sleep(SLEEP_TIME);

    await sendNotification({
      orbis,
      authenticatedDID: auth.did,
      body: {
        subject: `Krebit.id Notification - deal: ${
          credential?.value?.name || credential?.value?.title || ''
        } - status: STARTED`,
        content: `${buyers[0]} has added funds to the Deal: ${BASE_URL}?credential_id=${query?.credential_id} Transaction detals: ${TX_URL}${result}`,
        recipients: [seller]
      }
    });

    const currentStatus = await walletInformation?.deals?.checkStatus(
      credential
    );

    setCredentialStatus(currentStatus);
    setStatus('resolved');
  };

  const buyerCancel = async () => {
    setStatus('pending_tx');
    const result = await walletInformation?.deals?.buyerCancel(
      referral,
      credential,
      referral.value?.onBehalveOfIssuer
        ? referral.value?.onBehalveOfIssuer?.ethereumAddress
        : referral.issuer?.ethereumAddress
    );
    console.log('buyerCancel: ', result);
    setResult(result);

    await sleep(SLEEP_TIME);

    await sendNotification({
      orbis,
      authenticatedDID: auth.did,
      body: {
        subject: `Krebit.id Notification - deal: ${
          credential?.value?.name || credential?.value?.title || ''
        } - status: BuyerCanceled`,
        content: `${buyers[0]} has cancelled the Deal: ${BASE_URL}?credential_id=${query?.credential_id} Transaction detals: ${TX_URL}${result}`,
        recipients: [seller]
      }
    });

    const currentStatus = await walletInformation?.deals?.checkStatus(
      credential
    );

    setCredentialStatus(currentStatus);
    setStatus('resolved');
  };

  const sellerCancel = async () => {
    setStatus('pending_tx');

    const result = await walletInformation?.deals?.sellerCancel(
      referral,
      credential,
      referral.value?.onBehalveOfIssuer
        ? referral.value?.onBehalveOfIssuer?.ethereumAddress
        : referral.issuer?.ethereumAddress
    );
    console.log('sellerCancel: ', result);
    setResult(result);

    await sleep(SLEEP_TIME);

    await sendNotification({
      orbis,
      authenticatedDID: auth.did,
      body: {
        subject: `Krebit.id Notification - deal: ${
          credential?.value?.name || credential?.value?.title || ''
        } - status: SellerCanceled`,
        content: `${seller} has cancelled the Deal: ${BASE_URL}?credential_id=${query?.credential_id} Transaction detals: ${TX_URL}${result}`,
        recipients: buyers
      }
    });

    const currentStatus = await walletInformation?.deals?.checkStatus(
      credential
    );

    setCredentialStatus(currentStatus);
    setStatus('resolved');
  };

  const releaseDeal = async () => {
    setStatus('pending_tx');
    const result = await walletInformation?.deals?.releaseDeal(
      referral,
      credential,
      referral.value?.onBehalveOfIssuer
        ? referral.value?.onBehalveOfIssuer?.ethereumAddress
        : referral.issuer?.ethereumAddress
    );
    console.log('releaseDeal: ', result);
    setResult(result);

    await sleep(SLEEP_TIME);

    await sendNotification({
      orbis,
      authenticatedDID: auth.did,
      body: {
        subject: `Krebit.id Notification - deal: ${
          credential?.value?.name || credential?.value?.title || ''
        } - status: Released`,
        content: `${buyers[0]} has released the Deal payment: ${BASE_URL}?credential_id=${query?.credential_id} Transaction detals: ${TX_URL}${result}`,
        recipients: [seller]
      }
    });
    await sendNotification({
      orbis,
      authenticatedDID: auth.did,
      body: {
        subject: `Krebit.id Notification - deal: ${
          credential?.value?.name || credential?.value?.title || ''
        } - Referral Payment`,
        content: `You've received a referral payment for the Deal: ${BASE_URL}?credential_id=${query?.credential_id} Transaction detals: ${TX_URL}${result}`,
        recipients: [
          referral.value?.onBehalveOfIssuer
            ? referral.value?.onBehalveOfIssuer?.ethereumAddress
            : referral.issuer?.ethereumAddress
        ]
      }
    });

    const currentStatus = await walletInformation?.deals?.checkStatus(
      credential
    );

    setCredentialStatus(currentStatus);
    setStatus('resolved');
  };

  const markDelivered = async () => {
    setStatus('pending_tx');
    const result = await walletInformation?.deals?.markDelivered(credential);
    console.log('markDelivered: ', result);
    setResult(result);

    await sleep(SLEEP_TIME);

    await sendNotification({
      orbis,
      authenticatedDID: auth.did,
      body: {
        subject: `Krebit.id Notification - deal: ${
          credential?.value?.name || credential?.value?.title || ''
        } status: Delivered`,
        content: `${seller} has marked the Deal as delivered: ${BASE_URL}?credential_id=${query?.credential_id} Transaction detals: ${TX_URL}${result}`,
        recipients: buyers
      }
    });

    const currentStatus = await walletInformation?.deals?.checkStatus(
      credential
    );

    setCredentialStatus(currentStatus);
    setStatus('resolved');
  };

  const withdrawPayments = async () => {
    setStatus('pending_tx');
    const result = await walletInformation?.deals?.withdrawPayments();
    console.log('withdrawPayments: ', result);
    setResult(result);

    await sleep(SLEEP_TIME);

    const currentStatus = await walletInformation?.deals?.checkStatus(
      credential
    );

    setCredentialStatus(currentStatus);
    setStatus('resolved');
  };

  const handleReview = () => {
    let value: string;

    if (seller === walletInformation?.address) {
      value = buyers[0];
    }

    if (buyers?.includes(walletInformation?.address.toLowerCase())) {
      value = seller;
    }

    if (!value) return;

    push(`/create/review/?issueTo=${value}`);
  };

  const handleHelp = () => {
    window.open('https://discord.gg/VHSq4ABsfz', '_blank');
  };

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
        <p className="header-text">Payment Deal (beta)</p>
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
              <div className="card-title-header">
                <p className="card-title">
                  {credential?.value?.name ||
                    credential?.value?.title ||
                    'Credential Title'}
                </p>
                <div className="card-flip">
                  <Flip />
                </div>
              </div>
              <p className="card-description">
                Price: ${' ' + (credential?.price || 0)}
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
              <div className="card-title-header">
                <p className="card-title">Deal Conditions</p>
                <div className="card-flip">
                  <Flip />
                </div>
              </div>
              <p className="card-description">
                {credential?.value?.description || ''}
              </p>
              <ul className="card-content-list">
                {seller && (
                  <li className="card-content-description">
                    Seller:{' '}
                    <a
                      href={'/' + seller}
                      target="_blank"
                      className="card-content-description card-content-dots"
                      data-not-parent-click
                    >
                      {seller}
                    </a>
                  </li>
                )}
                {buyers && (
                  <li className="card-content-description">
                    Buyer:{' '}
                    <a
                      href={'/' + buyers[0]}
                      target="_blank"
                      className="card-content-description card-content-dots"
                      data-not-parent-click
                    >
                      {buyers[0]}
                    </a>
                  </li>
                )}
                <li className="card-content-description">
                  Deliverable Type: {credential?.value?.deliverableType || ''}
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
        {hasCompletedStatus
          ? 'This deal is completed. Tell us how was the expirience! Create a review to recommend this user!'
          : INITIAL_STATUS_METADATA[credentialStatus]?.description}
      </p>
      {status === 'pending_tx' ? (
        <>
          <div className="loading">
            <Loading />
          </div>
          {result && (
            <div className="actions-buttons-center">
              <Button
                text="Transaction Details"
                onClick={() =>
                  checkCredentialsURLs('polygon', 'tx', {
                    transaction: result
                  })
                }
                isDisabled={false}
                styleType="border"
                borderBackgroundColor="ebony"
              />
            </div>
          )}
        </>
      ) : seller && buyers ? (
        <>
          {(credentialStatus as string) === 'None' && (
            <>
              {buyers?.includes(walletInformation?.address.toLowerCase()) && (
                <div className="actions-buttons">
                  <Button
                    text="Fund Project"
                    onClick={createDeal}
                    isDisabled={false}
                  />
                </div>
              )}
            </>
          )}
          {(credentialStatus as string) === 'Created' && (
            <>
              {seller === walletInformation?.address && (
                <div className="actions-buttons">
                  <Button
                    text="Cancel"
                    onClick={sellerCancel}
                    styleType="border"
                    borderBackgroundColor="ebony"
                    isDisabled={isLoading}
                  />
                  <Button
                    text="Mark Delivered"
                    onClick={markDelivered}
                    isDisabled={false}
                  />
                </div>
              )}
              {buyers?.includes(walletInformation?.address.toLowerCase()) && (
                <div className="actions-buttons">
                  <Button
                    text="Cancel"
                    onClick={buyerCancel}
                    styleType="border"
                    borderBackgroundColor="ebony"
                    isDisabled={isLoading}
                  />
                  <Button
                    text="Release Payment"
                    onClick={releaseDeal}
                    isDisabled={false}
                  />
                </div>
              )}
            </>
          )}
          {(credentialStatus as string) === 'Delivered' && (
            <>
              {seller === walletInformation?.address && (
                <div className="actions-buttons">
                  <Button
                    text="Raise Dispute"
                    onClick={handleHelp}
                    styleType="border"
                    borderBackgroundColor="ebony"
                    isDisabled={isLoading}
                  />
                </div>
              )}
              {buyers?.includes(walletInformation?.address.toLowerCase()) && (
                <div className="actions-buttons">
                  <Button
                    text="Raise Dispute"
                    onClick={handleHelp}
                    styleType="border"
                    borderBackgroundColor="ebony"
                    isDisabled={isLoading}
                  />
                  <Button
                    text="Release Payment"
                    onClick={releaseDeal}
                    isDisabled={false}
                  />
                </div>
              )}
            </>
          )}
          {(credentialStatus as string) === 'Released' && (
            <>
              {seller === walletInformation?.address && (
                <div className="actions-buttons">
                  <p className="actions-balance">
                    Payments Balance: <br />
                    {`$ ${balance}`}
                  </p>
                  <Button
                    text="Withdraw"
                    onClick={withdrawPayments}
                    isDisabled={false}
                  />
                </div>
              )}
            </>
          )}
        </>
      ) : null}
      {hasCompletedStatus ? (
        <div className="actions-buttons">
          <Button
            text="Create review"
            onClick={handleReview}
            isDisabled={false}
          />
        </div>
      ) : null}
    </Wrapper>
  );
};
