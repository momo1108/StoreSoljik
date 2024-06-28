import Input from '@/components/form/input/Input';
import Button from '@/components/ui/button/Button';
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

export const SigninFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 22px;
  box-sizing: border-box;
  width: 500px;
  padding: 40px 50px;

  & > h2,
  & > h3,
  & > p {
    text-align: center;
  }

  & > h2 {
    font-size: 60px;
  }
  & > h3 {
    font-size: 28px;
  }

  & > p {
    font-size: 20px;
    line-height: 32px;
  }

  & > hr {
    width: 100%;
    height: 1px;
    background: ${(props) => props.theme.color.border};
    border: none;
  }
`;

export const SigninInput = styled(Input)`
  width: 100%;
  & > p {
    padding: 0 2px;
    font-size: 16px;
    font-weight: bold;
  }
  & > input {
    height: 48px;
    padding: 0 8px;
    font-size: 18px;
    font-family: Pretendard;
    border: 2px solid ${(props) => props.theme.color.border};
    border-radius: ${(props) => props.theme.color.radius};
  }
`;

export const SignButton = styled(Button)`
  width: 100%;
  height: 48px;
  font-size: 18px;
  font-weight: 600;
`;

export const SigninIconBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
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
