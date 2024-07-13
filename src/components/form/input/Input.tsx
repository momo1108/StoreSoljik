import { ClassName } from '@/types/GlobalType';
import * as S from './Input.Style';
import { UseFormRegisterReturn } from 'react-hook-form';
import { InputHTMLAttributes } from 'react';

type InputProps = ClassName &
  InputHTMLAttributes<HTMLInputElement> & {
    titleVisibility?: 'visible' | 'invisible' | 'hidden';
    description?: string;
    reactHookForm?: UseFormRegisterReturn<string>;
  };

const Input: React.FC<InputProps> = ({
  title = 'title',
  titleVisibility = 'visible',
  description = '',
  type = 'text',
  placeholder = '',
  autoComplete = 'on',
  className = '',
  reactHookForm,
  'aria-errormessage': errorMessage,
}) => {
  return (
    <S.InputContainer className={className}>
      <p
        className='title'
        style={
          titleVisibility === 'hidden'
            ? { display: 'none' }
            : {
                visibility:
                  titleVisibility === 'visible' ? 'visible' : 'hidden',
              }
        }
      >
        {title}
      </p>
      <input
        type={type}
        placeholder={placeholder ? placeholder : `${title}을 입력하세요`}
        autoComplete={autoComplete}
        {...reactHookForm}
        data-invalid={!!errorMessage}
      />
      {description ? <p className='description'>{description}</p> : <></>}
      {errorMessage ? <p className='errorMessage'>{errorMessage}</p> : <></>}
    </S.InputContainer>
  );
};

export default Input;
