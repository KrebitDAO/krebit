import 'isomorphic-fetch';

const {
  SERVER_GITHUB_CLIENT_ID,
  SERVER_GITHUB_CLIENT_SECRET,
  SERVER_GITHUB_API_URL
} = process.env;

export type GithubUserResponse = {
  id: string;
  login: string;
  followers?: number;
  type?: string;
};

export type GithubOrgResponse = {
  id: string;
  login: string;
  description?: string;
  avatar_url?: string;
};

export type GithubOrgMemberResponse = {
  state: string;
  role: string;
  organization?: GithubUserResponse;
  user?: GithubUserResponse;
};

export type GithubRepoResponse = {
  id: string;
  name: string;
  full_name?: string;
  description?: string;
  owner?: GithubUserResponse;
  organization?: GithubOrgResponse;
  fork?: boolean;
  forks_count?: number;
  html_url?: string;
  stargazers_count?: number;
  watchers_count?: number;
  subscribers_count?: number;
  language?: string;
  languages?: any;
  topics?: string[];
  created_at?: string;
  updated_at?: string;
};

export const requestAccessToken = async (code: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://github.com/login/oauth/access_token?client_id=${SERVER_GITHUB_CLIENT_ID}&client_secret=${SERVER_GITHUB_CLIENT_SECRET}&code=${code}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        }
      }
    ).then(result => result.json());

    if (!response.access_token) throw new Error(response);

    return response.access_token;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getGithubUser = async (accessToken: string): Promise<any> => {
  try {
    const response = await fetch(`${SERVER_GITHUB_API_URL}/user`, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${accessToken}`
      }
    }).then(result => result.json());

    if (!response) throw new Error(response);

    return response as GithubUserResponse;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getGithubRepo = async (
  accessToken: string,
  owner: string,
  repo: string
): Promise<any> => {
  try {
    const response = await fetch(
      `${SERVER_GITHUB_API_URL}/repos/${owner}/${repo}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `token ${accessToken}`
        }
      }
    ).then(result => result.json());
    console.log('response', response);
    if (!response) throw new Error(response);
    response['languages'] = await getGithubRepoLanguages(
      accessToken,
      owner,
      repo
    );

    return response as GithubRepoResponse;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getGithubRepoLanguages = async (
  accessToken: string,
  owner: string,
  repo: string
): Promise<any> => {
  try {
    const response = await fetch(
      `${SERVER_GITHUB_API_URL}/repos/${owner}/${repo}/languages`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `token ${accessToken}`
        }
      }
    ).then(result => result.json());
    console.log('response', response);
    if (!response) throw new Error(response);
    const size: number = Object.values(response).reduce(
      (sum: number, a: number) => sum + a,
      0
    ) as number;
    return Object.entries(response).map(lang => {
      return {
        skillId: lang[0],
        score: ((lang[1] as number) * 100) / size
      };
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getGithubOrg = async (
  accessToken: string,
  org: string
): Promise<any> => {
  try {
    const response = await fetch(`${SERVER_GITHUB_API_URL}/orgs/${org}`, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${accessToken}`
      }
    }).then(result => result.json());
    console.log('response', response);
    if (!response) throw new Error(response);

    return response as GithubOrgResponse;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getGithubOrgMember = async (
  accessToken: string,
  org: string,
  user: string
): Promise<any> => {
  try {
    const response = await fetch(
      `${SERVER_GITHUB_API_URL}/orgs/${org}/memberships/${user}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `token ${accessToken}`
        }
      }
    ).then(result => result.json());
    if (!response) throw new Error(response);
    console.log('response', response);
    return response as GithubOrgMemberResponse;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const isGithubRepoCollaborator = async (
  accessToken: string,
  owner: string,
  repo: string,
  user: string
): Promise<any> => {
  try {
    const response = await fetch(
      `${SERVER_GITHUB_API_URL}/repos/${owner}/${repo}/collaborators/${user}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `token ${accessToken}`
        }
      }
    );
    console.log('response', response);
    if (response.status == 204) return true;
    return false;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const github = {
  requestAccessToken,
  getGithubUser,
  getGithubRepo,
  getGithubOrg,
  getGithubOrgMember,
  isGithubRepoCollaborator
};
