import { useContext, useEffect, useState } from 'react';
import ErrorWrapper from 'next/error';
import Link from 'next/link';

import { Card, Wrapper } from './styles';
import { Layout } from 'components/Layout';
import { Loading } from 'components/Loading';
import { ArrowForward } from 'components/Icons';
import { CREDENTIALS_INITIAL_STATE } from './initialState';
import { GeneralContext } from 'context';

export const Credentials = () => {
  const [status, setStatus] = useState('idle');
  const { auth } = useContext(GeneralContext);
  const isLoading = status === 'idle' || status === 'pending';

  useEffect(() => {
    if (auth.status !== 'resolved') return;

    setStatus('pending');

    try {
      if (!auth?.isAuthenticated) {
        throw new Error('Not authorized');
      }

      setStatus('resolved');
    } catch (error) {
      console.error(error);
      setStatus('rejected');
    }
  }, [auth.status, auth?.isAuthenticated]);

  if (status === 'rejected') {
    return <ErrorWrapper statusCode={404} />;
  }

  return (
    <Layout>
      <Wrapper isLoading={isLoading}>
        {isLoading ? (
          <div className="credentials-loading">
            <Loading />
          </div>
        ) : (
          <>
            <h1 className="credentials-title">Create your credentials</h1>
            <div className="credentials-content">
              {CREDENTIALS_INITIAL_STATE.map((values, index) => (
                <Link href={`/credentials/${values.id}`} key={index}>
                  <Card
                    primaryColor={values.primaryColor}
                    secondaryColor={values.secondaryColor}
                  >
                    <p className="card-title">{values.title}</p>
                    <p className="card-description">{values.description}</p>
                    <div className="card-button">
                      <p className="card-button-text">Create</p>
                      <div className="card-button-icon">
                        <ArrowForward />
                      </div>
                    </div>
                    <div className="card-icon">{values.icon}</div>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </Wrapper>
    </Layout>
  );
};
