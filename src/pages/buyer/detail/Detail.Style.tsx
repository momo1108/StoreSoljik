// import media from '@/style/media';
import StateInput from '@/components/form/stateinput/StateInput';
import VerticalCard from '@/components/ui/productcard/vertical/VerticalCard';
import Spinner from '@/components/ui/spinner/Spinner';
import styled from 'styled-components';

export const ErrorBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  align-items: center;
  gap: 24px;
`;

export const DetailContainer = styled.div`
  display: flex;
  margin: auto 0;
  width: 1140px;
  gap: 30px;
`;

export const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 500px;
  flex-shrink: 0;
`;

export const CarouselWrapper = styled.div`
  border-radius: 6px;
  box-shadow:
    rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  overflow: hidden;
`;

export const ChattingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px 20px;
  border-radius: 6px;
  box-shadow:
    rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;

  & > h4 {
    border-bottom: 1px solid ${({ theme }) => theme.color.brighterGray};
    padding-bottom: 10px;
  }

  p.descr {
    color: ${({ theme }) => theme.color.gray};
  }

  input {
    height: 36px;
  }
`;

export const ChattingBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 250px;
  padding: 10px;
  gap: 10px;
  overflow: auto;
  box-shadow:
    rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;

  h4 {
    margin: auto 0;
  }

  .notification {
    color: ${({ theme }) => theme.color.gray};
    // margin-bottom: 10px;
  }

  .myMessage,
  .userMessage {
    padding: 6px 12px;
    box-shadow:
      rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
      rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
    border-radius: 6px;
  }

  .myMessage {
    background: #fff6ad;
    margin-right: auto;
  }

  .userMessage {
    background: #d6ecff;
    margin-left: auto;
  }
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
  padding: 15px 20px;
  border-radius: 6px;
  box-shadow:
    rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
`;

// 카테고리 정보
export const InfoHeaderP = styled.p`
  & > a:hover {
    color: ${(props) => props.theme.color.primary};
    border-bottom: 1px solid ${(props) => props.theme.color.primary};
    font-weight: bold;
  }
`;

// 카테고리 이후 모든 정보를
export const InfoBodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 25px;
`;

export const InfoContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 15px;
`;

export const PriceDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;

  h2,
  h4 {
    font-style: italic;
  }
  h2 {
    color: ${(props) => props.theme.color.destructive};
  }
  h4 {
    padding-left: 6px;
  }
`;

export const DescriptionP = styled.p`
  min-height: 54px;
  color: ${(props) => props.theme.color.gray};
  line-height: ${(props) => props.theme.lineHeight.base};
`;

export const InfoFormBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

export const TotalPriceBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-weight: bold;
  padding: 0 20px;

  div {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  h3 {
    color: ${(props) => props.theme.color.destructive};
  }
`;

export const InputButtonBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: end;
  padding: 0 15px;
  gap: 40px;
`;

export const StyledStateInput = styled(StateInput)`
  width: 100px;
  p.title {
    padding: 0 0 0 5px;
  }
  input {
    height: 40px;
  }
`;

export const ButtonBox = styled.div`
  display: flex;
  gap: 15px;

  button {
    min-width: 165px;
  }
`;

export const RecommendationBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;

  & > p {
    color: ${(props) => props.theme.color.gray};
  }
`;

export const RecommendationImageList = styled.ul`
  display: flex;
  gap: 15px;
  overflow: auto;
  padding: 0 0 10px 0;
`;

export const RecommendationSpinner = styled(Spinner)`
  box-sizing: border-box;
  width: 100%;
  height: 300px;
  border: 1px solid ${(props) => props.theme.color.brighterGray};
  border-radius: ${(props) => props.theme.color.radius};
  justify-content: center;
`;

export const RecommendationErrorBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 300px;
  padding: 0 0 25px 0;
  border: 1px solid ${(props) => props.theme.color.destructive};
  border-radius: ${(props) => props.theme.color.radius};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.color.destructive};
  font-weight: bold;
  font-size: ${(props) => props.theme.fontSize.xl};
`;

export const RecommendationVerticalCard = styled(VerticalCard)`
  flex-shrink: 0;

  p.descr {
    display: none;
  }
`;
