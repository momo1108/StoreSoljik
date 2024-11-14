import {
  Children as ReactChildren,
  ReactElement,
  cloneElement,
  createContext,
  useContext,
  useState,
} from 'react';
import * as S from './VerticalSelect.Style';
import { Children } from '@/types/GlobalType';
import { MdOutlineExpandMore } from 'react-icons/md';
import { isEqual } from '@/utils/utils';

type VerticalSelectContextProps = {
  useSearch: boolean;
  isListOpen: boolean;
  setIsListOpen: React.Dispatch<React.SetStateAction<boolean>>;
  preventBlur: boolean;
  setPreventBlur: React.Dispatch<React.SetStateAction<boolean>>;
  searchKeyword: string;
  setSearchKeyword: React.Dispatch<React.SetStateAction<string>>;
};
const VerticalSelectContext = createContext<VerticalSelectContextProps>({
  useSearch: false,
  isListOpen: false,
  setIsListOpen: () => {},
  preventBlur: false,
  setPreventBlur: () => {},
  searchKeyword: '',
  setSearchKeyword: () => {},
});

const VerticalSelectTitle = ({ children }: Children) => {
  return <S.Title>{children}</S.Title>;
};

const VerticalSelectOptionList = ({
  children,
  handleChangeOption = () => {},
  state,
}: Children & { handleChangeOption?: (value: any) => void; state: any }) => {
  const { isListOpen, setPreventBlur } = useContext(VerticalSelectContext);
  return (
    isListOpen && (
      <S.OptionList
        className='hideScrollbar'
        onMouseEnter={() => setPreventBlur(true)}
        onMouseLeave={() => setPreventBlur(false)}
      >
        {ReactChildren.map(children, (child) =>
          cloneElement(child as ReactElement, { handleChangeOption, state }),
        )}
      </S.OptionList>
    )
  );
};

const VerticalSelectOptionItem = ({
  value,
  text,
  handleChangeOption = () => {},
  state,
}: {
  value: any;
  text: string;
  handleChangeOption?: (value: any) => void;
  state?: any;
}) => {
  const { useSearch, setIsListOpen, searchKeyword, setSearchKeyword } =
    useContext(VerticalSelectContext);
  const isActive = isEqual(state, value);
  const isValidItem = searchKeyword ? text.includes(searchKeyword) : true;

  // 검색 사용 - isValidItem 으로 필터링해야됨. 검색 미사용 - 필터링하면 안됨
  // null 인 경우 : 검색 사용 and isValidItem 이 false 인 경우만
  // JSX.Element : 1. 검색 사용 and isValidItem 이 true      2. 검색 미사용
  return useSearch && !isValidItem ? null : (
    <S.OptionItem
      className={`hideTextOverflow${isActive ? ' active' : ''}`}
      title={text}
      onClick={() => {
        if (!isActive) {
          handleChangeOption(value);
          if (useSearch) setSearchKeyword(text);
        }
        setIsListOpen(false);
      }}
    >
      {text}
    </S.OptionItem>
  );
};

const VerticalSelectState = ({
  placeholder = '검색',
}: {
  placeholder?: string;
}) => {
  const {
    useSearch,
    isListOpen,
    setIsListOpen,
    searchKeyword,
    setSearchKeyword,
  } = useContext(VerticalSelectContext);

  return useSearch ? (
    <S.StateInput
      placeholder={placeholder}
      type='text'
      value={searchKeyword}
      onFocus={() => {
        setIsListOpen(true);
      }}
      onChange={(e) => setSearchKeyword(e.target.value)}
    />
  ) : (
    <S.StateP
      className='hideTextOverflow'
      title={searchKeyword}
      onClick={() => setIsListOpen((s) => !s)}
    >
      <span>{searchKeyword || '선택하기'}</span>
      <MdOutlineExpandMore size={20} className={isListOpen ? 'flip' : ''} />
    </S.StateP>
  );
};

const VerticalSelectWrapper = ({
  children,
  width = 150,
  useSearch = false,
}: Children & { width?: number; useSearch?: boolean }) => {
  const [isListOpen, setIsListOpen] = useState<boolean>(false);
  const [preventBlur, setPreventBlur] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const value = {
    isListOpen,
    setIsListOpen,
    searchKeyword,
    setSearchKeyword,
    preventBlur,
    setPreventBlur,
    useSearch,
  };

  return (
    <VerticalSelectContext.Provider value={value}>
      <S.SelectContainer
        $width={width}
        tabIndex={0}
        onBlur={() => {
          if (!preventBlur) setIsListOpen(false);
        }}
      >
        {children}
      </S.SelectContainer>
    </VerticalSelectContext.Provider>
  );
};

const VerticalSelect = Object.assign(VerticalSelectWrapper, {
  Title: VerticalSelectTitle,
  OptionList: VerticalSelectOptionList,
  OptionItem: VerticalSelectOptionItem,
  State: VerticalSelectState,
});

export default VerticalSelect;
