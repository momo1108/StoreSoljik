import styled from 'styled-components';

export const LoadingContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

export const LoadingSpinner = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: block;
  margin: 15px 50px;
  position: relative;
  box-sizing: border-box;
  animation:
    animloader 0.75s linear infinite alternate,
    fontColorChanger 8s linear infinite alternate;

  @keyframes animloader {
    0% {
      box-shadow:
        -38px -12px,
        -14px 0,
        14px 0,
        38px 0;
    }
    33% {
      box-shadow:
        -38px 0px,
        -14px -12px,
        14px 0,
        38px 0;
    }
    66% {
      box-shadow:
        -38px 0px,
        -14px 0,
        14px -12px,
        38px 0;
    }
    100% {
      box-shadow:
        -38px 0,
        -14px 0,
        14px 0,
        38px -12px;
    }
  }
`;

export const LoadingMessageP = styled.p`
  font-weight: bold;
  font-size: ${(props) => props.theme.fontSize.xl};

  animation: fontColorChanger 8s linear infinite alternate;

  @keyframes fontColorChanger {
    0% {
      color: black;
    }
    33% {
      color: #333;
    }
    66% {
      color: #23c;
    }
    100% {
      color: black;
    }
  }
`;
