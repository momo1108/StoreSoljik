import styled from 'styled-components';

export const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #0006;
  z-index: 10;
  pointer-events: all;
`;

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 400px;
  padding: 20px;
  background: white;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  box-shadow:
    rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
`;

export const ModalTitleBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const ModalBodyContainer = styled.div`
  min-height: 300px;
  max-height: 600px;
`;
