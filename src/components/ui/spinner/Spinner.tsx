import { Children, ClassName } from '@/types/GlobalType';
import * as S from './Spinner.Style';

export type SpinnerProps = ClassName &
  Children & {
    spinnerSize?: number;
  };

const Spinner: React.FC<SpinnerProps> = ({
  className = '',
  children = '',
  spinnerSize = 48,
}) => {
  return (
    <S.SpinnerBox className={className} $size={spinnerSize}>
      <S.SpinnerSpan $size={spinnerSize} />
      {children}
    </S.SpinnerBox>
  );
};

export default Spinner;
