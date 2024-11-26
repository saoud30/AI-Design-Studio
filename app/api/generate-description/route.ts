import { NextResponse } from 'next/server';

export const runtime = 'edge';

const generatePrompt = (length: string) => {
  const lengths = {
    short: "Describe this product concisely in 2-3 sentences.",
    medium: "Write a detailed product description in 4-5 sentences.",
    long: "Create a comprehensive product description including features, benefits, and use cases in 6-8 sentences."
  };
  return lengths[length as keyof typeof lengths];
};

export async function POST(req: Request) {
  try {
    const { imageUrl, model, languages, length } = await req.json();

    const descriptions: Record<string, string> = {};
    const prompt = generatePrompt(length);

    for (const language of languages) {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}/v1/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `${prompt} Respond in ${language}.`
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: imageUrl
                    }
                  }
                ]
              }
            ],
            max_tokens: 500,
            stream: false
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate description');
      }

      const data = await response.json();
      descriptions[language] = data.choices[0].message.content;
    }

    return NextResponse.json({ descriptions });
  } catch (error) {
    console.error('Error generating descriptions:', error);
    return NextResponse.json(
      { error: 'Failed to generate descriptions', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}