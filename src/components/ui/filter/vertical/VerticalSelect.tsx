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

type VerticalSelectContextProps = {
  isListOpen: boolean;
  setIsListOpen: React.Dispatch<React.SetStateAction<boolean>>;
  preventBlur: boolean;
  setPreventBlur: React.Dispatch<React.SetStateAction<boolean>>;
  searchKeyword: string;
  setSearchKeyword: React.Dispatch<React.SetStateAction<string>>;
};
const VerticalSelectContext = createContext<VerticalSelectContextProps>({
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
  handleChangeOption,
  state,
}: Children & { handleChangeOption: (value: any) => void; state: any }) => {
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
  const { setIsListOpen, searchKeyword, setSearchKeyword } = useContext(
    VerticalSelectContext,
  );
  const isActive = value === state || Object.is(value, state);
  const isValidItem = searchKeyword ? text.includes(searchKeyword) : true;

  return (
    <S.OptionItem
      className={`hideTextOverflow${isActive ? ' active' : ''}${!isValidItem ? ' hidden' : ''}`}
      title={text}
      onClick={() => {
        if (!isActive) {
          handleChangeOption(value);
          setSearchKeyword(text);
        }
        setIsListOpen(false);
      }}
    >
      {text}
    </S.OptionItem>
  );
};

const VerticalSelectState = ({
  title = '',
  useSearch = false,
}: {
  title?: string;
  width?: number;
  useSearch?: boolean;
}) => {
  const { isListOpen, setIsListOpen, searchKeyword, setSearchKeyword } =
    useContext(VerticalSelectContext);

  return useSearch ? (
    <S.StateInput
      placeholder='검색'
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
      title={title}
      onClick={() => setIsListOpen((s) => !s)}
    >
      <span>{title || '선택해주세요'}</span>
      <MdOutlineExpandMore size={20} className={isListOpen ? 'flip' : ''} />
    </S.StateP>
  );
};

const VerticalSelectWrapper = ({
  children,
  width = 150,
}: Children & { width?: number }) => {
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
