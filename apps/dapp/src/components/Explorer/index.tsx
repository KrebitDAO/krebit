import { useEffect, useState } from 'react';

import { Card, FilterMenu, Wrapper } from './styles';
import { Close, Search, Tune } from 'components/Icons';
import { Slider } from 'components/Slider';
import { Button } from 'components/Button';
import { mergeArray } from 'utils';
import { useWindowSize } from 'hooks';

export const Explorer = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { width } = useWindowSize();
  const isDesktop = width >= 1024;

  useEffect(() => {
    if (isDesktop && !isFilterOpen) {
      setIsFilterOpen(true);
    }
  }, [isDesktop, isFilterOpen]);

  const handleFilterOpen = () => {
    if (isDesktop) return;

    setIsFilterOpen(prevState => !prevState);
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
            <div className="filter-menu-header-desktop-clear">
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
            <div className="filter-menu-clear">
              <div className="filter-menu-clear-icon">
                <Close />
              </div>
              <p className="filter-menu-clear-text">Clean filters</p>
            </div>
            <div className="filter-menu-skills">
              <p className="filter-menu-skills-text">Skills</p>
              <div className="filter-menu-skills-list">
                {mergeArray(['react', 'java', 'php']).map((item, index) => (
                  <div className="filter-menu-skills-item" key={index}>
                    <p className="filter-menu-skills-item-text">
                      {item[0]}{' '}
                      {parseInt(item[1]) === 1 ? '' : '(' + item[1] + ')'}
                    </p>
                  </div>
                ))}
              </div>
              <p className="filter-menu-skills-view-more">View more (50)</p>
            </div>
            <div className="filter-menu-slider">
              <p className="filter-menu-slider-text">kRB Quantity</p>
              <div className="filter-menu-slider-component">
                <Slider
                  ariaLabel="kRB Quantity"
                  value={[1, 100]}
                  onChange={() => {}}
                />
              </div>
              <div className="filter-menu-slider-bottom">
                <p className="filter-menu-slider-bottom-text">1 kRB</p>
                <p className="filter-menu-slider-bottom-text">1000 kRB</p>
              </div>
            </div>
            <div className="filter-menu-button">
              <Button
                text="Apply"
                onClick={() => {}}
                styleType="border"
                borderBackgroundColor="ebonyClay"
              />
            </div>
          </FilterMenu>
        </div>
        <div className="explorer-container">
          <div className="explorer-header">
            <p className="explorer-header-title">
              Profiles <span className="explorer-header-span">0 results</span>
            </p>
            <div className="explorer-header-icon" onClick={handleFilterOpen}>
              <Tune />
            </div>
          </div>
          <div className="explorer-searcher">
            <div className="explorer-searcher-icon">
              <Search />
            </div>
            <input placeholder="Search profile" />
            <div className="explorer-searcher-icon explorer-searcher-icon-white">
              <Close />
            </div>
          </div>
          <div className="explorer-cards">
            <Card picture={'/imgs/images/alerios.jpg'}>
              <div className="explorer-card-picture"></div>
              <p className="explorer-card-title">
                Andressdasdasdasdasdasdasdasdas.eth
              </p>
              <p className="explorer-card-description">rkRB 140</p>
              <div className="explorer-card-followers">
                <span className="explorer-card-follow">
                  +99{' '}
                  <span className="explorer-card-follow-text">Followers</span>
                </span>
                <span className="explorer-card-follow-dot"></span>
                <span className="explorer-card-follow">
                  +99{' '}
                  <span className="explorer-card-follow-text">Following</span>
                </span>
              </div>
              <div className="explorer-card-button">
                <Button
                  text="View profile"
                  onClick={() => {}}
                  styleType="border"
                  borderBackgroundColor="ebonyClay"
                />
              </div>
            </Card>
            <Card picture={'/imgs/images/alerios.jpg'}>
              <div className="explorer-card-picture"></div>
              <p className="explorer-card-title">Andres.eth</p>
              <p className="explorer-card-description">rkRB 140</p>
              <div className="explorer-card-followers">
                <span className="explorer-card-follow">
                  +99{' '}
                  <span className="explorer-card-follow-text">Followers</span>
                </span>
                <span className="explorer-card-follow-dot"></span>
                <span className="explorer-card-follow">
                  +99{' '}
                  <span className="explorer-card-follow-text">Following</span>
                </span>
              </div>
              <div className="explorer-card-button">
                <Button
                  text="View profile"
                  onClick={() => {}}
                  styleType="border"
                  borderBackgroundColor="ebonyClay"
                />
              </div>
            </Card>
            <Card picture={'/imgs/images/alerios.jpg'}>
              <div className="explorer-card-picture"></div>
              <p className="explorer-card-title">Andres.eth</p>
              <p className="explorer-card-description">rkRB 140</p>
              <div className="explorer-card-followers">
                <span className="explorer-card-follow">
                  +99{' '}
                  <span className="explorer-card-follow-text">Followers</span>
                </span>
                <span className="explorer-card-follow-dot"></span>
                <span className="explorer-card-follow">
                  +99{' '}
                  <span className="explorer-card-follow-text">Following</span>
                </span>
              </div>
              <div className="explorer-card-button">
                <Button
                  text="View profile"
                  onClick={() => {}}
                  styleType="border"
                  borderBackgroundColor="ebonyClay"
                />
              </div>
            </Card>
            <Card picture={'/imgs/images/alerios.jpg'}>
              <div className="explorer-card-picture"></div>
              <p className="explorer-card-title">Andres.eth</p>
              <p className="explorer-card-description">rkRB 140</p>
              <div className="explorer-card-followers">
                <span className="explorer-card-follow">
                  +99{' '}
                  <span className="explorer-card-follow-text">Followers</span>
                </span>
                <span className="explorer-card-follow-dot"></span>
                <span className="explorer-card-follow">
                  +99{' '}
                  <span className="explorer-card-follow-text">Following</span>
                </span>
              </div>
              <div className="explorer-card-button">
                <Button
                  text="View profile"
                  onClick={() => {}}
                  styleType="border"
                  borderBackgroundColor="ebonyClay"
                />
              </div>
            </Card>
          </div>
        </div>
      </Wrapper>
    </>
  );
};
