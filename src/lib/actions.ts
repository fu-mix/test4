'use server';

import { generateParentingInsight } from '@/ai/flows/generate-parenting-insight';
import { detectToxicity } from '@/ai/flows/detect-toxic-interactions';
import { z } from 'zod';
import type { CommunityPost } from './types';
import { analyzeBabyState, type AnalyzeBabyStateOutput } from '@/ai/flows/analyze-baby-state';

const insightSchema = z.object({
  babyActivityDescription: z.string().min(10, 'Please provide a more detailed description.'),
  parentingGoals: z.string().min(5, 'Please describe your parenting goals.'),
  parentingStyles: z.string().min(5, 'Please describe your parenting styles.'),
});

export async function getParentingInsight(prevState: any, formData: FormData) {
  const validatedFields = insightSchema.safeParse({
    babyActivityDescription: formData.get('babyActivityDescription'),
    parentingGoals: formData.get('parentingGoals'),
    parentingStyles: formData.get('parentingStyles'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const insightData = await generateParentingInsight(validatedFields.data);
    return { data: insightData, errors: {} };
  } catch (e) {
    return { data: null, errors: { _form: ['Failed to generate insight. Please try again.'] } };
  }
}

const postSchema = z.object({
  content: z.string().min(1, 'Post cannot be empty.').max(500, 'Post is too long.'),
});

export async function createCommunityPost(prevState: any, formData: FormData) {
   const validatedFields = postSchema.safeParse({
    content: formData.get('content'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.content?.join(', '),
    };
  }
  
  const content = validatedFields.data.content;

  try {
    const toxicityResult = await detectToxicity({ text: content });

    if (toxicityResult.isToxic) {
      return { error: `Post cannot be created. Reason: ${toxicityResult.toxicityReason || 'Content is inappropriate'}` };
    }

    const newPost: CommunityPost = {
      id: new Date().toISOString(),
      author: { name: 'You', avatarUrl: 'https://placehold.co/40x40.png' },
      content,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
    };

    return { post: newPost };
  } catch (e) {
     return { error: 'Could not create post. Please try again.' };
  }
}

export async function analyzeBabyStateAction(
  { photoDataUri, apiKey }: { photoDataUri: string; apiKey?: string }
): Promise<{ data: AnalyzeBabyStateOutput | null; error: string | null; }> {
  if (!photoDataUri) {
    return { data: null, error: 'No image data provided.' };
  }

  try {
    const result = await analyzeBabyState({ photoDataUri, apiKey });
    return { data: result, error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'An unknown error occurred.';
    console.error(e);
    return { data: null, error: `Failed to analyze baby state: ${message}` };
  }
}
