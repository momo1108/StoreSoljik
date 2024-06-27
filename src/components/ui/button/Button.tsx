import * as S from './Button.Style';

const Button: React.FC<S.ButtonProps> = ({
  $showPreIcon = false,
  $showPostIcon = false,
  onClick = () => {},
  children = '',
}) => {
  return (
    <S.StyledButton {...{ $showPreIcon, $showPostIcon, onClick }}>
      {children}
    </S.StyledButton>
  );
};

export default Button;
