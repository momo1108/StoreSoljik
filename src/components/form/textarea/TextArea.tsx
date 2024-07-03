import { ClassName } from '@/types/GlobalType';
import * as S from './TextArea.Style';
import { UseFormRegisterReturn } from 'react-hook-form';
import { InputHTMLAttributes } from 'react';

type TextAreaProps = ClassName &
  InputHTMLAttributes<HTMLInputElement> & {
    isTitleVisible?: boolean;
    description?: string;
    reactHookForm?: UseFormRegisterReturn<string>;
  };

const TextArea: React.FC<TextAreaProps> = ({
  title = 'title',
  isTitleVisible = true,
  description = '',
  placeholder = '',
  className = '',
  reactHookForm,
  'aria-errormessage': errorMessage,
}) => {
  return (
    <S.InputContainer className={className}>
      <p
        className='title'
        style={{ visibility: isTitleVisible ? 'visible' : 'hidden' }}
      >
        {title}
      </p>
      <textarea
        placeholder={placeholder ? placeholder : `${title}을 입력하세요`}
        {...reactHookForm}
        data-invalid={!!errorMessage}
      />
      {description ? <p className='description'>{description}</p> : <></>}
      {errorMessage ? <p className='errorMessage'>{errorMessage}</p> : <></>}
    </S.InputContainer>
  );
};

export default TextArea;
