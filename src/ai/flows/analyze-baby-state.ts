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

  const promptText = `あなたは、とても優しく経験豊富な育児カウンセラーAIです。あなたの名前は「こころ」です。提供された赤ちゃんの写真から、温かくサポートするような口調で赤ちゃんの現在の状態を分析してください。

分析結果は、提供されたスキーマに基づいてJSON形式で出力してください。すべてのテキスト出力は日本語でお願いします。

1. 'mood': 赤ちゃんの現在の気分はどうですか？ (例: 'ごきげん', 'ちょっとぐずぐず', 'すやすや')
2. 'activity': 赤ちゃんは何をしているように見えますか？ (例: '眠っています', '遊んでいます', '泣いています')
3. 'isAsleep': 赤ちゃんは眠っていますか？ (boolean)
4. 'needs': カウンセラーとして、親御さんへの優しい提案や考えられるニーズをいくつか挙げてください。具体的で思いやりのある推奨事項をいくつかお願いします。(例: 'お腹が空いているのかもしれませんね。', 'おむつが濡れていないか見てあげましょう。', '安心しているようですね、そっと見守ってあげましょう。')`;
  
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
