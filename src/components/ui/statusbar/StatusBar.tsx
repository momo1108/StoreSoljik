import { Children, ClassName } from '@/types/GlobalType';
import * as S from './StatusBar.Style';

type StatusProps = Children & {
  isActive?: boolean;
  statusType?: 'normal' | 'danger';
};

const Status = ({
  children,
  isActive = false,
  statusType = 'normal',
}: StatusProps) => {
  return (
    <S.StatusSpan $isActive={isActive} $statusType={statusType}>
      {children}
    </S.StatusSpan>
  );
};

type BoundaryProps = {
  boundaryType?: 'line' | 'bracket';
};

const Boundary = ({ boundaryType = 'line' }: BoundaryProps) => {
  return boundaryType == 'line' ? (
    <svg viewBox='0 0 3 20' width='3' height='20'>
      <path d='M1.5,0 1.5,20' strokeDasharray='2 1' />
    </svg>
  ) : (
    <svg viewBox='0 0 10 20' width='10' height='20'>
      <path d='M0,0 10,10 0,20' fill='none' />
    </svg>
  );
};

type StatusBarProps = ClassName & Children;

const StatusBarWrapper: React.FC<StatusBarProps> = ({
  children,
  className = '',
}) => {
  return (
    <S.StatusBarWrapper className={className}>{children}</S.StatusBarWrapper>
  );
};

const StatusBar = Object.assign(StatusBarWrapper, {
  Status,
  Boundary,
});

export default StatusBar;
