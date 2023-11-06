type RGB = [number, number, number];

function luminance(r: number, g: number, b: number): number {
  let a: number[] = [r / 255, g / 255, b / 255];
  for (let i = 0; i < a.length; i++) {
    if (a[i] <= 0.03928) {
      a[i] = a[i] / 12.92;
    } else {
      a[i] = Math.pow((a[i] + 0.055) / 1.055, 2.4);
    }
  }
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

export function getLuminanceFromHex(hex: string): number {
  const rgb = parseInt(hex.slice(1), 16); // Convert hex to a number
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  // sRGB to Linear RGB conversion
  const toLinear = (color: number): number => {
    const c = color / 255.0;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  // Calculate relative luminance
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function getContrastRatioFromHex(hex1: string, hex2: string): number {
  const luminance1 = getLuminanceFromHex(hex1);
  const luminance2 = getLuminanceFromHex(hex2);

  // Calculate contrast ratio
  const brightest = Math.max(luminance1, luminance2);
  const darkest = Math.min(luminance1, luminance2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function contrastingColor(): [string, string] {
  // Generate a random background color
  const bg_r: number = Math.floor(Math.random() * 256);
  const bg_g: number = Math.floor(Math.random() * 256);
  const bg_b: number = Math.floor(Math.random() * 256);

  // Calculate luminance of the background color
  const bg_luminance: number = luminance(bg_r, bg_g, bg_b);

  // Determine text color based on background luminance
  let textColor: RGB;
  if (bg_luminance < 0.5) {
    textColor = [255, 255, 255]; // white
  } else {
    textColor = [0, 0, 0]; // black
  }

  // Convert RGB values to string format
  const bgColorStr: string = `rgb(${bg_r}, ${bg_g}, ${bg_b})`;
  const textColorStr: string = `rgb(${textColor[0]}, ${textColor[1]}, ${textColor[2]})`;

  return [bgColorStr, textColorStr];
}
