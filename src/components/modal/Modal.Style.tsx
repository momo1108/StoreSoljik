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
  gap: 16px;
  width: 400px;
  padding: 20px;
  background: white;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  box-shadow: ${(props) => props.theme.color.borderShadow};
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
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 5px;
`;
