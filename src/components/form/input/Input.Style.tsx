import styled from 'styled-components';

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;
  font-weight: bold;

  & > p.description {
    font-weight: normal;
    color: ${({ theme }) => theme.color.gray};
    padding: 0 2px;
    font-size: ${(props) => props.theme.fontSize.base};
  }
  & > p.errorMessage {
    color: ${(props) => props.theme.color.invalid};
    font-size: ${(props) => props.theme.fontSize.sm};
  }

  & > input {
    height: 48px;
    padding: 0 8px;
    font-size: ${(props) => props.theme.fontSize.md};
    font-weight: normal;
    border: 2px solid ${(props) => props.theme.color.border};
    border-radius: ${(props) => props.theme.color.radius};
    outline: none;

    &:focus {
      &[data-invalid='false'] {
        border-color: ${(props) => props.theme.color.valid};
      }
    }
    &[data-invalid='true'] {
      border-color: ${(props) => props.theme.color.invalid};
    }
  }
`;
