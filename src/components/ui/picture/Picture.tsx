import { ClassName } from '@/types/GlobalType';
import * as S from './Picture.Style';
import { ImgHTMLAttributes } from 'react';
import { getProperSizeImageUrl } from '@/utils/imageUtils';

type PictureProps = ClassName &
  ImgHTMLAttributes<HTMLButtonElement> & {
    imageUrlMap: Record<string, string>;
    size: number;
  };

const Picture: React.FC<PictureProps> = ({
  className = '',
  imageUrlMap,
  size,
  alt = 'alt text',
}) => {
  const imageLink = getProperSizeImageUrl(imageUrlMap, size);
  return (
    <S.StyledPicture className={className}>
      <source srcSet={imageLink.webp} type='image/webp' />
      <img width={size} height={size} src={imageLink.original} alt={alt} />
    </S.StyledPicture>
  );
};

export default Picture;
