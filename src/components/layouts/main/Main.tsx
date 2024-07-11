import { Children, ClassName } from '@/types/GlobalType';
import * as S from './Main.Style';

type MainProps = ClassName & Children;
const Main: React.FC<MainProps> = ({ className = '', children = '' }) => {
  return <S.StyledMain className={className}>{children}</S.StyledMain>;
};

export default Main;
