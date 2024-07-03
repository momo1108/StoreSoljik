import * as S from './Loading.Style';

const Loading: React.FC = () => {
  return (
    <S.LoadingContainer>
      <S.LoadingSpinner />
      <S.LoadingMessageP>페이지를 로딩중입니다</S.LoadingMessageP>
    </S.LoadingContainer>
  );
};

export default Loading;
