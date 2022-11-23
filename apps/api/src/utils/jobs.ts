import 'isomorphic-fetch';

const { SERVER_JOB_BOARDS } = process.env;

const JOB_BOARDS = JSON.parse(
  Buffer.from(SERVER_JOB_BOARDS, 'base64').toString('utf-8')
);

console.log('JOB_BOARDS', JOB_BOARDS);

export const getBoardJobs = async (
  size: number,
  postedSince: string
): Promise<any> => {
  try {
    let results = [];

    for (var board of JOB_BOARDS) {
      const response = await fetch(`${board.url}/api-boards/search-jobs`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'accept-language': 'en-US,en;q=0.6',
          'content-type': 'application/json',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'sec-gpc': '1'
        },
        body: JSON.stringify({
          meta: {
            size
          },
          board: {
            id: board.id,
            isParent: true
          },
          query: {
            remoteOnly: true,
            internshipOnly: false,
            managerOnly: false,
            bestFit: false,
            postedSince: postedSince
          }
        })
      }).then(result => result.json());
      results = results.concat(response.jobs);
    }

    return results;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const jobs = {
  getBoardJobs
};
