import { ClassName } from '@/types/GlobalType';
import * as S from './Spinner.Style';
import { ReactNode } from 'react';

export type SpinnerProps = ClassName & {
  children?: ReactNode;
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
