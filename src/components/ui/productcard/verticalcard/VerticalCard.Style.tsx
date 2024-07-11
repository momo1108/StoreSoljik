import styled from 'styled-components';
import Button from '../../button/Button';
import ClampedP from '../../clampp/ClampedP';

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 220px;
`;

export const CardImageBox = styled.div<{ $src: string }>`
  width: 100%;
  padding-top: 75%;
  background-image: url(${(props) => props.$src});
  background-size: cover;
  background-position: center;
`;

export const CardContentBox = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid ${(props) => props.theme.color.brighterGray};
`;

export const CardContentTitleBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const DatetimeP = styled.p`
  font-size: ${(props) => props.theme.fontSize.xs};
  color: #666;
`;

export const DescriptionP = styled(ClampedP)`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: #333;
  height: 40.5px;
  -webkit-line-clamp: 3;
  line-clamp: 3;
`;

export const PriceQuantityBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
`;

export const PriceP = styled.p`
  display: flex;
  flex-direction: column;
  color: #333;
  font-weight: bold;
  #title {
    font-size: ${(props) => props.theme.fontSize.sm};
    margin-right: 8px;
  }
  #price {
    color: #e60023;
  }
`;

export const MoreButton = styled(Button)`
  padding: 5px;
  font-size: ${(props) => props.theme.fontSize.sm};
`;
