'use server';

/**
 * @fileOverview AI tool to simplify complex paragraphs for easier understanding.
 *
 * - simplifyParagraph - A function that simplifies a given paragraph.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { SimplifyParagraphInput, SimplifyParagraphInputSchema, SimplifyParagraphOutputSchema } from '@/ai/schemas';

export async function simplifyParagraph(input: SimplifyParagraphInput) {
  return simplifyParagraphFlow(input);
}

const simplifyParagraphPrompt = ai.definePrompt({
  name: 'simplifyParagraphPrompt',
  input: {schema: SimplifyParagraphInputSchema},
  output: {schema: SimplifyParagraphOutputSchema},
  prompt: `You are an expert at simplifying complex topics. Please simplify the following paragraph, using language and terminology that is easy for students to understand.\n\nOriginal Paragraph: {{{paragraph}}}`,
});

const simplifyParagraphFlow = ai.defineFlow(
  {
    name: 'simplifyParagraphFlow',
    inputSchema: SimplifyParagraphInputSchema,
    outputSchema: SimplifyParagraphOutputSchema,
  },
  async input => {
    const {output} = await simplifyParagraphPrompt(input);
    return output!;
  }
);
