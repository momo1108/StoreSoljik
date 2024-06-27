import styled from 'styled-components';

export const StyledMain = styled.main`
  background: ${(props) => props.theme.color.background};
  display: flex;
  justify-content: center;
  flex-grow: 1;
`;
