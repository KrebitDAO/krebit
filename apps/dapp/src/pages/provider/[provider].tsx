import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { BroadcastChannel } from 'broadcast-channel';

const currentProviderChannel = {
  discord: 'discord_oauth_channel',
  twitter: 'twitter_oauth_channel',
  veriff: 'veriff_oauth_channel',
  github: 'github_oauth_channel',
  persona: 'persona_oauth_channel'
};

const DynamicProvider = () => {
  const { query } = useRouter();
  const currentChannel =
    currentProviderChannel[query.provider as string | undefined];

  useEffect(() => {
    if (!window) return;
    if (!currentChannel) return;

    if (query.provider === 'discord') {
      discordChannel();
    }

    if (query.provider === 'twitter') {
      twitterChannel();
    }

    if (query.provider === 'veriff') {
      veriffChannel();
    }

    if (query.provider === 'github') {
      githubChannel();
    }

    if (query.provider === 'persona') {
      personaChannel();
    }
  }, [query.provider, currentChannel]);

  const discordChannel = () => {
    const queryString = new URLSearchParams(window?.location?.hash);

    const [queryError, queryState, accessToken, tokenType] = [
      queryString.get('error'),
      queryString.get('state'),
      queryString.get('access_token'),
      queryString.get('#token_type')
    ];

    // if Discord oauth then submit message to other windows and close self
    if (
      (queryError || accessToken) &&
      queryState &&
      /^discord-.*/.test(queryState)
    ) {
      // shared message channel between windows (on the same domain)
      const channel = new BroadcastChannel(currentChannel);

      // only continue with the process if a code is returned
      if (accessToken) {
        channel.postMessage({
          target: 'discord',
          data: { accessToken, tokenType, state: queryState }
        });
      }

      // always close the redirected window
      window.close();
    }
  };

  const twitterChannel = () => {
    const queryString = new URLSearchParams(window?.location?.search);

    const [queryError, queryState, queryCode] = [
      queryString.get('error'),
      queryString.get('state'),
      queryString.get('code')
    ];

    // if Twitter oauth then submit message to other windows and close self
    if (
      (queryError || queryCode) &&
      queryState &&
      /^twitter-.*/.test(queryState)
    ) {
      // shared message channel between windows (on the same domain)
      const channel = new BroadcastChannel(currentChannel);

      // only continue with the process if a code is returned
      if (queryCode) {
        channel.postMessage({
          target: 'twitter',
          data: { code: queryCode, state: queryState }
        });
      }
    } else if (
      (queryError || queryCode) &&
      queryState &&
      /^twitterFollowers-.*/.test(queryState)
    ) {
      // shared message channel between windows (on the same domain)
      const channel = new BroadcastChannel(currentChannel);

      // only continue with the process if a code is returned
      if (queryCode) {
        channel.postMessage({
          target: 'twitterFollowers',
          data: { code: queryCode, state: queryState }
        });
      }
    }
    // always close the redirected window
    window.close();
  };

  const veriffChannel = () => {
    const queryString = new URLSearchParams(window?.location?.search);
    const queryState = queryString.get('status');

    // if Veriff oauth then submit message to other windows and close self
    if (queryState && queryState == 'submitted') {
      // shared message channel between windows (on the same domain)
      const channel = new BroadcastChannel(currentChannel);

      // only continue with the process if a code is returned
      channel.postMessage({
        target: 'veriff',
        data: { state: queryState }
      });

      // always close the redirected window
      window.close();
    }
  };

  const githubChannel = () => {
    const queryString = new URLSearchParams(window?.location?.search);

    const [queryError, queryState, queryCode] = [
      queryString.get('error'),
      queryString.get('state'),
      queryString.get('code')
    ];

    // if Twitter oauth then submit message to other windows and close self
    if (
      (queryError || queryCode) &&
      queryState &&
      /^github-.*/.test(queryState)
    ) {
      // shared message channel between windows (on the same domain)
      const channel = new BroadcastChannel(currentChannel);

      // only continue with the process if a code is returned
      if (queryCode) {
        channel.postMessage({
          target: 'github',
          data: { code: queryCode, state: queryState }
        });
      }
    } else if (
      (queryError || queryCode) &&
      queryState &&
      /^githubFollowers-.*/.test(queryState)
    ) {
      // shared message channel between windows (on the same domain)
      const channel = new BroadcastChannel(currentChannel);

      // only continue with the process if a code is returned
      if (queryCode) {
        channel.postMessage({
          target: 'githubFollowers',
          data: { code: queryCode, state: queryState }
        });
      }
    }
    // always close the redirected window
    window.close();
  };

  const personaChannel = () => {
    const queryString = new URLSearchParams(window?.location?.search);

    const [queryStatus, queryState, inquiryId] = [
      queryString.get('status'),
      queryString.get('reference-id'),
      queryString.get('inquiry-id')
    ];

    // if Veriff oauth then submit message to other windows and close self
    if (
      (queryStatus === 'completed' || inquiryId) &&
      queryState &&
      /^persona-.*/.test(queryState)
    ) {
      // shared message channel between windows (on the same domain)
      const channel = new BroadcastChannel(currentChannel);

      // only continue with the process if a code is returned
      channel.postMessage({
        target: 'persona',
        data: { id: inquiryId, state: queryState }
      });

      // always close the redirected window
      window.close();
    }
  };

  return <></>;
};

export default DynamicProvider;
