import { storage } from '@/firebase';
import { getProductList } from '@/services/productService';
import { ProductSchema } from '@/types/FirebaseType';
import { getDownloadURL, listAll, ref } from 'firebase/storage';

type ImageFormat =
  | 'apng'
  | 'avif'
  | 'gif'
  | 'jpeg'
  | 'jpg'
  | 'png'
  | 'svg'
  | 'webp';

const imageMIMETypesMapper: Record<ImageFormat, string> = {
  apng: 'image/apng',
  avif: 'image/avif',
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  webp: 'image/webp',
};

const getImageMIMEType = (fileName: string) => {
  const splitFileName = fileName.split('.');
  const extension = splitFileName[splitFileName.length - 1].toLowerCase();

  return imageMIMETypesMapper[extension as ImageFormat] || 'none';
};

const imgToResizedDataUrl = (
  image: HTMLImageElement,
  imageFormat: ImageFormat,
  size: number = 0,
) => {
  var canvas = document.createElement('canvas');
  let { width, height } = image;
  const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

  // 원본의 크기가 요구 사이즈보다 크면 리사이징 진행
  if (size > 0 && (width > size || height > size)) {
    const ratio = size / Math.max(width, height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  canvas.width = width;
  canvas.height = height;

  canvasContext.fillStyle = 'rgba(0, 0, 0, 0)';
  canvasContext.fillRect(0, 0, width, height);

  if (
    canvasContext.imageSmoothingEnabled &&
    canvasContext.imageSmoothingQuality
  ) {
    canvasContext.imageSmoothingQuality = 'high';
  }

  canvasContext.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL(imageMIMETypesMapper[imageFormat]);
};

const b64toFile = (b64Data: string, fileName: string) => {
  const sliceSize = 512;

  const byteCharacters = atob(
    b64Data.toString().replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, ''),
  );
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  const MIMEType = getImageMIMEType(fileName);

  if (MIMEType === 'none') throw Error('File Is NOT Image!');

  const file = new File(byteArrays, fileName, {
    type: MIMEType,
    lastModified: new Date().getTime(),
  });
  return file;
};

const downloadFile = (file: File) => {
  const link = document.createElement('a');
  link.setAttribute('href', URL.createObjectURL(file));
  link.setAttribute('download', file.name);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const resizeImage = async (
  file: File,
  fileIndex: number, // 스키마 자체에서는 상관이 없지만, Storage 서비스에서 하나의 디렉터리에 모든 이미지를 저장하기 때문에 파일을 구분하기 위해 fileIndex 를 사용한다.
  imageFormat: ImageFormat | 'auto' = 'auto',
  withWebp: boolean = false,
): Promise<Record<string, File>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    if (file) {
      if (file.type && !file.type.includes('image')) {
        reject(new Error('File Is NOT Image!'));
      } else {
        reader.readAsDataURL(file);
        reader.onload = () => {
          let image = new Image();
          image.src = reader.result as string;
          image.onload = function () {
            const splitName = file.name.split('.');
            const ext = splitName[splitName.length - 1] as ImageFormat;
            const newExt = imageFormat === 'auto' ? ext : imageFormat;
            const originalFileClone = new File(
              [file],
              `${fileIndex}_original.${ext}`,
              { type: file.type },
            );
            const imageFileMap: Record<string, File> = {
              original: originalFileClone,
            };
            if (withWebp) {
              let imageDataUrl = imgToResizedDataUrl(image, 'webp');
              const newFile = b64toFile(
                imageDataUrl,
                `${fileIndex}_original.webp`,
              );
              imageFileMap['original_webp'] = newFile;
            }

            // 사용되는 이미지들의 사이즈 : 500, 220, 240, 150, 52
            // 상품 레코드별로 이미지:{원본:링크, 250:링크, 600:링크} 형태로 저장해야할듯
            // 만약 리사이즈가 필요없는 사이즈의 경우, 원본의 링크를 그대로 넣기
            if (image.width > 600 || image.height > 600) {
              let imageDataUrl600 = imgToResizedDataUrl(image, newExt, 600);
              const newFile600 = b64toFile(
                imageDataUrl600,
                `${fileIndex}_600px.${newExt}`,
              );
              imageFileMap['600px'] = newFile600;

              if (withWebp) {
                let imageDataUrl600Webp = imgToResizedDataUrl(
                  image,
                  'webp',
                  600,
                );
                const newFile600Webp = b64toFile(
                  imageDataUrl600Webp,
                  `${fileIndex}_600px.webp`,
                );
                imageFileMap['600px_webp'] = newFile600Webp;
              }
            } else if (image.width > 250 || image.height > 250) {
              let imageDataUrl250 = imgToResizedDataUrl(image, newExt, 250);
              const newFile250 = b64toFile(
                imageDataUrl250,
                `${fileIndex}_250px.${newExt}`,
              );
              imageFileMap['250px'] = newFile250;

              if (withWebp) {
                let imageDataUrl250Webp = imgToResizedDataUrl(
                  image,
                  'webp',
                  250,
                );
                const newFile250Webp = b64toFile(
                  imageDataUrl250Webp,
                  `${fileIndex}_250px.webp`,
                );
                imageFileMap['250px_webp'] = newFile250Webp;
              }
            }
            resolve(imageFileMap);
          };
        };
        reader.onerror = (pe) => {
          console.log(pe);
          reject(new Error('File Reading Failed!'));
        };
      }
    } else {
      reject(new Error('File Not Found!'));
    }
  });
};

const resizeFirebaseImage = async () => {
  // 모든 상품들의 id 를 가져오고, 각 id별로 반복문을 통해 원본 이미지를 리사이징해서 원본 이미지는 삭제하고, 리사이징된 이미지들을 다시 저장한다.
  // Storage 서비스에서 파일명을 수정하는 메서드는 따로 제공하지 않기 때문에 삭제 후 재업로드 방식을 사용한다.
  const productList = (await getProductList()) as ProductSchema[];
  console.log(productList);
  for (let i = 0; i < productList.length; i++) {
    const product = productList[i];

    // for (let j = 0; j < product.productImageUrlArray.length; j++) {
    //   const url = product.productImageUrlArray[j] as unknown;
    //   let image = new Image();
    //   image.src = url as string;
    //   image.onload = function () {
    //     console.dir(image);
    //     console.log(image.width, image.height);
    //   };
    // }
  }
};

// resizeFirebaseImage();
