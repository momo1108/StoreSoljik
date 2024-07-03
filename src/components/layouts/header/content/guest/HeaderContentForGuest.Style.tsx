import media from '@/style/media';
import styled from 'styled-components';

export const HeaderContentContainer = styled.div`
  display: flex;
  justify-content: center;
  ${media.xlarge`height: 80px;`}
  ${media.large`height: 80px;`}
  ${media.medium`height: 80px;`}
  ${media.small`height: 50px;`}
`;
