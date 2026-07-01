// Roboflow model configuration
const ROBOFLOW_MODEL_ID = 'your-model-id';
const ROBOFLOW_VERSION = '1';

/**
 * Detect objects in an image using Roboflow API
 * @param {string} base64Image - The base64 encoded image string
 * @returns {Promise<Array>} - The predictions array from Roboflow, or empty array on failure
 */
export async function detectObjects(base64Image) {
  try {
    const apiKey = process.env.EXPO_PUBLIC_ROBOFLOW_KEY;

    if (!apiKey) {
      console.warn('EXPO_PUBLIC_ROBOFLOW_KEY environment variable is not set');
      return [];
    }

    if (!ROBOFLOW_MODEL_ID || !ROBOFLOW_VERSION) {
      console.warn('Roboflow model ID or version is not configured');
      return [];
    }

    const endpoint = `https://detect.roboflow.com/${ROBOFLOW_MODEL_ID}/${ROBOFLOW_VERSION}?api_key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: base64Image,
    });

    if (!response.ok) {
      console.error(`Roboflow API error: ${response.status}`);
      return [];
    }

    const result = await response.json();

    // Return predictions array or empty array if not present
    return result.predictions || [];
  } catch (error) {
    console.error('Error detecting objects with Roboflow:', error);
    return [];
  }
}
