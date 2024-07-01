import { ClassName } from '@/types/GlobalType';
import * as S from './Checkbox.Style';
import { InputHTMLAttributes } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

type CheckboxProps = ClassName &
  InputHTMLAttributes<HTMLInputElement> & {
    id: string; // 필수 입력을 위해 따로 표기
    name: string; // 필수 입력을 위해 따로 표기
    description?: string;
    reactHookForm?: UseFormRegisterReturn<string>;
  };

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  name,
  description = '',
  className = '',
  reactHookForm,
}) => {
  return (
    <S.CheckboxContainer className={className}>
      <S.CheckboxDiv>
        <input id={id} name={name} type='checkbox' {...reactHookForm} />
        {description ? (
          <label className='description' htmlFor={id}>
            {description}
          </label>
        ) : (
          <></>
        )}
      </S.CheckboxDiv>
    </S.CheckboxContainer>
  );
};

export default Checkbox;
