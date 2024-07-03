import styled from 'styled-components';

export const NavContainer = styled.ul`
  display: flex;
  align-items: center;
  font-size: ${(props) => props.theme.fontSize.base};
  font-weight: bold;
  gap: 8px;

  li a {
    text-decoration: none;
  }
`;
