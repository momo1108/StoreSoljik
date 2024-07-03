import styled from 'styled-components';

export const StyledMain = styled.main`
  background: ${(props) => props.theme.color.background};
  padding: 20px 0;
  display: flex;
  justify-content: center;
  flex-grow: 1;
`;
