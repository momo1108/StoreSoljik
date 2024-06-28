import * as S from './Button.Style';

const Button: React.FC<S.ButtonProps> = ({
  onClick = () => {},
  children = '',
  type = 'button',
  disabled = false,
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
