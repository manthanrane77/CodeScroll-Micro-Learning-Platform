
'use server';

/**
 * @fileOverview A Genkit flow for assisting in blog post creation.
 * - generatePostAssist - A function that handles title generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { GeneratePostAssistInputSchema, GeneratePostAssistOutputSchema, GeneratePostAssistInput } from '@/ai/schemas';

const generateTitlesPrompt = ai.definePrompt({
    name: 'generateTitlesPrompt',
    input: { schema: z.object({ content: z.string() }) },
    output: { schema: z.object({ titles: z.array(z.string()).length(3).describe("An array of three distinct title suggestions.") }) },
    prompt: `Based on the following blog post content, suggest 3 short, catchy, and descriptive titles.

    Content: {{{content}}}
    `,
});

const generatePostAssistFlow = ai.defineFlow(
  {
    name: 'generatePostAssistFlow',
    inputSchema: GeneratePostAssistInputSchema,
    outputSchema: GeneratePostAssistOutputSchema,
  },
  async (input) => {
    if (input.assistType === 'title') {
        if (!input.content) {
            throw new Error('content is required for title generation');
        }
        const { output } = await generateTitlesPrompt({ content: input.content });
        return { titles: output?.titles };
    }
    
    // Fallback for removed types
    if (input.assistType === 'topic') {
        return { topics: [] };
    }
    if (input.assistType === 'image') {
        return { imageUrls: [] };
    }

    return {};
  }
);

export async function generatePostAssist(input: GeneratePostAssistInput) {
    return await generatePostAssistFlow(input);
}
