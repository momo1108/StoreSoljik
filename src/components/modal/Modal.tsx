import { createPortal } from 'react-dom';
import * as S from './Modal.Style';
import { Children } from '@/types/GlobalType';
import { useModal } from '@/hooks/useModal';
import { H3 } from '../ui/header/Header.Style';
import { CgCloseR } from 'react-icons/cg';

const ModalTitle = ({ children }: Children) => {
  const { closeModal } = useModal();

  return (
    <S.ModalTitleBox>
      <H3>{children}</H3>
      <button onClick={closeModal}>
        <CgCloseR />
      </button>
    </S.ModalTitleBox>
  );
};

const ModalBody = ({ children }: Children) => {
  return <S.ModalBodyContainer>{children}</S.ModalBodyContainer>;
};

const ModalWrapper = ({ children }: Children) => {
  const { closeModal } = useModal();

  return createPortal(
    <S.ModalWrapper onClick={closeModal}>
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

const Modal = Object.assign(ModalWrapper, {
  Title: ModalTitle,
  Body: ModalBody,
});

export default Modal;
