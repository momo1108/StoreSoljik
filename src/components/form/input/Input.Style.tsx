import media from '@/style/media';
import styled from 'styled-components';

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  ${media.xlarge`width: 320px;`}
  ${media.large`width: 320px;`}
  ${media.medium`width: 320px;`}
  ${media.small`width: 320px;`}
  ${media.xsmall`width: 320px;`}
  ${media.xxsmall`width: 320px;`}

  p.description {
    color: ${(props) => props.theme.color.description};
    font-size: ${(props) => props.theme.fontSize.sm};
    font-weight: 400;
  }
  p.errorMessage {
    color: ${(props) => props.theme.color.invalid};
    font-size: ${(props) => props.theme.fontSize.sm};
  }

  & > input {
    outline: none;
    border: 2px solid ${(props) => props.theme.color.border};
    border-radius: ${(props) => props.theme.color.radius};

    &:focus and &[data-invalid='false'] {
      border-color: ${(props) => props.theme.color.valid};
    }
    &[data-invalid='true'] {
      border-color: ${(props) => props.theme.color.invalid};
    }
  }
`;
