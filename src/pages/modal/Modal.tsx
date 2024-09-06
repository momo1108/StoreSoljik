import { createPortal } from 'react-dom';
import { ModalMain } from './Modal.Style';
import { Children } from '@/types/GlobalType';

type ModalProps = Children & {
  isOpen: boolean;
};

const Modal = ({ children, isOpen }: ModalProps) => {
  return isOpen
    ? createPortal(<ModalMain>{children}</ModalMain>, document.body)
    : null;
};

export default Modal;
