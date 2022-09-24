import { CircularProgressWrapper, SkeletonWrapper } from './styles';

import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';

interface IProps {
  type?: string;
}

export const Loading = (props: IProps) => {
  const { type } = props;

  if (type === 'skeleton') {
    return (
      <SkeletonWrapper>
        <Skeleton />
      </SkeletonWrapper>
    );
  }

  return (
    <CircularProgressWrapper>
      <CircularProgress />
    </CircularProgressWrapper>
  );
};
