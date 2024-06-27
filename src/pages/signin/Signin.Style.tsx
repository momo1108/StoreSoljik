import media from '@/style/media';
import styled from 'styled-components';

// medium 부터 이미지 출력
export const SigninContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${media.xlarge`width: 1240px;`}
  ${media.large`width: 900px;`}
  ${media.medium`width: 600px;`}
  ${media.small`width: 400px;`}
  ${media.xsmall`width: 90%;`}
  ${media.xxsmall`width: 95%;`};
`;

export const SigninFormContainer = styled.div`
  background: #eee;
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: 440px;
  padding: 60px 40px;

  * {
    text-align: center;
  }

  h2 {
    font-size: 60px;
  }

  p {
    font-size: 20px;
    line-height: 32px;
  }
`;

export const SigninImageBox = styled.div`
  background: #eee;
  width: 700px;
  height: 700px;
  border: 1px solid ${(props) => props.theme.color.foreground};
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

  & > img {
    width: 100%;
  }
`;
