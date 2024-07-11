import { H2, H4 } from '@/components/ui/header/Header.Style';
import * as S from './NotFound.Style';
import { TbBarrierBlockFilled } from 'react-icons/tb';
import Button from '@/components/ui/button/Button';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <S.NotFoundContainer>
      <TbBarrierBlockFilled size={150} />
      <H2>404 Not Found.</H2>
      <H4>현재 조회하신 페이지는 존재하지 않는 페이지입니다.</H4>
      <Link to={'..'}>
        <Button styleType='primary'>돌아가기</Button>
      </Link>
    </S.NotFoundContainer>
  );
};

export default NotFound;
