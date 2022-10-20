import { ChangeEvent, useContext, useEffect, useState } from 'react';
import Krebit from '@krebitdao/reputation-passport';
import { useRouter } from 'next/router';
import { debounce } from 'ts-debounce';

import { SelectChangeEvent } from '@mui/material/Select';

import { Card, FilterMenu, Wrapper } from './styles';
import { Close, Search, Tune } from 'components/Icons';
import { Slider } from 'components/Slider';
import { Button } from 'components/Button';
import { Loading } from 'components/Loading';
import { mergeArray, normalizeSchema } from 'utils';
import { useWindowSize } from 'hooks';
import { GeneralContext } from 'context';

interface IProfile {
  did: string;
  background: string;
  picture: string;
  name: string;
  reputation: string | number;
  countFollowers: number;
  countFollowing: number;
  stamps: any[];
}

interface IInformation {
  profiles: IProfile[];
  skills: string[];
}

const initialFilterValues = {
  skills: [],
  krbs: [3, 99],
  value: ''
};

const DEFAULT_SLICE_SKILLS = 5;

export const Explorer = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState(initialFilterValues);
  const [status, setStatus] = useState('idle');
  const [information, setInformation] = useState<IInformation>();
  const [shouldViewMoreSkills, setShouldViewMoreSkills] = useState(false);
  const {
    walletInformation: { publicPassport, orbis }
  } = useContext(GeneralContext);
  const router = useRouter();
  const { width } = useWindowSize();
  const isDesktop = width >= 1024;
  const isLoading = status === 'pending';

  useEffect(() => {
    if (isDesktop && !isFilterOpen) {
      setIsFilterOpen(true);
    }
  }, [isDesktop, isFilterOpen]);

  useEffect(() => {
    if (!publicPassport) return;
    if (!orbis) return;

    const getProfiles = async () => {
      await searchInformation(filterValues);
    };

    getProfiles();
  }, [publicPassport, orbis, filterValues.value]);

  const handleFilterOpen = () => {
    if (isDesktop) return;

    setIsFilterOpen(prevState => !prevState);
  };

  const handleFilterValues = (
    event: SelectChangeEvent & Event & ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    event.preventDefault();

    setFilterValues(prevStates => ({
      ...prevStates,
      [name]: value
    }));
  };

  const handleCleanFilterValues = () => {
    setFilterValues(initialFilterValues);
  };

  const handleViewMoreSkills = () => {
    setShouldViewMoreSkills(prevStatus => !prevStatus);
  };

  const searchInformation = async (values = initialFilterValues, first = 9) => {
    try {
      setStatus('pending');

      const erc20BalancesResponse = await Krebit.lib.graph.erc20BalancesQuery({
        first,
        orderDirection: 'desc',
        orderBy: 'value',
        where: {
          value_gte: values.krbs[0],
          value_lte: values.krbs[1]
        }
      });

      const profiles = await Promise.all(
        erc20BalancesResponse.map(async balance => {
          if (!balance?.account?.id) return undefined;

          const defaultDID = await Krebit.lib.orbis.getDefaultDID(
            balance.account.id
          );
          const did = defaultDID
            ? defaultDID
            : `did:pkh:eip155:1:${balance.account.id}`;

          const [profile, stamps] = await Promise.all([
            normalizeSchema.profile({
              orbis,
              did,
              reputation: balance.value
            }),
            Krebit.lib.graph.verifiableCredentialsQuery({
              orderBy: 'issuanceDate',
              orderDirection: 'desc',
              where: {
                credentialSubjectAddress: balance.account.id
              }
            })
          ]);

          const skills = stamps
            .map(stamp => (stamp?._type ? JSON.parse(stamp._type) : []))
            .flatMap(skills => skills);

          return {
            ...profile,
            stamps: stamps || [],
            skills: skills || []
          };
        })
      ).then(profiles => profiles.filter(profile => profile !== undefined));

      const skills = profiles.flatMap(profile => profile.skills);

      setInformation({ profiles, skills });
      setStatus('resolved');
    } catch (error) {
      console.error(error);
      setStatus('rejected');
    }
  };

  const handleSearch = async () => {
    handleFilterOpen();
    await searchInformation(filterValues);
  };

  return (
    <>
      {isFilterOpen && !isDesktop ? (
        <style global jsx>{`
          html,
          body {
            overflow: hidden;
          }
        `}</style>
      ) : null}
      <Wrapper isFilterOpen={isFilterOpen}>
        <div className="filter-menu-background">
          <div className="filter-menu-header-desktop">
            <p className="filter-menu-header-desktop-title">Filter</p>
            <div
              className="filter-menu-header-desktop-clear"
              onClick={handleCleanFilterValues}
            >
              <div className="filter-menu-header-desktop-clear-icon">
                <Close />
              </div>
              <p className="filter-menu-header-desktop-clear-text">
                Clean filters
              </p>
            </div>
          </div>
          <FilterMenu isFilterOpen={isFilterOpen}>
            <div className="filter-menu-header">
              <p className="filter-menu-header-text">Filter</p>
              <div
                className="filter-menu-header-close"
                onClick={handleFilterOpen}
              >
                <Close />
              </div>
            </div>
            <div
              className="filter-menu-clear"
              onClick={handleCleanFilterValues}
            >
              <div className="filter-menu-clear-icon">
                <Close />
              </div>
              <p className="filter-menu-clear-text">Clean filters</p>
            </div>
            <div className="filter-menu-skills">
              <p className="filter-menu-skills-text">Skills</p>
              {isLoading ? (
                <div className="filter-menu-skills-loading">
                  <Loading />
                </div>
              ) : information?.skills?.length === 0 ? (
                <p className="filter-menu-no-skills">No skills found</p>
              ) : (
                <>
                  <div className="filter-menu-skills-list">
                    {mergeArray(information?.skills || [])
                      .slice(
                        0,
                        shouldViewMoreSkills ? -1 : DEFAULT_SLICE_SKILLS
                      )
                      .map((item, index) => (
                        <div className="filter-menu-skills-item" key={index}>
                          <p className="filter-menu-skills-item-text">
                            {item[0]}{' '}
                            {parseInt(item[1]) === 1 ? '' : '(' + item[1] + ')'}
                          </p>
                        </div>
                      ))}
                  </div>
                  <p
                    className="filter-menu-skills-view-more"
                    onClick={handleViewMoreSkills}
                  >
                    View more (
                    {mergeArray(information?.skills || []).length -
                      DEFAULT_SLICE_SKILLS}
                    )
                  </p>
                </>
              )}
            </div>
            <div className="filter-menu-slider">
              <p className="filter-menu-slider-text">KRBs Quantity</p>
              <div className="filter-menu-slider-component">
                <Slider
                  ariaLabel="KRBs Quantity"
                  name="krbs"
                  value={filterValues.krbs}
                  onChange={handleFilterValues}
                />
              </div>
              <div className="filter-menu-slider-bottom">
                <p className="filter-menu-slider-bottom-text">
                  {filterValues.krbs[0]} KRBs
                </p>
                <p className="filter-menu-slider-bottom-text">
                  {filterValues.krbs[1]} KRBs
                </p>
              </div>
            </div>
            <div className="filter-menu-button">
              <Button
                text="Apply"
                onClick={handleSearch}
                styleType="border"
                borderBackgroundColor="ebonyClay"
                isDisabled={isLoading}
              />
            </div>
          </FilterMenu>
        </div>
        <div className="explorer-container">
          <div className="explorer-header">
            <p className="explorer-header-title">
              Profiles{' '}
              <span className="explorer-header-span">
                {information?.profiles?.length || 0} results
              </span>
            </p>
            <div className="explorer-header-icon" onClick={handleFilterOpen}>
              <Tune />
            </div>
          </div>
          <div className="explorer-searcher">
            <div className="explorer-searcher-icon">
              <Search />
            </div>
            <input
              placeholder="Search skills"
              value={filterValues.value}
              onChange={handleFilterValues}
              name="value"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
            <div className="explorer-searcher-icon explorer-searcher-icon-white">
              <Close />
            </div>
          </div>
          {isLoading ? (
            <div className="explorer-cards">
              {new Array(6).fill(0).map((_, index) => (
                <div className="explorer-card-loading" key={index}>
                  <Loading type="skeleton" />
                </div>
              ))}
            </div>
          ) : information?.profiles?.length === 0 ? (
            <p className="explore-card-not-found">No profiles found</p>
          ) : (
            <div className="explorer-cards">
              {information?.profiles.map((profile, index) => (
                <Card picture={profile.picture} key={index}>
                  <div className="explorer-card-picture"></div>
                  <p className="explorer-card-title">{profile.name}</p>
                  <p className="explorer-card-description">
                    KRBs {profile.reputation}
                  </p>
                  <div className="explorer-card-followers">
                    <span className="explorer-card-follow">
                      {profile.countFollowers >= 100
                        ? '+99'
                        : profile.countFollowers}{' '}
                      <span className="explorer-card-follow-text">
                        Followers
                      </span>
                    </span>
                    <span className="explorer-card-follow-dot"></span>
                    <span className="explorer-card-follow">
                      {profile.countFollowing >= 100
                        ? '+99'
                        : profile.countFollowing}{' '}
                      <span className="explorer-card-follow-text">
                        Following
                      </span>
                    </span>
                  </div>
                  <div className="explorer-card-button">
                    <Button
                      text="View profile"
                      onClick={() => router.push(`/${profile.did}`)}
                      styleType="border"
                      borderBackgroundColor="ebonyClay"
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Wrapper>
    </>
  );
};
