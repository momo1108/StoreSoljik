import { ClassName } from '@/types/GlobalType';
import * as S from './HR.Style';

type HRProps = {
  color?: string;
  height?: number;
};
const HR: React.FC<ClassName & HRProps> = ({
  className = '',
  color = '#898f97',
  height = 1,
}) => {
  return <S.StyledHR className={className} $color={color} $height={height} />;
};

export default HR;
