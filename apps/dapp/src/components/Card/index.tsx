import { useCallback, useRef, useState } from 'react';

import { LongCardWrapper, SimpleCardWrapper, SmallCardWrapper } from './styles';
import { Krebit, MoreVert } from 'components/Icons';
import { InlineDropdown } from 'components/InlineDropdown';
import { ToolTip } from 'components/ToolTip';

interface IProps {
  type: 'simple' | 'small' | 'medium' | 'large' | 'long';
  id: string;
  title: string;
  description: string;
  dates: {
    [key: string]: {
      text: string;
      value: string;
    };
  };
  isEmpty?: boolean;
  dropdown?: {
    isDropdownOpen: string;
    onClick: (id: string) => void;
    onClose: () => void;
    items: {
      title: string;
      onClick: () => void;
    }[];
  };
  icon?: JSX.Element;
  image?: string;
  isIssued?: boolean;
  tooltip?: {
    message: string;
  };
}

export const Card = (props: IProps) => {
  const {
    type,
    id,
    title,
    description,
    dates,
    isEmpty,
    dropdown,
    icon,
    image,
    isIssued = false,
    tooltip
  } = props;
  const [currentToolTipActive, setCurrentToolTipActive] = useState<
    string | undefined
  >(undefined);
  const parentDropdownRef = useRef(undefined);

  const handleCurrentToolTipActive = (id: string) => {
    setCurrentToolTipActive(id);
  };
  const handleCurrentToolTipActiveCallback = useCallback(
    handleCurrentToolTipActive,
    [currentToolTipActive]
  );

  const handleCurrentToolTipHide = () => {
    setCurrentToolTipActive(undefined);
  };
  const handleCurrentToolTipHideActiveCallback = useCallback(
    handleCurrentToolTipHide,
    [currentToolTipActive]
  );

  if (type === 'simple') {
    return (
      <SimpleCardWrapper id={id} isEmpty={isEmpty}>
        <div className="card-item-content-left">
          <div className="card-item-content-title">
            <div className="card-icon">{icon}</div>
            <p className="card-item-title">{title}</p>
          </div>
          <p className="card-item-description">{description}</p>
          <div className="card-item-dates">
            {dates.issuanceDate && (
              <div className="card-item-date">
                <p className="card-item-date-title">
                  {dates.issuanceDate.text}
                </p>
                <p className="card-item-date-text">
                  {new Date(dates.issuanceDate.value).toLocaleDateString(
                    'en-US'
                  )}
                </p>
              </div>
            )}
            {dates.expirationDate && (
              <div className="card-item-date">
                <p className="card-item-date-title">
                  {dates.expirationDate.text}
                </p>
                <p className="card-item-date-text">
                  {new Date(dates.expirationDate.value).toLocaleDateString(
                    'en-US'
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="card-item-content-right">
          <div
            className={`card-icon card-item-icon ${
              isIssued ? 'card-item-icon-is-active' : ''
            }`}
            onMouseOver={() => handleCurrentToolTipActiveCallback(id)}
            onMouseOut={handleCurrentToolTipHideActiveCallback}
          >
            <Krebit />
          </div>
          {dropdown && (
            <div
              className="card-more-vert"
              ref={parentDropdownRef}
              onClick={() => dropdown?.onClick(id)}
            >
              <MoreVert />
            </div>
          )}
          {dropdown?.isDropdownOpen === id && (
            <div className="card-more-vert-inline-dropdown">
              <InlineDropdown
                items={dropdown?.items}
                parentRef={parentDropdownRef}
                onClose={dropdown?.onClose}
              />
            </div>
          )}
          {tooltip && currentToolTipActive === id ? (
            <div className="card-item-tooltip-box">
              <ToolTip message={tooltip.message} />
            </div>
          ) : null}
        </div>
      </SimpleCardWrapper>
    );
  }

  if (type === 'small') {
    return (
      <SmallCardWrapper id={id} image={image} isEmpty={isEmpty}>
        <div className="card-information">
          <p className="card-information-title">{title}</p>
          <p className="card-information-company">{description}</p>
        </div>
        <div className="card-top-icons">
          <div
            className={`card-top-icon ${
              isIssued ? 'card-top-icon-is-active' : ''
            }`}
            onMouseOver={() => handleCurrentToolTipActiveCallback(id)}
            onMouseOut={handleCurrentToolTipHideActiveCallback}
          >
            <Krebit />
          </div>
          {dropdown && (
            <div
              className="card-top-more-vert"
              ref={parentDropdownRef}
              onClick={() => dropdown?.onClick(id)}
            >
              <MoreVert />
            </div>
          )}
        </div>
        {dropdown?.isDropdownOpen === id && (
          <div className="card-more-vert-inline-dropdown">
            <InlineDropdown
              items={dropdown?.items}
              parentRef={parentDropdownRef}
              onClose={dropdown?.onClose}
            />
          </div>
        )}
        {tooltip && currentToolTipActive === id ? (
          <div className="card-tooltip-box">
            <ToolTip message={tooltip.message} />
          </div>
        ) : null}
        <div className="card-dates">
          {dates.issuanceDate && (
            <div className="card-date">
              <p className="card-date-title">{dates.issuanceDate.text}</p>
              <p className="card-date-text">
                {new Date(dates.issuanceDate.value).toLocaleDateString('en-US')}
              </p>
            </div>
          )}
          {dates.expirationDate && (
            <div className="card-date">
              <p className="card-date-title">{dates.expirationDate.text}</p>
              <p className="card-date-text">
                {new Date(dates.expirationDate.value).toLocaleDateString(
                  'en-US'
                )}
              </p>
            </div>
          )}
        </div>
        <div className="card-bottom-icon"></div>
      </SmallCardWrapper>
    );
  }

  if (type === 'long') {
    return (
      <LongCardWrapper image={image} isEmpty={isEmpty}>
        <div className="card-image-container">
          <div className="card-image"></div>
        </div>
        <div className="card-information">
          <p className="card-information-title">{title}</p>
          <p className="card-information-description">{description}</p>
          <div className="card-information-dates">
            {dates.issuanceDate && (
              <p className="card-information-date">
                {dates.issuanceDate.text}{' '}
                <span>
                  {new Date(dates.issuanceDate.value).toLocaleDateString(
                    'en-US'
                  )}
                </span>
              </p>
            )}
            {dates.expirationDate && (
              <p className="card-information-date">
                {dates.expirationDate.text}{' '}
                <span>
                  {new Date(dates.expirationDate.value).toLocaleDateString(
                    'en-US'
                  )}
                </span>
              </p>
            )}
          </div>
        </div>
        <div className="card-icons">
          <div
            className={`card-icon ${isIssued ? 'card-icon-is-active' : ''}`}
            onMouseOver={() => handleCurrentToolTipActiveCallback(id)}
            onMouseOut={handleCurrentToolTipHideActiveCallback}
          >
            <Krebit />
          </div>
          {dropdown && (
            <div
              className="card-more-vert"
              ref={parentDropdownRef}
              onClick={() => dropdown?.onClick(id)}
            >
              <MoreVert />
            </div>
          )}
        </div>
        {dropdown?.isDropdownOpen === id && (
          <div className="card-more-vert-inline-dropdown">
            <InlineDropdown
              items={dropdown?.items}
              parentRef={parentDropdownRef}
              onClose={dropdown?.onClose}
            />
          </div>
        )}
        {tooltip && currentToolTipActive === id ? (
          <div className="card-tooltip-box">
            <ToolTip message={tooltip.message} />
          </div>
        ) : null}
      </LongCardWrapper>
    );
  }

  return null;
};
