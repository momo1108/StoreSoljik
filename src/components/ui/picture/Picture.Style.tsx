import styled from 'styled-components';

export const StyledPicture = styled.picture`
  img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: ${(props) => props.theme.color.radius};
  }
`;
