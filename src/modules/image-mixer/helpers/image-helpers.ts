export type ImageSize = {
  width: number;
  height: number;
};
export type ImageFillMode = "fill" | "contain" | "cover";

export function getImageSizeWithFillMode(
  image: HTMLImageElement,
  fillMode: ImageFillMode,
  containerWidth: number,
  containerHeight: number
): ImageSize {
  const { width, height } = image;
  const imageRatio = width / height;

  switch (fillMode) {
    case "fill":
      // Esse modo distorce a imagem e esticando ela para caber no container
      return {
        width: containerWidth,
        height: containerHeight,
      };

    case "contain": {
      // Esse modo não distorce a imagem e deixa ela com o tamanho máximo possível
      const containerRatio = containerWidth / containerHeight;

      if (imageRatio > containerRatio) {
        return {
          width: containerWidth,
          height: containerWidth / imageRatio,
        };
      }
      return {
        width: containerHeight * imageRatio,
        height: containerHeight,
      };
    }

    case "cover": {
      // Esse modo não distorce a imagem, cortando o que não couber no container
      const containerRatio = containerWidth / containerHeight;

      if (imageRatio > containerRatio) {
        return {
          width: containerHeight * imageRatio,
          height: containerHeight,
        };
      }

      return {
        width: containerWidth,
        height: containerWidth / imageRatio,
      };
    }

    default:
      throw new Error(`Invalid fill mode: ${fillMode}`);
  }
}

/**
 * @see {@link https://www.qoncious.com/questions/converting-image-grayscale-html5-canvas | qoncious }
 */
export function toGrayScale(imageData: ImageData) {
  const dataArray = imageData.data;
  // for (let i = 0; i < data.length; i += 4) {
  //   const r = data[i];
  //   const g = data[i + 1];
  //   const b = data[i + 2];
  //   const gray = r * 0.3 + g * 0.59 + b * 0.11;
  //   data[i] = gray;
  //   data[i + 1] = gray;
  //   data[i + 2] = gray;
  // }

  // Itera sobre cada pixel RGBA
  for (let i = 0; i < dataArray.length; i += 4) {
    const r = dataArray[i];
    const g = dataArray[i + 1];
    const b = dataArray[i + 2];
    // const a = data[i + 3]; // alpha

    const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    dataArray[i] = gray;
    dataArray[i + 1] = gray;
    dataArray[i + 2] = gray;
    // dataArray[i + 3] = a;
  }
}
