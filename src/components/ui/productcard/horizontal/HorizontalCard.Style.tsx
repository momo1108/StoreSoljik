import styled from 'styled-components';
import Button from '../../button/Button';
import ClampedP from '../../clampp/ClampedP';

export const CardContainer = styled.div`
  display: flex;
  width: 500px;
  padding: 15px;
  border-radius: ${(props) => props.theme.color.radius};
  align-items: center;
  gap: 25px;
  box-shadow:
    rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
`;

export const CardContentBox = styled.div`
  display: flex;
  flex-grow: 2;
  flex-direction: column;
  height: 150px;
  gap: 10px;
  overflow: hidden; /* 추가 */
`;

export const CardContentTitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

export const DatetimeP = styled.p`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: end;
  font-size: ${(props) => props.theme.fontSize.sm};
`;

export const DescriptionP = styled(ClampedP)`
  color: ${(props) => props.theme.color.gray};
  font-size: ${(props) => props.theme.fontSize.sm};
  line-height: 1.2;
`;

export const CardContentBottomBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-top: auto;
`;

export const PriceQuantityDiv = styled.div`
  display: flex;
  align-items: end;
  gap: 10px;
  font-weight: bold;
`;

export const PriceP = styled.p`
  display: flex;
  flex-direction: column;
  gap: 5px;

  span#title {
    font-size: ${(props) => props.theme.fontSize.sm};
  }
  span#price {
    font-size: ${(props) => props.theme.fontSize.lg};
  }
`;

export const QuantityP = styled.p`
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: #0043c9;

  span#title {
    font-size: ${(props) => props.theme.fontSize.xs};
  }
  span#quantity {
    font-size: ${(props) => props.theme.fontSize.sm};
  }
`;

export const ButtonBox = styled.div`
  display: flex;
  gap: 8px;
`;

export const UpdateButton = styled(Button)`
  padding: 5px 15px;
`;

export const DeleteButton = styled(Button)`
  padding: 5px 15px;
  color: ${(props) => props.theme.color.destructiveForeground};
  background: ${(props) => props.theme.color.destructive};
  border-color: ${(props) => props.theme.color.destructive};

  &:hover {
    background: ${(props) => props.theme.color.destructiveHover};
    border-color: ${(props) => props.theme.color.destructiveHover};
  }
`;
