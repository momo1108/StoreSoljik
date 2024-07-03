import Main from '@/components/layouts/main/Main';
import Button from '@/components/ui/button/Button';
import media from '@/style/media';
import styled from 'styled-components';

export const RegistrationMain = styled(Main)`
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 10px;
`;

export const RegistrationForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 10px;
`;

export const RegistrationTitleBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 1140px;
  padding: 0 10px;
  box-sizing: border-box;
`;

export const RegistrationTitleHeader = styled.h2`
  display: flex;
  align-items: center;
  font-size: ${(props) => props.theme.fontSize.xxl};
  gap: 12px;
`;

export const RegistrationSubmitButton = styled(Button)<{ $iconSize: number }>`
  background: ${(props) => props.theme.color.primary};
  color: ${(props) => props.theme.color.primaryForeground};
  font-size: ${(props) => props.theme.fontSize.lg};
  border-radius: 5px;
  border: none;
  display: flex;

  &:hover {
    background: ${(props) => props.theme.color.primaryHover};
    border: none;
  }

  & > svg {
    width: ${(props) => props.theme.fontSize.lg};
    height: ${(props) => props.theme.fontSize.lg};
  }
`;

export const WarningMessageP = styled.p`
  width: 100%;
  color: ${(props) => props.theme.color.invalid};
`;

export const RegistrationContentBox = styled.div`
  display: grid;
  width: 1140px;
  flex-grow: 1;
  grid-template-columns: 40% 1fr;
  gap: 10px;
  h3 {
    font-size: ${(props) => props.theme.fontSize.xl};
  }
`;

export const RegistrationContentColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

export const RegistrationContentItemBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 25px 40px 35px 40px;
  background: #f6f6f6;
  border-radius: 20px;
`;

export const RegistrationContentImageBox = styled(RegistrationContentItemBox)`
  & > span.errorSpan {
    font-weight: bold;
    color: ${(props) => props.theme.color.invalid};
  }
`;

export const RegistrationContentImagePreviewBox = styled.div`
  display: grid;
  height: 350px;
  gap: 10px;
  border: 1px solid #999;
  padding: 5px;
  grid-template-columns: 1fr 1fr;
  overflow: auto;

  // 스크롤바 없애기
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;

  background:
    linear-gradient(white 30%, rgba(255, 255, 255, 0)),
    linear-gradient(rgba(255, 255, 255, 0), white 70%) 0 100%,
    radial-gradient(
      farthest-side at 50% 0,
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0)
    ),
    radial-gradient(
        farthest-side at 50% 100%,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0)
      )
      0 100%;
  background-repeat: no-repeat;
  background-color: white;
  background-size:
    100% 40px,
    100% 40px,
    100% 14px,
    100% 14px;

  background-attachment: local, local, scroll, scroll;

  & > span {
    margin: auto;
    grid-column: span 2;
    text-align: center;
    font-size: ${(props) => props.theme.fontSize.lg};
    font-weight: bold;
  }
`;

export const ImagePreviewItemBox = styled.div<{ $imgSrc: string }>`
  height: 0;
  padding-bottom: 100%;
  border: 1px solid #999;

  background-image: url(${(props) => props.$imgSrc});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;
