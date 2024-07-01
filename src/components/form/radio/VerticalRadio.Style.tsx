import styled from 'styled-components';

export const RadioContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  p.errorMessage {
    color: red;
    font-weight: bold;
    font-size: ${(props) => props.theme.fontSize.sm};
  }
`;

export const OptionsContainer = styled.fieldset`
  display: flex;
`;
