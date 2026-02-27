import { z } from 'zod';

/**
 * @fileOverview Schemas and types for AI flows.
 */

// Schema for assisting with post creation
export const GeneratePostAssistInputSchema = z.object({
  content: z.string().optional().describe("The current content of the blog post."),
  title: z.string().optional().describe("The current title of the blog post."),
  assistType: z.enum(["title", "topic", "image"]).describe("The type of assistance requested."),
});
export type GeneratePostAssistInput = z.infer<typeof GeneratePostAssistInputSchema>;


export const GeneratePostAssistOutputSchema = z.object({
    titles: z.array(z.string()).optional().describe("An array of suggested titles."),
    topics: z.array(z.string()).optional().describe("An array of suggested topics."),
    imageUrls: z.array(z.string().url()).optional().describe("An array of generated image URLs."),
});
export type GeneratePostAssistOutput = z.infer<typeof GeneratePostAssistOutputSchema>;


// Schema for simplifying a paragraph.
export const SimplifyParagraphInputSchema = z.object({
  paragraph: z.string().describe('The complex paragraph to simplify.'),
});
export type SimplifyParagraphInput = z.infer<typeof SimplifyParagraphInputSchema>;

export const SimplifyParagraphOutputSchema = z.object({
  simplifiedParagraph: z.string().describe('The simplified version of the input paragraph.'),
});
export type SimplifyParagraphOutput = z.infer<typeof SimplifyParagraphOutputSchema>;


// Schema for checking grammar.
export const CheckGrammarInputSchema = z.object({
    content: z.string().describe("The text content to be checked for grammar and spelling."),
});
export type CheckGrammarInput = z.infer<typeof CheckGrammarInputSchema>;

export const CheckGrammarOutputSchema = z.object({
    correctedContent: z.string().describe("The content with grammar and spelling corrections applied."),
    corrections: z.array(z.object({
        original: z.string().describe("The original incorrect phrase."),
        corrected: z.string().describe("The corrected phrase."),
        explanation: z.string().describe("A brief explanation of the correction."),
    })).describe("A list of specific corrections made."),
});
export type CheckGrammarOutput = z.infer<typeof CheckGrammarOutputSchema>;
