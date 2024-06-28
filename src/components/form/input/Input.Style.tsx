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
`;
