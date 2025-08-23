import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const prompt = formData.get('prompt');
    const imageFile = formData.get('image');

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let result;
    if (imageFile && imageFile.size > 0) {
      const imageBuffer = await streamToBuffer(imageFile.stream());
      const imageBase64 = imageBuffer.toString('base64');
      
      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: imageFile.type,
        },
      };

      result = await model.generateContent([prompt, imagePart]);
    } else {
      result = await model.generateContent(prompt);
    }
    
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ message: text });

  } catch (error) {
    console.error("Error in Gemini API route:", error);
    return NextResponse.json({ message: "Error generating response from AI." }, { status: 500 });
  }
}
