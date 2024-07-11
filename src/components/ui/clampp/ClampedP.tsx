import { Children, ClassName } from '@/types/GlobalType';
import * as S from './ClampedP.Style';

export type ClampedPProps = ClassName &
  Children & {
    className?: string;
    lineLimit?: number;
  };

const ClampedP: React.FC<ClampedPProps> = ({
  className = '',
  lineLimit = 4,
  children,
}) => {
  return (
    <S.StyledClampedP className={className} $lineLimit={lineLimit}>
      {children}
    </S.StyledClampedP>
  );
};

export default ClampedP;
