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
};
const VerticalSelectContext = createContext<VerticalSelectContextProps>({
  isListOpen: false,
  setIsListOpen: () => {},
});

const VerticalSelectTitle = ({ children }: Children) => {
  return <S.Title>{children}</S.Title>;
};

const VerticalSelectOptionList = ({
  children,
  handleChangeOption,
}: Children & { handleChangeOption: (value: any) => void }) => {
  const { isListOpen } = useContext(VerticalSelectContext);
  return (
    isListOpen && (
      <S.OptionList className='hideScrollbar'>
        {ReactChildren.map(children, (child) =>
          cloneElement(child as ReactElement, { handleChangeOption }),
        )}
      </S.OptionList>
    )
  );
};

const VerticalSelectOptionItem = ({
  value,
  text,
  handleChangeOption = () => {},
  isActive = false,
}: {
  value: any;
  text: string;
  handleChangeOption?: (value: any) => void;
  isActive?: boolean;
}) => {
  const { setIsListOpen } = useContext(VerticalSelectContext);
  return (
    <S.OptionItem
      className={`hideTextOverflow${isActive ? ' active' : ''}`}
      title={text}
      onClick={() => {
        if (!isActive) handleChangeOption(value);
        setIsListOpen(false);
      }}
    >
      {text}
    </S.OptionItem>
  );
};

const VerticalSelectState = ({
  state,
  useSearch = false,
}: {
  state: any;
  useSearch?: boolean;
}) => {
  const { isListOpen, setIsListOpen } = useContext(VerticalSelectContext);
  return (
    <S.StateP
      className='hideTextOverflow'
      title={state}
      onClick={() => setIsListOpen((s) => !s)}
    >
      <span>{state || '선택해주세요'}</span>
      <MdOutlineExpandMore size={20} className={isListOpen ? 'flip' : ''} />
    </S.StateP>
  );
};

const VerticalSelectWrapper = ({ children }: Children) => {
  const [isListOpen, setIsListOpen] = useState<boolean>(false);

  return (
    <VerticalSelectContext.Provider value={{ isListOpen, setIsListOpen }}>
      <S.SelectContainer
        tabIndex={0}
        onBlur={() => {
          setIsListOpen(false);
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
