import { ClassName } from '@/types/GlobalType';
import * as S from './Input.Style';
import { UseFormRegisterReturn } from 'react-hook-form';

type InputProps = ClassName & {
  title?: string;
  isTitleVisible?: boolean;
  description?: string;
  inputType?: 'email' | 'text' | 'number' | 'password';
  autoComplete?: 'on' | 'off';
  placeholder?: string;
  reactHookForm?: UseFormRegisterReturn<string>;
  /**
   * styled-component 로 스타일 오버라이딩 하기위한 클래스네임 지정
   * https://styled-components.com/docs/advanced#styling-normal-react-components
   */
};

const Input: React.FC<InputProps> = ({
  title = 'title',
  isTitleVisible = true,
  description = '',
  inputType = 'text',
  autoComplete = 'on',
  placeholder = '',
  className = '',
  reactHookForm,
}) => {
  return (
    <S.InputContainer className={className}>
      <p
        className='title'
        style={{ visibility: isTitleVisible ? 'visible' : 'hidden' }}
      >
        {title}
      </p>
      <input
        type={inputType}
        autoComplete={autoComplete}
        placeholder={placeholder ? placeholder : `${title}을 입력하세요`}
        {...reactHookForm}
      />
      {description ? <p className='description'>{description}</p> : <></>}
    </S.InputContainer>
  );
};

export default Input;
