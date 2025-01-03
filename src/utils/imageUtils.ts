const imgToResizedDataUrl = (image: HTMLImageElement, size: number) => {
  var canvas = document.createElement('canvas');
  let { width, height } = image;
  const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

  // 원본의 크기가 요구 사이즈보다 크면 리사이징 진행
  if (width > size || height > size) {
    const ratio = size / Math.max(width, height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
    canvasContext.fillStyle = 'rgba(0, 0, 0, 0)';
    canvasContext.fillRect(0, 0, width, height);

    if (
      canvasContext.imageSmoothingEnabled &&
      canvasContext.imageSmoothingQuality
    ) {
      canvasContext.imageSmoothingQuality = 'high';
    }

    canvasContext.drawImage(image, 0, 0, width, height);
  }

  return canvas.toDataURL();
};

export const resizeImage = (file: File, size: number) => {
  const reader = new FileReader();
  if (file) {
    if (file.type && !file.type.includes('image')) {
      throw Error('File Is NOT Image!');
    } else {
      reader.readAsDataURL(file);
      reader.onload = () => {
        var image = new Image();
        image.src = reader.result as string;
        image.onload = function () {
          var resizedDataUrl = imgToResizedDataUrl(image, size);
          //   const contentType = `image/${compressFormat}`;
          //   switch (outputType) {
          //     case 'blob':
          //       const blob = Resizer.b64toBlob(resizedDataUrl, contentType);
          //       responseUriFunc(blob);
          //       break;
          //     case 'base64':
          //       responseUriFunc(resizedDataUrl);
          //       break;
          //     case 'file':
          //       let fileName = file.name;
          //       let fileNameWithoutFormat = fileName
          //         .toString()
          //         .replace(/(png|jpeg|jpg|webp)$/i, '');
          //       let newFileName = fileNameWithoutFormat.concat(
          //         compressFormat.toString(),
          //       );
          //       const newFile = Resizer.b64toFile(
          //         resizedDataUrl,
          //         newFileName,
          //         contentType,
          //       );
          //       responseUriFunc(newFile);
          //       break;
          //     default:
          //       responseUriFunc(resizedDataUrl);
          //   }
        };
      };
      //   reader.onerror = (error) => {
      //     throw Error(error);
      //   };
    }
  } else {
    throw Error('File Not Found!');
  }
};
