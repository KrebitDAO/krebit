import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import Krebit from '@krebitdao/reputation-passport';
import { useRouter } from 'next/router';
import { debounce } from 'ts-debounce';

import { SelectChangeEvent } from '@mui/material/Select';

import { Card, FilterMenu, Wrapper } from './styles';
import { Close, Search, Tune } from 'components/Icons';
import { Slider } from 'components/Slider';
import { Button } from 'components/Button';
import { Loading } from 'components/Loading';
import { formatUrlImage, normalizeSchema } from 'utils';
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
  skill: '',
  krbs: [1, 99],
  value: ''
};

const DEFAULT_SLICE_SKILLS = 5;
// TODO: This big number should be replaced with '9' to follow a right pagination
const DEFAULT_LIST_PAGINATION = 900;

export const Explorer = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState(initialFilterValues);
  const [status, setStatus] = useState('idle');
  const [information, setInformation] = useState<IInformation>();
  const [currentPage, setCurrentPage] = useState(1);
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

  const delayedInformation = useCallback(
    debounce(
      (
        values = initialFilterValues,
        first = DEFAULT_LIST_PAGINATION,
        skip = 0
      ) => searchInformation(values, first, skip),
      500
    ),
    [publicPassport, orbis, filterValues.value, currentPage]
  );

  useEffect(() => {
    if (!publicPassport) return;
    if (!orbis) return;

    delayedInformation(
      filterValues,
      DEFAULT_LIST_PAGINATION * currentPage,
      currentPage === 1 ? 0 : DEFAULT_LIST_PAGINATION * (currentPage - 1)
    );

    return delayedInformation.cancel;
  }, [publicPassport, orbis, filterValues.value, currentPage]);

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

  const handleSkillValue = (value: string) => {
    // TODO: Allow user to filter more than one skill
    /* setFilterValues(prevStates => ({
      ...prevStates,
      skills: prevStates.skills.includes(value)
        ? prevStates.skills.filter(skill => skill !== value)
        : [...prevStates.skills, value]
    })); */

    setFilterValues(prevStates => ({
      ...prevStates,
      skill: value
    }));
  };

  const handleCleanSearchValue = () => {
    setFilterValues(prevStates => ({
      ...prevStates,
      value: ''
    }));
  };

  const handleCurrentPage = () => {
    setCurrentPage(prevValue => prevValue + 1);
  };

  const handleCleanFilterValues = () => {
    setFilterValues(initialFilterValues);
  };

  const handleViewMoreSkills = () => {
    setShouldViewMoreSkills(prevStatus => !prevStatus);
  };

  const searchInformation = async (
    values = initialFilterValues,
    first = DEFAULT_LIST_PAGINATION,
    skip = 0
  ) => {
    try {
      setStatus('pending');

      const response = await Krebit.lib.graph.exploreAccountsQuery({
        first,
        skip,
        where: {
          ERC20balances_: {
            value_gte: values.krbs[0],
            value_lte: values.krbs[1]
          },
          VerifiableCredentials_: {
            _type_contains_nocase: values.value ? values.value : values.skill,
            credentialStatus: 'Issued'
          }
        }
      });

      const profiles = await Promise.all(
        response.map(async account => {
          if (!account?.id) return undefined;

          const defaultDID = await Krebit.lib.orbis.getDefaultDID(account.id);
          const did = defaultDID
            ? defaultDID
            : `did:pkh:eip155:1:${account.id}`;

          const profile = await normalizeSchema.profile({
            orbis,
            did,
            reputation: account.ERC20balances[0].value
          });

          const skills = account.VerifiableCredentials.map(
            values => values?._type
          )
            .map(credentials => (credentials ? JSON.parse(credentials) : []))
            .flatMap(skills => skills);

          return {
            ...profile,
            skills: skills || []
          };
        })
      )
        .then(profiles => profiles.filter(profile => profile !== undefined))
        .then(profiles => profiles.sort((a, b) => b.reputation - a.reputation));

      const skills = profiles.flatMap(profile => profile.skills);

      setInformation(prevValues =>
        currentPage === 1
          ? { profiles, skills }
          : {
              profiles: [...(prevValues?.profiles || []), ...profiles].sort(
                (a, b) => b.reputation - a.reputation
              ),
              skills: [...(prevValues?.skills || []), ...skills]
            }
      );
      setStatus('resolved');
    } catch (error) {
      console.error(error);
      setStatus('rejected');
    }
  };

  const handleSearch = async () => {
    handleFilterOpen();
    setCurrentPage(1);
    setFilterValues(prevStates => ({
      ...prevStates,
      value: ''
    }));
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
                    {Krebit.utils
                      .mergeArray(information?.skills || [])
                      .slice(
                        0,
                        shouldViewMoreSkills ? undefined : DEFAULT_SLICE_SKILLS
                      )
                      .map((item, index) => (
                        <div
                          className={`filter-menu-skills-item ${
                            filterValues.skill === item[0]
                              ? 'filter-menu-skills-item-active'
                              : ''
                          }`}
                          key={index}
                          onClick={() => handleSkillValue(item[0])}
                        >
                          <p className="filter-menu-skills-item-text">
                            {item[0]}{' '}
                            {parseInt(item[1]) === 1 ? '' : '(' + item[1] + ')'}
                          </p>
                        </div>
                      ))}
                  </div>
                  {Krebit.utils.mergeArray(information?.skills || []).length >
                    DEFAULT_SLICE_SKILLS && (
                    <p
                      className="filter-menu-skills-view-more"
                      onClick={handleViewMoreSkills}
                    >
                      {shouldViewMoreSkills
                        ? 'View less'
                        : `View more (${
                            Krebit.utils.mergeArray(information?.skills || [])
                              .length - DEFAULT_SLICE_SKILLS
                          })`}
                    </p>
                  )}
                </>
              )}
            </div>
            <div className="filter-menu-slider">
              <p className="filter-menu-slider-text">$KRB Reputation</p>
              <div className="filter-menu-slider-component">
                <Slider
                  ariaLabel="$KRB Reputation"
                  name="krbs"
                  value={filterValues.krbs}
                  onChange={handleFilterValues}
                />
              </div>
              <div className="filter-menu-slider-bottom">
                <p className="filter-menu-slider-bottom-text">
                  {filterValues.krbs[0]} $KRB
                </p>
                <p className="filter-menu-slider-bottom-text">
                  {filterValues.krbs[1]} $KRB
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
              Krebited Profiles{' '}
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
            <div
              className="explorer-searcher-icon explorer-searcher-icon-white"
              onClick={handleCleanSearchValue}
            >
              <Close />
            </div>
          </div>
          {information?.profiles?.length === 0 ? (
            <p className="explore-card-not-found">No profiles found</p>
          ) : information?.profiles?.length > 0 ? (
            <div className="explorer-cards">
              {information?.profiles.map((profile, index) => (
                <Card picture={formatUrlImage(profile.picture)} key={index}>
                  <div className="explorer-card-picture"></div>
                  <p className="explorer-card-title">{profile.name}</p>
                  <p className="explorer-card-description">
                    $KRB {profile.reputation}
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
          ) : null}
          {isLoading && (
            <div className="explorer-cards">
              {new Array(6).fill(0).map((_, index) => (
                <div className="explorer-card-loading" key={index}>
                  <Loading type="skeleton" />
                </div>
              ))}
            </div>
          )}
          {information?.profiles?.length >=
            DEFAULT_LIST_PAGINATION * currentPage && (
            <div className="explorer-cards-button">
              <Button
                text="View more"
                onClick={handleCurrentPage}
                styleType="border"
                borderBackgroundColor="ebony"
              />
            </div>
          )}
        </div>
      </Wrapper>
    </>
  );
};
