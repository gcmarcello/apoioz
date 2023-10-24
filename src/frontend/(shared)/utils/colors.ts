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
