import { ClassName } from '@/types/GlobalType';
import * as S from './ForwardedInput.Style';
import { forwardRef, InputHTMLAttributes } from 'react';

type ForwardedInputProps = ClassName &
  InputHTMLAttributes<HTMLInputElement> & {
    isTitleVisible?: boolean;
    description?: string;
    ref?: React.RefObject<HTMLInputElement>;
  };

const ForwardedInput = forwardRef<HTMLInputElement, ForwardedInputProps>(
  (
    {
      isTitleVisible = true,
      description = '',
      title = 'title',
      type = 'text',
      placeholder = '',
      autoComplete = 'on',
      className = '',
    },
    ref,
  ) => {
    return (
      <S.InputContainer className={className}>
        <p
          className='title'
          style={{ visibility: isTitleVisible ? 'visible' : 'hidden' }}
        >
          {title}
        </p>
        <input
          type={type}
          placeholder={placeholder ? placeholder : `${title}을 입력하세요`}
          autoComplete={autoComplete}
          ref={ref}
          min={1}
          max={200}
        />
        {description ? <p className='description'>{description}</p> : <></>}
      </S.InputContainer>
    );
  },
);

export default ForwardedInput;
