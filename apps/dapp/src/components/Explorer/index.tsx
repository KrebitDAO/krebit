import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import Krebit from '@krebitdao/reputation-passport';
import { logCustomEvent } from 'arena-tools';
import { debounce } from 'ts-debounce';
import Link from 'next/link';

import { SelectChangeEvent } from '@mui/material/Select';

import {
  ProfileCard,
  FilterMenu,
  Wrapper,
  ServiceCard,
  ItemBox
} from './styles';
import { Close, Search, Tune } from 'components/Icons';
import { Slider } from 'components/Slider';
import { Button } from 'components/Button';
import { Loading } from 'components/Loading';
import { Tabs } from 'components/Tabs';
import { constants, formatUrlImage, normalizeSchema } from 'utils';
import { DEFAULT_PICTURE, IProfile } from 'utils/normalizeSchema';
import { useWindowSize } from 'hooks';
import { GeneralContext } from 'context';

export interface IProps {
  query: {
    tab?: number;
    skill?: string;
  };
}

interface ICard {
  salaryRange: string;
  href?: string;
  title?: string;
  picture?: string;
  reputation?: string | number;
  countFollowers?: number;
  countFollowing?: number;
  metadata?: IProfile;
}

interface IInformation {
  cards: ICard[];
  skills: string[];
}

export const initialSearchTypes = [
  {
    text: 'Services',
    value: 'services',
    orbisTag: 'krebit-service'
  },
  {
    text: 'Profiles',
    value: 'profiles'
  },
  {
    text: 'Jobs',
    value: 'jobs',
    orbisTag: 'krebit-job'
  }
];
const initialFilterValues = {
  skill: '',
  krbs: [1, 222],
  value: ''
};
const DEFAULT_SLICE_SKILLS = 5;
// TODO: This is not a real pagination, we need to find a way to optimize this better
const DEFAULT_LIST_PAGINATION = 50;
const DEFAULT_CURRENT_PAGE = 1;

const { NEXT_PUBLIC_ARENA_TOKEN } = process.env;

export const Explorer = (props: IProps) => {
  const { query } = props;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({
    ...initialFilterValues,
    skill: query?.skill ? query?.skill : ''
  });
  const [status, setStatus] = useState('idle');
  const [information, setInformation] = useState<IInformation>();
  const [searchType, setSearchType] = useState(
    initialSearchTypes[query?.tab || 0].value
  );
  const [tab, setTab] = useState(query?.tab || 0);
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
  const [total, setTotal] = useState(0);
  const [shouldViewMoreSkills, setShouldViewMoreSkills] = useState(false);
  const {
    walletInformation: { publicPassport, orbis, address }
  } = useContext(GeneralContext);
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
        skip = 0,
        page = currentPage,
        type = searchType
      ) => searchInformation(values, first, skip, page, type),
      500
    ),
    [publicPassport, orbis]
  );

  useEffect(() => {
    if (!publicPassport) return;
    if (!orbis) return;

    logCustomEvent(NEXT_PUBLIC_ARENA_TOKEN, address, 'Explore');

    delayedInformation(
      filterValues,
      DEFAULT_LIST_PAGINATION * currentPage,
      currentPage === DEFAULT_CURRENT_PAGE
        ? 0
        : DEFAULT_LIST_PAGINATION * (currentPage - DEFAULT_CURRENT_PAGE),
      currentPage,
      searchType
    );

    return delayedInformation.cancel;
  }, [publicPassport, orbis, currentPage]);

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
    skip = 0,
    page = DEFAULT_CURRENT_PAGE,
    type = searchType
  ) => {
    try {
      setStatus('pending');

      if (first === DEFAULT_LIST_PAGINATION) {
        setInformation({
          cards: [],
          skills: []
        });
        setCurrentPage(DEFAULT_CURRENT_PAGE);
      }

      if (type === 'profiles') {
        const totalAccounts = await Krebit.lib.graph.totalAccountsQuery({
          first: 1000
        });
        setTotal(totalAccounts);

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

        const cards = await Promise.all(
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
              href: `/${profile.did}`,
              title: profile.name,
              picture: profile.picture,
              reputation: profile.reputation,
              countFollowers: profile.countFollowers,
              countFollowing: profile.countFollowing,
              skills: skills || []
            };
          })
        )
          .then(cards => cards.filter(card => card !== undefined))
          .then(cards => cards.sort((a, b) => b.reputation - a.reputation));

        const skills = cards.flatMap(card => card.skills);

        setInformation(prevValues =>
          page === DEFAULT_CURRENT_PAGE
            ? { cards, skills }
            : {
                cards: [...(prevValues?.cards || []), ...cards].sort(
                  (a, b) => b.reputation - a.reputation
                ),
                skills: [...(prevValues?.skills || []), ...skills]
              }
        );
      } else {
        const currentSearchType = initialSearchTypes.find(
          values => type === values.value
        );

        if (!currentSearchType?.orbisTag) return;

        const filterTag = values?.skill?.includes(currentSearchType.orbisTag)
          ? values?.skill
          : values?.skill
          ? `${currentSearchType.orbisTag}:${values.skill}`
          : values?.value
          ? `${currentSearchType.orbisTag}:${values.value
              ?.toLowerCase()
              ?.trim()
              ?.replace(/[^a-z0-9. ]/g, '')
              ?.replace(/\s+/g, '-')}`
          : currentSearchType.orbisTag;

        const { data, error } = await orbis.getPosts(
          {
            tag: filterTag
          },
          page - 1
        );

        const cards = await Promise.all(
          data?.map(async values => {
            if (!values) return undefined;

            const reputation = await Krebit.lib.graph.erc20BalanceQuery(
              values?.creator_details?.metadata?.address
            );

            const profile = {
              href: `/posts?post_id=${values?.stream_id}`,
              title: values?.content?.data?.title,
              description: values?.content?.data?.description,
              salaryRange: values?.content?.data?.salaryRange,
              picture:
                values?.content?.data?.imageUrl ||
                values?.creator_details?.profile?.pfp ||
                DEFAULT_PICTURE,
              reputation: reputation?.value || 0,
              metadata: {
                picture:
                  values?.creator_details?.profile?.pfp || DEFAULT_PICTURE,
                name:
                  values?.creator_details?.profile?.username ||
                  values?.creator_details?.metadata?.address
              }
            };

            const skills = values?.content?.tags
              ?.map(tag => tag.slug)
              .filter(tag => tag !== currentSearchType.orbisTag);

            return {
              ...profile,
              skills: skills || []
            };
          })
        )
          .then(cards => cards.filter(card => card !== undefined))
          .then(cards =>
            /* TODO: This filter can alter the final result, this is just a local filter based on the data fetched, we should find a way to filter based on the data saved in orbis */
            cards.filter(
              card =>
                card.reputation >= values.krbs[0] &&
                card.reputation <= values.krbs[1]
            )
          );

        const skills = cards.flatMap(profile => profile.skills);

        setInformation(prevValues =>
          page === DEFAULT_CURRENT_PAGE
            ? { cards, skills }
            : {
                cards: [...(prevValues?.cards || []), ...cards],
                skills: [...(prevValues?.skills || []), ...skills]
              }
        );

        // TODO: In orbis, there's no method to get the total of posts
        setTotal(cards.length);

        if (error) {
          setStatus('rejected_posts');
          console.error('postsError', error);
          return;
        }
      }

      setStatus('resolved');
    } catch (error) {
      console.error(error);
      setStatus('rejected');
    }
  };

  const handleSearch = async () => {
    handleFilterOpen();
    await searchInformation(
      filterValues,
      DEFAULT_LIST_PAGINATION,
      0,
      DEFAULT_CURRENT_PAGE,
      searchType
    );
  };

  const handleTab = async (_, value: number) => {
    setTab(value);
    setSearchType(initialSearchTypes[value].value);
    await searchInformation(
      filterValues,
      DEFAULT_LIST_PAGINATION,
      0,
      DEFAULT_CURRENT_PAGE,
      initialSearchTypes[value].value
    );
  };

  const handleSearchPopularSkill = async (value: string) => {
    let values = {
      ...filterValues,
      skill: value
    };

    setFilterValues(prevValues => ({
      ...prevValues,
      skill: value
    }));
    await searchInformation(
      values,
      DEFAULT_LIST_PAGINATION,
      0,
      DEFAULT_CURRENT_PAGE,
      searchType
    );
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
                        <ItemBox
                          key={index}
                          isActive={filterValues.skill === item[0]}
                          onClick={() => handleSkillValue(item[0])}
                        >
                          <p className="item-text-box">
                            {item[0]
                              ?.replace('krebit-job:', '')
                              ?.replace('krebit-service:', '')}{' '}
                            {parseInt(item[1]) === 1 ? '' : '(' + item[1] + ')'}
                          </p>
                        </ItemBox>
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
              <p className="filter-menu-slider-text">Krebits Reputation</p>
              <div className="filter-menu-component">
                <Slider
                  ariaLabel="Reputation"
                  name="krbs"
                  value={filterValues.krbs}
                  onChange={handleFilterValues}
                />
              </div>
              <div className="filter-menu-slider-bottom">
                <p className="filter-menu-slider-bottom-text">
                  {filterValues.krbs[0]} Krebits
                </p>
                <p className="filter-menu-slider-bottom-text">
                  {filterValues.krbs[1]} Krebits
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
              Explore the Krebited Community{' '}
              <span className="explorer-header-span">
                {information?.cards?.length || 0} results of {total}
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
              placeholder="Explore the community"
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
          {constants.DEFAULT_SKILL_TAGS.length > 0 && (
            <div className="explorer-suggestions-container">
              <div className="explorer-suggestions">
                {constants.DEFAULT_SKILL_TAGS.map((tag, index) => (
                  <ItemBox
                    isActive={
                      filterValues.skill
                        ?.replace('krebit-job:', '')
                        ?.replace('krebit-service:', '') === tag.value
                    }
                    onClick={
                      isLoading
                        ? undefined
                        : () => handleSearchPopularSkill(tag.value)
                    }
                    key={index}
                  >
                    <p className="item-text-box">{tag.text}</p>
                  </ItemBox>
                ))}
              </div>
            </div>
          )}
          <div className="explore-tabs">
            <Tabs
              tabs={initialSearchTypes}
              value={tab}
              onChange={handleTab}
              isDisabled={isLoading}
            />
          </div>
          {information?.cards?.length === 0 && !isLoading ? (
            <p className="explore-card-not-found">No profiles found</p>
          ) : information?.cards?.length > 0 ? (
            <div
              className={
                searchType === 'profiles'
                  ? 'explorer-cards'
                  : 'explorer-cards-services'
              }
            >
              {searchType === 'profiles'
                ? information?.cards.map((card, index) => (
                    <Link href={card.href} key={index}>
                      <ProfileCard
                        href={card.href}
                        picture={formatUrlImage(card.picture)}
                        key={index}
                      >
                        <div className="explorer-card-picture"></div>
                        <p className="explorer-card-title">{card.title}</p>
                        <p className="explorer-card-description">
                          {card.reputation} Krebits
                        </p>
                        <div className="explorer-card-followers">
                          <span className="explorer-card-follow">
                            {card.countFollowers >= 100
                              ? '+99'
                              : card.countFollowers}{' '}
                            <span className="explorer-card-follow-text">
                              Followers
                            </span>
                          </span>
                          <span className="explorer-card-follow-dot"></span>
                          <span className="explorer-card-follow">
                            {card.countFollowing >= 100
                              ? '+99'
                              : card.countFollowing}{' '}
                            <span className="explorer-card-follow-text">
                              Following
                            </span>
                          </span>
                        </div>
                        <div className="explorer-card-button">
                          <Button
                            text="View profile"
                            styleType="border"
                            borderBackgroundColor="ebonyClay"
                            onClick={() => {}}
                          />
                        </div>
                      </ProfileCard>
                    </Link>
                  ))
                : information?.cards.map((card, index) => (
                    <Link href={card.href} key={index}>
                      <ServiceCard
                        href={card.href}
                        picture={formatUrlImage(card.picture)}
                        profilePicture={formatUrlImage(card.metadata?.picture)}
                        key={index}
                      >
                        <div className="explore-service-picture"></div>
                        <div className="explore-service-content">
                          <div className="explore-service-profile">
                            <div className="explore-service-profile-picture"></div>
                            <p className="explore-service-profile-text">
                              {card.metadata?.name}
                            </p>
                            {card.reputation && (
                              <span className="explore-service-profile-text-reputation">
                                {card.reputation} Krebits
                              </span>
                            )}
                          </div>
                          <p className="explore-service-description">
                            {card.title}
                          </p>
                          <p className="explore-service-description">
                            $ {card.salaryRange} MATIC
                          </p>
                        </div>
                        <div className="explorer-card-button">
                          <Button
                            text="View more"
                            styleType="border"
                            borderBackgroundColor="ebonyClay"
                            onClick={() => {}}
                          />
                        </div>
                      </ServiceCard>
                    </Link>
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
          {information?.cards?.length >=
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
