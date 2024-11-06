import * as S from './HorizontalSelect.Style';
import Spinner from '../../spinner/Spinner';
import {
  ProductDirection,
  ProductField,
  ProductFilter,
} from '@/services/productService';

type HorizontalSelectProps = {
  title: string;
  type: 'category' | 'field' | 'direction';
  options: { name: string; value: string }[];
  getter: ProductFilter;
  setter: React.Dispatch<React.SetStateAction<ProductFilter>>;
  disabled: boolean;
};
const HorizontalSelect: React.FC<HorizontalSelectProps> = ({
  title,
  type,
  options,
  getter,
  setter,
  disabled,
}) => {
  return (
    <S.Container>
      <S.Title>{title}</S.Title>
      {options.length ? (
        options.map((option) => (
          <S.OptionButton
            key={`filter_${type}_${option.name}`}
            className={getter[type] === option.value ? 'active' : ''}
            disabled={getter[type] === option.value || disabled}
            onClick={() => {
              if (type === 'category') {
                setter({
                  category: option.value,
                  field: 'createdAt',
                  direction: 'desc',
                });
              } else if (type === 'field') {
                setter({
                  ...getter,
                  field: option.value as ProductField,
                  direction: 'desc',
                });
              } else {
                setter({
                  ...getter,
                  direction: option.value as ProductDirection,
                });
              }
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
