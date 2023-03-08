import { TooltipRenderProps } from 'react-joyride';

import { Wrapper } from './styles';
import { Close } from 'components/Icons';
import UsernameText from '../Username/index.text.json';

interface IProps extends TooltipRenderProps {
  locale: string;
}

export const HelpTooltip = (props: IProps) => {
  const {
    index,
    step,
    closeProps,
    primaryProps,
    tooltipProps,
    backProps,
    isLastStep,
    locale,
    size
  } = props;

  return (
    <Wrapper {...tooltipProps}>
      <div className="help-tooltip-header">
        <div className="help-tooltip-header-close" {...closeProps}>
          <Close />
        </div>
      </div>
      <p className="help-tooltip-title">{step?.title}</p>
      <p className="help-tooltip-content">{step?.content}</p>
      <div className="help-tooltip-footer">
        {index > 0 && !isLastStep ? (
          <button className="help-tooltip-button border" {...backProps}>
            {UsernameText[locale]['step-back']}
          </button>
        ) : null}
        {!isLastStep && (
          <button className="help-tooltip-button background" {...primaryProps}>
            ({index}/{size}) {UsernameText[locale]['step-next']}
          </button>
        )}
        {isLastStep && (
          <button className="help-tooltip-button background" {...closeProps}>
            {UsernameText[locale]['step-close']}
          </button>
        )}
      </div>
    </Wrapper>
  );
};
