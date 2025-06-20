const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export const generateBlurDataUrl = async (src: string): Promise<string> => {
  // If it's a remote image, we'll return a shimmer effect
  if (src.startsWith('http')) {
    return `data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`;
  }

  // For local images, we can generate a proper blur
  try {
    const response = await fetch(src);
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('Error generating blur data URL:', error);
    return `data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`;
  }
};

export const getImageDimensions = async (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.onerror = reject;
    img.src = src;
  });
};

export const calculateAspectRatio = (width: number, height: number): number => {
  return width / height;
};

export const getSrcSet = (src: string, widths: number[]): string => {
  return widths
    .map((width) => `${src}?w=${width} ${width}w`)
    .join(', ');
}; 