import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Wrapper } from './styles';
import { NavBar } from 'components/NavBar';
import { Loading } from 'components/Loading';
import { GeneralContext } from 'context';
import { constants } from 'utils';

export const ClaimCredential = () => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const { query, push } = useRouter();
  const {
    auth,
    walletInformation: { issuer }
  } = useContext(GeneralContext);

  useEffect(() => {
    if (!window) return;
    if (!query?.credential_id) return;
    if (auth.status !== 'resolved') return;

    const validateCredential = async () => {
      try {
        if (!query?.credential_id) {
          setErrorMessage(constants.DEFAULT_ERROR_MESSAGES.ID_NOT_FOUND);
          return;
        }

        if (auth.status === 'resolved' && !issuer) {
          push(`/?credential_id=${query.credential_id}`);
          return;
        }

        if (auth?.did) {
          const currentCredential = await issuer.getCredential(
            query.credential_id
          );

          if (currentCredential) {
            const isCredentialValid = await issuer.checkCredential(
              currentCredential
            );
            const hasCorrectTypes = currentCredential?.type?.some(
              (type: string) =>
                constants.DEFAULT_CLAIM_CREDENTIAL_TYPES.includes(type)
            );

            if (isCredentialValid && hasCorrectTypes) {
              push(`/${auth.did}/?credential_id=${query.credential_id}`);
              return;
            }

            setErrorMessage(constants.DEFAULT_ERROR_MESSAGES.ID_NOT_FOUND);
            return;
          }

          setErrorMessage(constants.DEFAULT_ERROR_MESSAGES.ID_NOT_FOUND);
        }
      } catch (error) {
        console.error(error);
        setErrorMessage('Internal error');
      }
    };

    validateCredential();
  }, [issuer, auth.status, auth?.did, query.credential_id]);

  return (
    <>
      <NavBar />
      <Wrapper>
        {errorMessage ? (
          <p className="claim-error">{errorMessage}</p>
        ) : (
          <div className="claim-loading">
            <Loading />
          </div>
        )}
      </Wrapper>
    </>
  );
};
