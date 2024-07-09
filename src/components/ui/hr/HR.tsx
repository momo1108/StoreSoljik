import { ClassName } from '@/types/GlobalType';
import * as S from './HR.Style';

const HR: React.FC<ClassName> = ({ className = '' }) => {
  return <S.StyledHR className={className} />;
};

export default HR;
