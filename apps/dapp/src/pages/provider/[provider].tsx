import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { BroadcastChannel } from 'broadcast-channel';

const currentProviderChannel = {
  discord: 'discord_oauth_channel',
  twitter: 'twitter_oauth_channel',
  veriff: 'veriff_oauth_channel',
  github: 'github_oauth_channel',
  persona: 'persona_oauth_channel',
  stack: 'stack_oauth_channel'
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

    if (query.provider === 'stack') {
      stackChannel();
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
          target: 'Discord',
          data: { accessToken, tokenType, state: queryState }
        });
      }

      // always close the redirected window
      window.close();
    } else if (
      (queryError || accessToken) &&
      queryState &&
      /^discordGuildOwner-.*/.test(queryState)
    ) {
      // shared message channel between windows (on the same domain)
      const channel = new BroadcastChannel(currentChannel);

      // only continue with the process if a code is returned
      if (accessToken) {
        channel.postMessage({
          target: 'DiscordGuildOwner',
          data: { accessToken, tokenType, state: queryState }
        });
      }

      // always close the redirected window
      window.close();
    } else if (
      (queryError || accessToken) &&
      queryState &&
      /^discordGuildMember-.*/.test(queryState)
    ) {
      // shared message channel between windows (on the same domain)
      const channel = new BroadcastChannel(currentChannel);

      // only continue with the process if a code is returned
      if (accessToken) {
        channel.postMessage({
          target: 'DiscordGuildMember',
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
          target: 'Twitter',
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
          target: 'TwitterFollowers',
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
    if (queryState && /^veriffLegalName-.*/.test(queryState)) {
      // shared message channel between windows (on the same domain)
      const channel = new BroadcastChannel(currentChannel);

      // only continue with the process if a code is returned
      channel.postMessage({
        target: 'VeriffLegalName',
        data: { state: queryState }
      });
    } else if (queryState && /^veriffAgeGT18-.*/.test(queryState)) {
      // shared message channel between windows (on the same domain)
      const channel = new BroadcastChannel(currentChannel);

      // only continue with the process if a code is returned
      channel.postMessage({
        target: 'VeriffAgeGT18',
        data: { state: queryState }
      });
    } else if (queryState && /^veriffGovernmentId-.*/.test(queryState)) {
      // shared message channel between windows (on the same domain)
      const channel = new BroadcastChannel(currentChannel);

      // only continue with the process if a code is returned
      channel.postMessage({
        target: 'VeriffGovernmentId',
        data: { state: queryState }
      });
    }
    // always close the redirected window
    window.close();
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
          target: 'Github',
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
          target: 'GithubFollowersGT10',
          data: { code: queryCode, state: queryState }
        });
      }
    } else if (
      (queryError || queryCode) &&
      queryState &&
      /^githubRepoOwner-.*/.test(queryState)
    ) {
      // shared message channel between windows (on the same domain)
      const channel = new BroadcastChannel(currentChannel);

      // only continue with the process if a code is returned
      if (queryCode) {
        channel.postMessage({
          target: 'GithubRepoStarsGT10',
          data: { code: queryCode, state: queryState }
        });
      }
    } else if (
      (queryError || queryCode) &&
      queryState &&
      /^githubRepoCollaborator-.*/.test(queryState)
    ) {
      // shared message channel between windows (on the same domain)
      const channel = new BroadcastChannel(currentChannel);

      // only continue with the process if a code is returned
      if (queryCode) {
        channel.postMessage({
          target: 'GithubRepoCollaborator',
          data: { code: queryCode, state: queryState }
        });
      }
    } else if (
      (queryError || queryCode) &&
      queryState &&
      /^githubOrgMember-.*/.test(queryState)
    ) {
      // shared message channel between windows (on the same domain)
      const channel = new BroadcastChannel(currentChannel);

      // only continue with the process if a code is returned
      if (queryCode) {
        channel.postMessage({
          target: 'GithubOrgMember',
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

  const stackChannel = () => {
    const queryString = new URLSearchParams(window?.location?.hash);

    const [queryError, queryState, accessToken] = [
      queryString.get('error'),
      queryString.get('state'),
      queryString.get('#access_token')
    ];
    console.log('queryString', queryString);

    // if stackReputation oauth then submit message to other windows and close self
    if (
      (queryError || accessToken) &&
      queryState &&
      /^stackReputation-.*/.test(queryState)
    ) {
      // shared message channel between windows (on the same domain)
      const channel = new BroadcastChannel(currentChannel);

      // only continue with the process if a code is returned
      if (accessToken) {
        channel.postMessage({
          target: 'StackOverflowReputationGT1K',
          data: { accessToken, state: queryState }
        });
      }
    }
    // always close the redirected window
    window.close();
  };

  return <></>;
};

export default DynamicProvider;
