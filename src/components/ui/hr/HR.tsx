import { ClassName } from '@/types/GlobalType';
import * as S from './HR.Style';

type HRProps = {
  color?: string;
  height?: number;
  borderStyle?:
    | 'none'
    | 'hidden'
    | 'dotted'
    | 'dashed'
    | 'solid'
    | 'double'
    | 'groove'
    | 'ridge'
    | 'inset'
    | 'outset';
};
const HR: React.FC<ClassName & HRProps> = ({
  className = '',
  color = '#898f97',
  height = 1,
  borderStyle = 'solid',
}) => {
  return (
    <S.StyledHR
      className={className}
      $color={color}
      $height={height}
      $borderStyle={borderStyle}
    />
  );
};

export default HR;
