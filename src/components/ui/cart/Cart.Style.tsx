import StateInput from '@/components/form/stateinput/StateInput';
import styled from 'styled-components';
import Button from '../button/Button';

export const CartContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: ${({ $isOpen }) => ($isOpen ? '0' : '-500px')};
  box-sizing: border-box;
  width: 450px;
  height: 100%;
  background: ${({ theme }) => theme.color.background};
  padding: 0 20px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

export const HeaderBox = styled.div`
  position: relative;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 1.5em;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  right: 16px;
`;

export const ContentBox = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const CartItemBox = styled.div`
  display: flex;
  padding: 16px;
  gap: 16px;
`;

export const ItemImg = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.color.radius};
`;

export const ItemDetailsBox = styled.div`
  display: flex;
  padding: 10px 0;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  overflow: hidden;
`;

export const ItemPriceBox = styled.div`
  color: #999;
`;

export const ItemQuantityBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ItemInputBox = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.color.brightGray};
  border-radius: 4px;
  height: 30px;

  & > button {
    width: 30px;
    height: 30px;
    padding: 0;
    border: none;
    &:hover {
      border: none;
    }
  }
`;

export const QuantityInput = styled(StateInput)`
  height: 100%;
  width: 40px;
  input {
    text-align: center;
    padding: 0;
    border-radius: 0;
    border: none;
    border-left: 1px solid ${({ theme }) => theme.color.gray};
    border-right: 1px solid ${({ theme }) => theme.color.gray};
  }
`;

export const DeleteButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;

  transition: color 0.2s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.color.destructive};
    & > svg {
      animation: shake-lr 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
    }
  }
`;

export const FooterBox = styled.div`
  padding: 24px;
`;

export const TotalPriceBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.2em;
  padding: 24px;
`;

export const CheckoutButton = styled(Button)`
  width: 100%;
  font-size: ${({ theme }) => theme.fontSize.lg};
  padding: 20px;
`;
