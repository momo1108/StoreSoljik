import * as S from './Button.Style';

const Button: React.FC<S.ButtonProps> = ({
  onClick = () => {},
  children = '',
  type = 'normal',
  className = '',
}) => {
  return (
    <S.StyledButton {...{ onClick, type, className }}>
      {children}
    </S.StyledButton>
  );
};

export default Button;
