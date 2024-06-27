import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import * as S from './Button.Style';

const signout = () => {
  signOut(auth);
};

const Button: React.FC<S.ButtonProps> = ({
  $isSignedIn = false,
  $showPreIcon = false,
  $showPostIcon = false,
}) => {
  const navigate = useNavigate();

  return (
    <S.StyledButton
      {...{ $isSignedIn, $showPreIcon, $showPostIcon }}
      onClick={
        $isSignedIn
          ? () => signout
          : () => {
              navigate('/signin');
            }
      }
    >
      {$isSignedIn ? '로그아웃' : '로그인'}
    </S.StyledButton>
  );
};

export default Button;
