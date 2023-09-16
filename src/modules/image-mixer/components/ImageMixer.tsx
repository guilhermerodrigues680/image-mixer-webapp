import { useEffect, useRef, useState } from "react";
import {
  getImageSizeWithFillMode,
  toGrayScale,
} from "../helpers/image-helpers";
import demoMainImageUrl from "../assets/demo-data/person.png";
import demoBgImageUrl from "../assets/demo-data/31130841_bg2608228.jpg";

const globalCompositeOperations = [
  "color",
  "color-burn",
  "color-dodge",
  "copy",
  "darken",
  "destination-atop",
  "destination-in",
  "destination-out",
  "destination-over",
  "difference",
  "exclusion",
  "hard-light",
  "hue",
  "lighten",
  "lighter",
  "luminosity",
  "multiply",
  "overlay",
  "saturation",
  "screen",
  "soft-light",
  "source-atop",
  "source-in",
  "source-out",
  "source-over",
  "xor",
];

/*
  TODO: Mantem proporção das imagens (fill, fit ou crop)
  TODO: Calcular tamanho máximo do canvas (pixel ratio e dimensoes imagens)
  TODO: Preto e branco imagem principal
  TODO: Exportar imagem
*/

export function ImageMixer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mainImageFile, setMainImageFile] = useState<Blob | null>(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState<Blob | null>(
    null
  );
  const [overlayColor, setOverlayColor] = useState<string>(
    /*"#000000"*/ /*"#00ff85"*/ "#ff00ff"
  );
  const [overlayColorAlpha, setOverlayColorAlpha] = useState<number>(70);
  const [globalCompositeOperation, setGlobalCompositeOperation] =
    useState<GlobalCompositeOperation>(/*"source-over"*/ /*"darken"*/ "color");

  async function handleGenerate() {
    console.debug("Gerando imagem...");

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      console.warn("Canvas ou context é nulo");
      return;
    }

    console.debug("Current fillStyle:", context.fillStyle);
    console.debug(
      "Current globalCompositeOperation:",
      context.globalCompositeOperation
    );
    console.debug("Current globalAlpha:", context.globalAlpha);

    context.clearRect(0, 0, canvas.width, canvas.height);

    if (!mainImageFile || !backgroundImageFile) {
      console.warn("Imagem principal ou imagem de fundo não selecionada");
      return;
    }

    const blobToImage = (blob: Blob): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = URL.createObjectURL(blob);
      });
    };

    const mainImage = await blobToImage(mainImageFile);
    const backgroundImage = await blobToImage(backgroundImageFile);
    console.debug("mainImage:", { mainImage });

    // TODO: criar resets para cada propriedade
    const defaultGlobalCompositeOperation = "source-over";
    const defaultFillStyle = "#000000";
    const defaultGlobalAlpha = 1;
    context.globalCompositeOperation = defaultGlobalCompositeOperation;
    context.fillStyle = defaultFillStyle;
    context.globalAlpha = defaultGlobalAlpha;

    const bgImgSize = getImageSizeWithFillMode(
      backgroundImage,
      "cover",
      canvas.width,
      canvas.height
    );
    const mainImgSize = getImageSizeWithFillMode(
      mainImage,
      "contain",
      canvas.width,
      canvas.height
    );
    const coordsMainImg = {
      dx: (canvas.width - mainImgSize.width) / 2,
      dy: (canvas.height - mainImgSize.height) / 2,
    };

    // Desenha a imagem principal
    context.drawImage(
      mainImage,
      coordsMainImg.dx,
      coordsMainImg.dy,
      mainImgSize.width,
      mainImgSize.height
    );

    // Coloca em escala de cinza
    const imageData = context.getImageData(
      coordsMainImg.dx,
      coordsMainImg.dy,
      mainImgSize.width,
      mainImgSize.height
    );

    toGrayScale(imageData);

    context.putImageData(imageData, coordsMainImg.dx, coordsMainImg.dy);

    // Desenha a imagem de fundo por baixo (troca modo de composição)
    context.globalCompositeOperation = "destination-over";
    context.drawImage(backgroundImage, 0, 0, bgImgSize.width, bgImgSize.height);

    context.globalCompositeOperation = globalCompositeOperation;
    const grd = context.createLinearGradient(
      0,
      canvas.height / 2,
      canvas.width,
      canvas.height / 2
    );
    grd.addColorStop(0, overlayColor);
    grd.addColorStop(1, "transparent");

    // context.fillStyle = overlayColor;
    context.fillStyle = grd;
    context.globalAlpha = overlayColorAlpha / 100;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // TODO: Imagem preto e branco
    // https://stackoverflow.com/questions/3892010/create-2d-context-without-canvas
  }

  async function loadDemoData() {
    const getBlobFromUrl = async (url: string): Promise<Blob> => {
      const response = await fetch(url);
      const blob = await response.blob();
      return blob;
    };

    const demoMainImage = await getBlobFromUrl(demoMainImageUrl);
    const demoBgImage = await getBlobFromUrl(demoBgImageUrl);

    setMainImageFile(demoMainImage);
    setBackgroundImageFile(demoBgImage);
  }

  useEffect(() => {
    handleGenerate();
  }, [
    mainImageFile,
    backgroundImageFile,
    overlayColor,
    overlayColorAlpha,
    globalCompositeOperation,
  ]);

  return (
    <>
      <button type="button" onClick={loadDemoData}>
        Carregar dados de demonstração
      </button>

      <br />

      <label>
        Selecione a imagem principal:
        <small>(deve ser uma imagem PNG com fundo transparente)</small>
        <input
          type="file"
          accept="image/png"
          onChange={(event) =>
            setMainImageFile(event.target.files?.[0] || null)
          }
        />
      </label>

      <br />

      <label>
        Selecione a imagem de fundo:
        <small>(pode ser qualquer imagem)</small>
        <input
          type="file"
          accept="image/*"
          onChange={(event) =>
            setBackgroundImageFile(event.target.files?.[0] || null)
          }
        />
      </label>

      <br />

      <label>
        Selecione a cor de sobreposição:
        <input
          type="color"
          value={overlayColor}
          onChange={(event) => setOverlayColor(event.target.value)}
        />
      </label>

      <br />

      <label>
        Selecione a opacidade da cor de sobreposição:
        <input
          type="range"
          min="0"
          max="100"
          value={overlayColorAlpha}
          onChange={(event) => setOverlayColorAlpha(Number(event.target.value))}
        />
      </label>

      <br />

      <label>
        Selecione o modo de composição:
        <select
          value={globalCompositeOperation}
          onChange={(event) =>
            setGlobalCompositeOperation(
              event.target.value as GlobalCompositeOperation
            )
          }
        >
          {globalCompositeOperations.map((operation) => (
            <option key={operation} value={operation}>
              {operation}
            </option>
          ))}
        </select>
      </label>

      <br />

      <button type="button" onClick={handleGenerate}>
        Gerar
      </button>

      <br />

      <canvas ref={canvasRef} width="300" height="300"></canvas>
    </>
  );
}

export default ImageMixer;
