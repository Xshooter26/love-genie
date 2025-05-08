import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);


export function cleanGeminiResponse(raw: string): string[] {
  // Remove intro/instructions
  raw = raw.replace(/^.*?:/, '').trim();

  // Remove brackets if present (but not if it's a JSON array)
  let isJsonArray = false;
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) {
      isJsonArray = true;
      raw = arr.join('\n');
    }
  } catch (e) {
    // Not a JSON array, continue
    raw = raw.replace(/^[\[\(\{\s]+|[\]\)\}\s]+$/g, '');
  }

  // Split on numbered list (e.g., '1. ', '2. ', etc.)
  let items = raw.split(/\n?\d+\.\s/).map(item => item.trim()).filter(item => item.length > 0);

  // If splitting on numbered list yields only one item, fallback to splitting on newlines
  if (items.length === 1) {
    items = raw.split(/\n+/).map(item => item.trim()).filter(item => item.length > 0);
  }

  // Remove leading/trailing quotes
  items = items.map(item => item.replace(/^"|"$/g, ''));

  return items;
}


export async function generateResponse(
  message: string,
  tonality: string,
  image?: File
): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });

    // Prepare the prompt based on the tonality and message
    // Prepare the prompt based on the tonality and message
const prompt = `You are a helpful AI assistant that helps people communicate better in their relationships.
The user wants to send a message in a ${tonality} tone.
Please provide 3 different response suggestions for the following message: "${message}"

Format your response as a JSON array of strings, where each string starts with a serial number (e.g., "1.", "2.", "3.") followed by the suggestion.
Make sure the suggestions are appropriate, respectful, and match the requested tone.`;


    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    // Remove code block markers if present
    text = text.replace(/```json|```/g, '').trim();
    // Parse the JSON response
    try {
      const suggestions = JSON.parse(text);
      return Array.isArray(suggestions) ? suggestions : [text];
    } catch (error) {
      // If parsing fails, split the response by newlines and return as array
      return text.split('\n').filter((line: string) => line.trim());
    }
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response suggestions');
  }
}

export async function generateImageResponse(
  image: File,
  tonality: string
): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });

    // Convert File to base64
    const base64Image = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(image);
    });

    const prompt = `You are a helpful AI assistant that helps people start conversations. 
    The user wants to start a conversation about this image in a ${tonality} tone.
    Please provide 3 different conversation starters based on the image.
    
    Format your response as a JSON array of strings, where each string starts with a serial number (e.g., "1.", "2.", "3.") followed by the conversation starter.
    Make sure the suggestions are appropriate, respectful, and match the requested tone.`;
    

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image.split(',')[1],
          mimeType: image.type,
        },
      },
    ]);

    const response = await result.response;
    let text = response.text();
    // Remove code block markers if present
    text = text.replace(/```json|```/g, '').trim();
    // Parse the JSON response
    try {
      const suggestions = JSON.parse(text);
      return Array.isArray(suggestions) ? suggestions : [text];
    } catch (error) {
      // If parsing fails, split the response by newlines and return as array
      return text.split('\n').filter((line: string) => line.trim());
    }
  } catch (error) {
    console.error('Error generating image response:', error);
    throw new Error('Failed to generate conversation starters');
  }
} 