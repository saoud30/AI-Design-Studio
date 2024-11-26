import { NextResponse } from 'next/server';
import Jimp from 'jimp';
import potrace from 'potrace';
import { promisify } from 'util';

const trace = promisify(potrace.trace);

interface ConversionOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

export async function POST(req: Request) {
  try {
    const { imageUrl, options = {} } = await req.json();

    if (!imageUrl) {
      throw new Error('Image URL is required');
    }

    // Remove data URL prefix if present
    const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Process image with Jimp
    const image = await Jimp.read(imageBuffer);

    // Optimize image for SVG conversion
    image
      .greyscale() // Convert to grayscale
      .contrast(0.5) // Increase contrast
      .normalize() // Normalize colors
      .posterize(4); // Reduce colors for better tracing

    const processedBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

    // Configure Potrace options
    const potraceOptions: potrace.PotraceOptions = {
      turdSize: 100, // Suppress speckles
      turdPolicy: 'black',
      threshold: 128,
      background: options.backgroundColor || 'transparent',
      blackOnWhite: true,
      optCurve: true,
      optTolerance: 0.2,
      alphaMax: 1,
      color: options.strokeColor || '#000000'
    };

    // Trace the image to SVG
    const svg = await new Promise<string>((resolve, reject) => {
      potrace.trace(processedBuffer, potraceOptions, (err, svg) => {
        if (err) {
          reject(err);
        } else {
          resolve(svg);
        }
      });
    });

    // If no SVG was generated, throw an error
    if (!svg) {
      throw new Error('Failed to generate SVG from image');
    }

    return NextResponse.json({ svg });
  } catch (error) {
    console.error('Error converting to SVG:', error);
    return NextResponse.json(
      { 
        error: 'Failed to convert to SVG', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
