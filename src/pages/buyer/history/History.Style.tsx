// import media from '@/style/media';
import styled from 'styled-components';

export const CategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 950px;
  gap: 20px;
`;

export const OrderStatusMenuList = styled.ul`
  display: flex;
  gap: 64px;
  width: 100%;
  background: #1111;
  border-bottom: 1px solid ${(props) => props.theme.color.brighterGray};

  li {
    padding: 12px 16px;
    font-size: ${(props) => props.theme.fontSize.lg};
    font-weight: bold;
  }
`;
