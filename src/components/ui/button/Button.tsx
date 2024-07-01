import { ClassName } from '@/types/GlobalType';
import * as S from './Button.Style';
import { ButtonHTMLAttributes } from 'react';

export type ButtonProps = ClassName &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    onClick?: () => void;
    children?: React.ReactNode;
    /**
     * Override 한 컴포넌트에서 $styleType props 를 사용할 경우 전달이 안되는 이슈 발생...
     * 일단 임시방편으로 styleType 으로 전달하니 되긴했음.
     */
    styleType?: 'normal' | 'primary';
    $styleType?: 'normal' | 'primary';
  };

const Button: React.FC<ButtonProps> = ({
  onClick = () => {},
  disabled = false,
  children = '',
  type = 'button',
  className = '',
  styleType = 'normal',
}) => {
  return (
    <S.StyledButton
      {...{ onClick, type, disabled, className }}
      $styleType={styleType}
    >
      {children}
    </S.StyledButton>
  );
};

export default Button;
