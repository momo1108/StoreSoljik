import { ClassName } from '@/types/GlobalType';
import * as S from './ForwardedInput.Style';
import { forwardRef, InputHTMLAttributes } from 'react';

type ForwardedInputProps = ClassName &
  InputHTMLAttributes<HTMLInputElement> & {
    titleVisibility?: 'visible' | 'invisible' | 'hidden';
    description?: string;
    ref?: React.RefObject<HTMLInputElement>;
  };

const ForwardedInput = forwardRef<HTMLInputElement, ForwardedInputProps>(
  (
    {
      titleVisibility = 'visible',
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
