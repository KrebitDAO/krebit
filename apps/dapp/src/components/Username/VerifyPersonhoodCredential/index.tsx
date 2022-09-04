import { useContext } from 'react';

import { Verify } from 'components/Verify';
import { BoxStep } from 'components/Verify/boxStep';
import { constants } from 'utils';
import { GeneralContext } from 'context';
import {
  useDiscordProvider,
  useTwitterProvider,
  useVeriffProvider
} from 'hooks';

interface IProps {
  currentPersonhood: {
    discord: {
      credential: Object;
      stamp: Object;
    };
    twitter: {
      credential: Object;
      stamp: Object;
    };
    veriff: {
      credential: Object;
      stamp: Object;
    };
  };
  onClose: () => void;
}

export const VerifyPersonhoodCredential = (props: IProps) => {
  const { currentPersonhood, onClose } = props;
  const { walletInformation } = useContext(GeneralContext);
  const dicordProvider = useDiscordProvider();
  const twitterProvider = useTwitterProvider();
  const veriffProvider = useVeriffProvider();

  const getInitialList = () => {
    if (!currentPersonhood) return [];

    return constants.PERSONHOOD_CREDENTIALS.map(personhood => {
      const values = currentPersonhood[personhood.id];

      if (values) {
        return {
          ...personhood,
          action:
            values.credential && values.stamp
              ? {
                  // TODO: ADD LINK TO REDIRECT TO TRANSACTION
                  text: 'Check in',
                  onClick: () => {}
                }
              : undefined
        };
      }

      return personhood;
    });
  };

  return (
    <Verify
      initialList={getInitialList()}
      onClose={onClose}
      component={({ currentVerify }) => (
        <>
          {currentVerify?.id === 'discord' && (
            <>
              <BoxStep
                title="Step 1"
                description="Step 1 for Discord verification"
                form={{
                  button: {
                    text: 'Verify',
                    onClick:
                      dicordProvider.status === 'pending' ||
                      !!currentPersonhood.discord.credential
                        ? undefined
                        : dicordProvider.handleFetchOAuth,
                    isDisabled:
                      dicordProvider.status === 'pending' ||
                      !!currentPersonhood.discord.credential
                  }
                }}
              />
              <BoxStep
                title="Step 2"
                description="Step 2 for Discord verification"
                form={{
                  button: {
                    text: 'Stamp',
                    onClick:
                      dicordProvider.status === 'pending' ||
                      !!currentPersonhood.discord.stamp
                        ? undefined
                        : dicordProvider.handleStampCredential,
                    isDisabled:
                      dicordProvider.status === 'pending' ||
                      !!currentPersonhood.discord.stamp
                  }
                }}
              />
            </>
          )}
          {currentVerify?.id === 'twitter' && (
            <>
              <BoxStep
                title="Step 1"
                description="Step 1 for Twitter verification"
                form={{
                  button: {
                    text: 'Verify',
                    onClick:
                      twitterProvider.status === 'pending' ||
                      !!currentPersonhood.twitter.credential
                        ? undefined
                        : () =>
                            twitterProvider.handleFetchOAuth(
                              walletInformation.address
                            ),
                    isDisabled:
                      twitterProvider.status === 'pending' ||
                      !!currentPersonhood.twitter.credential
                  }
                }}
              />
              <BoxStep
                title="Step 2"
                description="Step 2 for Twitter verification"
                form={{
                  button: {
                    text: 'Stamp',
                    onClick:
                      twitterProvider.status === 'pending' ||
                      !!currentPersonhood.twitter.stamp
                        ? undefined
                        : twitterProvider.handleStampCredential,
                    isDisabled:
                      twitterProvider.status === 'pending' ||
                      !!currentPersonhood.twitter.stamp
                  }
                }}
              />
            </>
          )}
          {currentVerify?.id === 'veriff' && (
            <>
              <BoxStep
                title="Step 1"
                description="Enter your information"
                form={{
                  inputs: [
                    {
                      name: 'firstName',
                      placeholder: 'Enter you first name',
                      value: veriffProvider.claimValues.firstName,
                      onChange: veriffProvider.handleClaimValues
                    },
                    {
                      name: 'lastName',
                      placeholder: 'Enter you last name',
                      value: veriffProvider.claimValues.lastName,
                      onChange: veriffProvider.handleClaimValues
                    }
                  ],
                  button: {
                    text: 'Verify',
                    onClick:
                      veriffProvider.status === 'pending' ||
                      !veriffProvider.claimValues.firstName ||
                      !veriffProvider.claimValues.lastName ||
                      !!currentPersonhood.veriff.credential
                        ? undefined
                        : () =>
                            veriffProvider.handleFetchOAuth(
                              walletInformation.address
                            ),
                    isDisabled:
                      veriffProvider.status === 'pending' ||
                      !veriffProvider.claimValues.firstName ||
                      !veriffProvider.claimValues.lastName ||
                      !!currentPersonhood.veriff.credential
                  }
                }}
              />
              <BoxStep
                title="Step 2"
                description="Step 2 to stamp verification"
                form={{
                  button: {
                    text: 'Stamp',
                    onClick:
                      veriffProvider.status === 'pending'
                        ? undefined
                        : veriffProvider.handleStampCredential,
                    isDisabled:
                      veriffProvider.status === 'pending' ||
                      !!currentPersonhood.veriff.stamp
                  }
                }}
              />
            </>
          )}
        </>
      )}
    />
  );
};
