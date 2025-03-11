// import media from '@/style/media';
import Input from '@/components/form/input/Input';
import StateInput from '@/components/form/stateinput/StateInput';
import Button from '@/components/ui/button/Button';
import styled from 'styled-components';

export const PurchaseContainer = styled.div`
  display: flex;
  width: 950px;
  gap: 30px;
  align-items: start;
`;

export const FormContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  box-shadow: ${(props) => props.theme.color.borderShadow};
`;

export const ContainerHeaderBox = styled.div`
  font-weight: bold;
  padding: 15px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.color.brighterGray};
`;

export const DeliveryForm = styled.form`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
`;

export const PurchaseInput = styled(Input)`
  &.postcodeInput {
    width: 45%;
  }
  gap: 12px;
  input {
    border-radius: 0;
  }
`;

export const PostcodeBox = styled.div`
  display: flex;
  gap: 20px;

  button {
    flex-grow: 1;
    border-radius: 0;
    height: 52px;
    margin-top: 28px;
  }
`;

export const CartContainer = styled.div`
  width: 450px;
  height: 800px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: ${(props) => props.theme.color.borderShadow};
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

export const ItemDatailHeader = styled.div`
  p {
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.color.gray};
  }
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

export const TotalPriceBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.2em;
  padding: 24px;
`;

export const FooterBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
`;

export const CheckoutButton = styled(Button)`
  width: 100%;
  font-size: ${({ theme }) => theme.fontSize.lg};
  padding: 15px 20px;
  border-radius: 0;
`;
