import { ClassName } from '@/types/GlobalType';
import * as S from './Checkbox.Style';
import { InputHTMLAttributes } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

type CheckboxProps = ClassName &
  InputHTMLAttributes<HTMLInputElement> & {
    description?: string;
    reactHookForm?: UseFormRegisterReturn<string>;
  };

const Checkbox: React.FC<CheckboxProps> = ({
  id = '',
  name = '',
  description = '',
  className = '',
  onChange = () => {},
  reactHookForm,
}) => {
  return (
    <S.CheckboxContainer className={className}>
      <S.CheckboxDiv>
        <input
          id={id}
          name={name}
          type='checkbox'
          onChange={onChange}
          {...reactHookForm}
        />
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
