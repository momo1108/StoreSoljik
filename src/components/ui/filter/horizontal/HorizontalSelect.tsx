import * as S from './HorizontalSelect.Style';
import Spinner from '../../spinner/Spinner';
import { isEqual } from '@/utils/utils';

type HorizontalSelectProps = {
  options: { name: string; value: unknown }[];
  state: unknown;
  handleChangeOption: React.Dispatch<React.SetStateAction<any>>;
  disabled?: boolean;
};
const HorizontalSelect: React.FC<HorizontalSelectProps> = ({
  options,
  state,
  handleChangeOption,
  disabled = false,
}) => {
  return (
    <S.Container>
      {options.length ? (
        options.map((option) => (
          <S.OptionButton
            key={`filter_${option.name}`}
            className={state === option.value ? 'active' : ''}
            disabled={isEqual(state, option.value) || disabled}
            onClick={() => {
              handleChangeOption(option);
            }}
          >
            {option.name}
          </S.OptionButton>
        ))
      ) : (
        <>
          <S.OptionButton className='active' disabled>
            전체
          </S.OptionButton>
          <Spinner spinnerSize={20}>
            세부 카테고리 정보를 불러오는 중입니다...
          </Spinner>
        </>
      )}
    </S.Container>
  );
};

export default HorizontalSelect;
