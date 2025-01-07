const imgToResizedDataUrl = (image: HTMLImageElement, size: number) => {
  var canvas = document.createElement('canvas');
  let { width, height } = image;
  const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

  // 원본의 크기가 요구 사이즈보다 크면 리사이징 진행
  if (width > size || height > size) {
    const ratio = size / Math.max(width, height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);

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
  }
  return canvas.toDataURL();
};

const getImageMIMEType = (fileName: string) => {
  const splitFileName = fileName.split('.');
  const extension = splitFileName[splitFileName.length - 1].toLowerCase();

  const imageMIMETypesMapper: Record<string, string> = {
    apng: 'apng',
    avif: 'avif',
    gif: 'gif',
    jpeg: 'jpeg',
    jpg: 'jpeg',
    png: 'png',
    svg: 'svg+xml',
    webp: 'webp',
  };

  return imageMIMETypesMapper[extension] || 'none';
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
          let fileName = file.name;
          const newFile = b64toFile(resizedDataUrl, fileName);
        };
      };
      reader.onerror = (pe) => {
        console.log(pe);
        throw Error('File Reading Failed!');
      };
    }
  } else {
    throw Error('File Not Found!');
  }
};
