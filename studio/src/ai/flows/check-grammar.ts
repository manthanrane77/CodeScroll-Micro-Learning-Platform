'use server';

/**
 * @fileOverview AI tool to check grammar and provide suggestions.
 * - checkGrammar - A function that checks the grammar of a given text.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { CheckGrammarInput, CheckGrammarInputSchema, CheckGrammarOutputSchema } from '@/ai/schemas';

export async function checkGrammar(input: CheckGrammarInput) {
  return checkGrammarFlow(input);
}

const checkGrammarPrompt = ai.definePrompt({
  name: 'checkGrammarPrompt',
  input: {schema: CheckGrammarInputSchema},
  output: {schema: CheckGrammarOutputSchema},
  prompt: `You are an expert editor. Please review the following text for any grammatical errors, spelling mistakes, or awkward phrasing. 
  
  Provide a fully corrected version of the text. Also, provide a list of the specific corrections you made and a brief explanation for each one to help the user learn.

  Original Text: {{{content}}}`,
});

const checkGrammarFlow = ai.defineFlow(
  {
    name: 'checkGrammarFlow',
    inputSchema: CheckGrammarInputSchema,
    outputSchema: CheckGrammarOutputSchema,
  },
  async input => {
    const {output} = await checkGrammarPrompt(input);
    return output!;
  }
);
