import { create } from 'ipfs-http-client';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string';
import { concat as uint8ArrayConcat } from 'uint8arrays/concat';

interface ICountry {
  isoCode: string;
  name: string;
  phonecode: string;
  flag: string;
  currency: string;
  latitude: string;
  longitude: string;
  timezones: [
    {
      zoneName: string;
      gmtOffset: number;
      gmtOffsetName: string;
      abbreviation: string;
      tzName: string;
    }
  ];
}

const { APP_IPFS_GATEWAY, APP_UNLOCODE_FOLDER, APP_CLAIM_TYPES } = process.env;

const ipfs = create({
  url: APP_IPFS_GATEWAY,
});
(window as any).ipfs = ipfs;

const getCountryByCode = async (isoCode: string) => {
  const ipfsPath = APP_UNLOCODE_FOLDER + '/country.json';
  const chunks = [];

  for await (const chunk of ipfs.cat(ipfsPath)) {
    chunks.push(chunk);
  }

  const data = uint8ArrayConcat(chunks);
  const countryList = JSON.parse(uint8ArrayToString(data));

  const codex = countryList.findIndex((c: ICountry) => {
    return c.isoCode === isoCode;
  });

  return codex !== -1 ? countryList[codex] : '';
};

const getCountries = async () => {
  const ipfsPath = APP_UNLOCODE_FOLDER + '/country.json';
  const chunks = [];

  for await (const chunk of ipfs.cat(ipfsPath)) {
    chunks.push(chunk);
  }

  const data = uint8ArrayConcat(chunks);
  const countryList = JSON.parse(uint8ArrayToString(data));

  let options = [];
  for (let c in countryList) {
    options.push({
      label: countryList[c].name + ' ' + countryList[c].flag,
      value: countryList[c].isoCode,
    });
  }

  return options;
};

const getCitiesByCountry = async (countryCode: string) => {
  const ipfsPath =
    APP_UNLOCODE_FOLDER + '/cities/' + countryCode.toLowerCase() + '.json';
  const chunks = [];

  for await (const chunk of ipfs.cat(ipfsPath)) {
    chunks.push(chunk);
  }

  const data = uint8ArrayConcat(chunks);
  const cityList = JSON.parse(uint8ArrayToString(data));

  let options = [];
  for (let c in cityList) {
    options.push({
      label: cityList[c].namewodiacritics + ', ' + cityList[c].subdiv,
      value: cityList[c].locode,
    });
  }

  return options;
};

const getCityByCode = async (locode: string) => {
  let cityList = await getCitiesByCountry(locode.split(' ')[0]);

  let codex = cityList.findIndex(c => {
    return c.locode === locode;
  });

  return codex !== -1 ? cityList[codex] : '';
};

const getIPFSFile = async (ipfsHash: string) => {
  const chunks = [];

  for await (const chunk of ipfs.cat(ipfsHash)) {
    chunks.push(chunk);
  }

  const data = uint8ArrayConcat(chunks);

  return data;
};

const getClaimTypes = async () => {
  const ipfsPath = APP_CLAIM_TYPES;
  const chunks = [];

  for await (const chunk of ipfs.cat(ipfsPath)) {
    chunks.push(chunk);
  }

  const data = uint8ArrayConcat(chunks);
  const claimTypeList = JSON.parse(uint8ArrayToString(data));

  const options = [];
  for (let c in claimTypeList) {
    options.push({
      label: claimTypeList[c].emoji + ' ' + claimTypeList[c].i18n.en,
      value: claimTypeList[c].name,
    });
  }

  return options;
};

export {
  ipfs,
  getCountries,
  getCitiesByCountry,
  getCountryByCode,
  getCityByCode,
  getIPFSFile,
  getClaimTypes,
};
