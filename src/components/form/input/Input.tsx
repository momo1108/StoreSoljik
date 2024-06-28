import { ClassName } from '@/types/GlobalType';
import * as S from './Input.Style';

type InputProps = ClassName & {
  title?: string;
  isTitleVisible?: boolean;
  inputType?: 'text' | 'number' | 'password';
  /**
   * styled-component 로 스타일 오버라이딩 하기위한 클래스네임 지정
   * https://styled-components.com/docs/advanced#styling-normal-react-components
   */
};

const Input: React.FC<InputProps> = ({
  title = 'title',
  isTitleVisible = true,
  inputType = 'text',
  className = '',
}) => {
  return (
    <S.InputContainer className={className}>
      <p style={{ visibility: isTitleVisible ? 'visible' : 'hidden' }}>
        {title}
      </p>
      <input type={inputType} placeholder={`${title}을 입력하세요`} />
    </S.InputContainer>
  );
};

export default Input;
