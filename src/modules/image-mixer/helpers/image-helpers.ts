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
