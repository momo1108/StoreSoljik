import * as S from './Main.Style';

type BodyProps = {
  children?: React.ReactNode;
};
const Body: React.FC<BodyProps> = ({ children = '' }) => {
  return <S.StyledMain>{children}</S.StyledMain>;
};

export default Body;
