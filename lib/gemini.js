import * as FileSystem from 'expo-file-system';

/**
 * Convert an image file to base64 string
 * @param {string} imageUri - The URI of the image file
 * @returns {Promise<string>} - The base64 encoded image string
 */
export async function imageToBase64(imageUri) {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
}

/**
 * Analyze an image using Gemini API
 * @param {string} base64Image - The base64 encoded image string
 * @param {string} prompt - The prompt/question to send with the image
 * @returns {Promise<object>} - The parsed JSON response from Gemini API
 */
export async function analyzeImage(base64Image, prompt) {
  try {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_KEY;
    
    if (!apiKey) {
      throw new Error('EXPO_PUBLIC_GEMINI_KEY environment variable is not set');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;
    
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: base64Image,
              },
            },
          ],
        },
      ],
    };

    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    throw error;
  }
}
