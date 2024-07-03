import { ClassName } from '@/types/GlobalType';
import * as S from './VerticalRadio.Style';
import { InputHTMLAttributes } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

type RadioOptions = {
  value: string;
  label: string;
};

type VerticalRadioProps = ClassName &
  InputHTMLAttributes<HTMLInputElement> & {
    options?: RadioOptions[];
    name: string; // 필수 입력으로 받기 위해 일부로 InputHTMLAttributes 외부에 설정
    reactHookForm?: UseFormRegisterReturn<string>;
  };

const VerticalRadio: React.FC<VerticalRadioProps> = ({
  options = [],
  name,
  className = '',
  reactHookForm,
  'aria-errormessage': errorMessage,
}) => {
  return (
    <S.RadioContainer className={className}>
      <S.OptionsContainer>
        {options.map((o, i) => (
          <div className='radioWrapper' key={`divFor${o.value}`}>
            <input
              type='radio'
              value={o.value}
              {...reactHookForm}
              name={name}
              id={`${name}${i}`}
            />
            <label htmlFor={`${name}${i}`}>{o.label}</label>
          </div>
        ))}
      </S.OptionsContainer>
      {errorMessage ? <p className='errorMessage'>{errorMessage}</p> : <></>}
    </S.RadioContainer>
  );
};

export default VerticalRadio;
