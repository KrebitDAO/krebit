import { useCallback, useState } from 'react';

import { SimpleCardWrapper } from './styles';
import { Krebit, MoreVert } from 'components/Icons';
import { InlineDropdown } from 'components/InlineDropdown';
import { ToolTip } from 'components/ToolTip';

interface IProps {
  type: 'simple' | 'small' | 'medium' | 'large';
  id: string;
  icon: JSX.Element;
  title: string;
  description: string;
  dates: {
    [key: string]: {
      text: string;
      value: string;
    };
  };
  dropdown: {
    isDropdownOpen: string;
    onClick: (id: string) => void;
    onClose: () => void;
    items: {
      title: string;
      onClick: () => void;
    }[];
  };
  shouldShowMoreVert?: boolean;
  isIssued?: boolean;
  tooltip?: {
    message: string;
  };
}

export const Card = (props: IProps) => {
  const {
    type,
    id,
    icon,
    title,
    description,
    dates,
    dropdown,
    shouldShowMoreVert = true,
    isIssued = false,
    tooltip
  } = props;
  const [currentToolTipActive, setCurrentToolTipActive] = useState<
    string | undefined
  >(undefined);

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
      <SimpleCardWrapper id={id} shouldShowMoreVert={shouldShowMoreVert}>
        <div className="card-icon">{icon}</div>
        <div className="card-item-texts">
          <p className="card-item-title">{title}</p>
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
        <div className="card-item-content">
          <div
            className={`card-icon card-item-icon ${
              isIssued ? 'card-item-icon-is-active' : ''
            }`}
            onMouseOver={() => handleCurrentToolTipActiveCallback(id)}
            onMouseOut={handleCurrentToolTipHideActiveCallback}
          >
            <Krebit />
          </div>
          {shouldShowMoreVert && (
            <div
              className="card-more-vert"
              onClick={() => dropdown.onClick(id)}
            >
              <MoreVert />
            </div>
          )}
          {dropdown.isDropdownOpen === id && (
            <div className="card-more-vert-inline-dropdown">
              <InlineDropdown
                items={dropdown.items}
                onClose={dropdown.onClose}
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

  return null;
};
