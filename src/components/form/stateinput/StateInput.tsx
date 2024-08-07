import { ClassName } from '@/types/GlobalType';
import * as S from './StateInput.Style';
import { InputHTMLAttributes } from 'react';

type StateInputProps = ClassName &
  InputHTMLAttributes<HTMLInputElement> & {
    titleVisibility?: 'visible' | 'invisible' | 'hidden';
    description?: string;
    attrs?: InputHTMLAttributes<HTMLInputElement>;
  };

const StateInput: React.FC<StateInputProps> = ({
  titleVisibility = 'visible',
  description = '',
  className = '',
  title = 'title',
  type = 'text',
  placeholder = '',
  autoComplete = 'on',
  onChange = () => {},
  attrs = {},
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
        onChange={onChange}
        {...attrs}
      />
      {description ? <p className='description'>{description}</p> : <></>}
    </S.InputContainer>
  );
};

export default StateInput;
