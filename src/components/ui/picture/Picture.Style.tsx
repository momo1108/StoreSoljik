import styled from 'styled-components';

export const StyledPicture = styled.picture`
  img {
    object-fit: cover;
    border-radius: ${(props) => props.theme.color.radius};
  }
`;
