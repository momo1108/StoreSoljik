import { createPortal } from 'react-dom';
import * as S from './Modal.Style';
import { Children } from '@/types/GlobalType';
import { useModal } from '@/hooks/useModal';

const Modal = ({ children }: Children) => {
  const { closeModal } = useModal();

  return createPortal(
    <S.ModalWrapper onClick={() => closeModal()}>
      <S.ModalContainer
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {children}
      </S.ModalContainer>
    </S.ModalWrapper>,
    document.body,
  );
};

export default Modal;
