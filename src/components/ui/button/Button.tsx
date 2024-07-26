import { Children, ClassName } from '@/types/GlobalType';
import * as S from './Button.Style';
import { ButtonHTMLAttributes } from 'react';

export type ButtonProps = ClassName &
  Children &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    /**
     * Override 한 컴포넌트에서 $styleType props 를 사용할 경우 전달이 안되는 이슈 발생...
     * 일단 임시방편으로 styleType 으로 전달하니 되긴했음.
     */
    styleType?: 'normal' | 'primary' | 'disabled';
    attrs?: ButtonHTMLAttributes<HTMLButtonElement>;
  };

const Button: React.FC<ButtonProps> = ({
  onClick = () => {},
  disabled = false,
  children = '',
  type = 'button',
  className = '',
  styleType = 'normal',
  attrs = {},
}) => {
  return (
    <S.StyledButton
      {...{ onClick, type, disabled, className }}
      {...attrs}
      $styleType={styleType}
    >
      {children}
    </S.StyledButton>
  );
};

export default Button;
