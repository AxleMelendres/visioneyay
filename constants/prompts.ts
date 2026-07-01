export const PROMPTS = {
  academic: `Act as a university professor analyzing this image for educational purposes. Provide a JSON response with this exact structure:
{
  "objects": ["list", "of", "objects", "visible"],
  "educationalContext": "brief educational context or learning opportunity",
  "feedback": "one piece of constructive feedback or insight"
}
Return ONLY the JSON, no additional text.`,

  safety: `Act as a workplace safety inspector analyzing this image. Provide a JSON response with this exact structure:
{
  "hazards": "list of visible hazards in a bulleted format, or clearly state 'No hazards detected' if none are present",
  "riskLevel": "low/medium/high based on hazards present"
}
Return ONLY the JSON, no additional text.`,

  inventory: `Act as an asset management clerk analyzing this image. Provide a JSON response with this exact structure:
{
  "assets": ["clean", "list", "of", "visible", "assets", "and", "items"],
  "notes": "any relevant inventory notes or conditions observed"
}
Return ONLY the JSON, no additional text. Include no commentary, just facts.`,
};

export type PromptKey = keyof typeof PROMPTS;
