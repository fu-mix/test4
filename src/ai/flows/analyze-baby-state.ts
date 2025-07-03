'use server';
/**
 * @fileOverview An AI agent for analyzing a baby's state from a photo.
 *
 * - analyzeBabyState - A function that handles the baby state analysis process.
 * - AnalyzeBabyStateInput - The input type for the analyzeBabyState function.
 * - AnalyzeBabyStateOutput - The return type for the analyzeBabyState function.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const AnalyzeBabyStateInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a baby, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  apiKey: z.string().optional().describe('The Gemini API key to use for the request.'),
});
export type AnalyzeBabyStateInput = z.infer<typeof AnalyzeBabyStateInputSchema>;

const AnalyzeBabyStateOutputSchema = z.object({
  mood: z.string().describe("The perceived mood of the baby (e.g., happy, sad, fussy, sleepy)."),
  activity: z.string().describe("What the baby appears to be doing (e.g., sleeping, playing, crying)."),
  needs: z.array(z.string()).describe("A list of potential needs or suggestions for the parent (e.g., 'May be hungry', 'Needs a diaper change', 'Seems comfortable')."),
  isAsleep: z.boolean().describe("Whether the baby appears to be asleep or not."),
});
export type AnalyzeBabyStateOutput = z.infer<typeof AnalyzeBabyStateOutputSchema>;


export async function analyzeBabyState(input: AnalyzeBabyStateInput): Promise<AnalyzeBabyStateOutput> {
  const validatedInput = AnalyzeBabyStateInputSchema.parse(input);

  const apiKey = validatedInput.apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Please set it on the Settings page.');
  }

  const ai = genkit({
    plugins: [googleAI({apiKey})],
    model: 'googleai/gemini-2.0-flash',
  });

  const promptText = `You are an expert AI childcare assistant. Your role is to analyze a photo of a baby and provide a helpful assessment of their current state.

Based on the provided photo, analyze the baby's expression, posture, and surroundings.

Determine the baby's mood, what they are doing, and if they are asleep. Provide a list of potential needs or observations that could be helpful to a parent. Be gentle and supportive in your assessment.
`;
  
  const { output } = await ai.generate({
    prompt: [
        { text: promptText },
        { media: { url: validatedInput.photoDataUri } },
    ],
    output: {
      schema: AnalyzeBabyStateOutputSchema,
    },
  });

  if (!output) {
      throw new Error("The AI model did not return a valid analysis.");
  }
  
  return output;
}
