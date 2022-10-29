import { Orbis } from '@orbisclub/orbis-sdk';

/** To sort an array based on a specific key */
export function sortByKey(array, key) {
  return array.sort(function (a, b) {
    var x = a[key];
    var y = b[key];
    return x > y ? -1 : x < y ? 1 : 0;
  });
}

const getDefaultDID = async (address: string) => {
  const orbis = new Orbis();
  /** Check if the user trying to connect already has an existing did on Orbis */
  let dids = await orbis.getDids(address);
  let { data: existingDids, error: errorDids } = dids;

  if (existingDids && existingDids.length > 0) {
    let sortedDids = sortByKey(existingDids, 'count_followers');

    if (sortedDids[0].did.includes('eip155')) {
      return sortedDids[0].did;
    } else return null;
  }
};

export const orbis = {
  getDefaultDID
};
