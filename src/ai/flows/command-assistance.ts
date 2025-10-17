// src/ai/flows/command-assistance.ts
'use server';
/**
 * @fileOverview A command assistance AI agent.
 *
 * - commandAssistance - A function that provides AI-powered suggestions and explanations for terminal commands.
 * - CommandAssistanceInput - The input type for the commandAssistance function.
 * - CommandAssistanceOutput - The return type for the commandAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CommandAssistanceInputSchema = z.object({
  command: z
    .string()
    .describe('The command or partial command entered by the user in the terminal.'),
});
export type CommandAssistanceInput = z.infer<typeof CommandAssistanceInputSchema>;

const CommandAssistanceOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of suggested commands based on the user input.'),
  explanation:
    z.string()
    .describe('An explanation of the suggested commands and their usage.'),
});
export type CommandAssistanceOutput = z.infer<typeof CommandAssistanceOutputSchema>;

export async function commandAssistance(input: CommandAssistanceInput): Promise<CommandAssistanceOutput> {
  return commandAssistanceFlow(input);
}

const commandAssistancePrompt = ai.definePrompt({
  name: 'commandAssistancePrompt',
  input: {schema: CommandAssistanceInputSchema},
  output: {schema: CommandAssistanceOutputSchema},
  prompt: `You are an AI assistant that helps users with Arch Linux commands.

  Based on the user's input, provide suggestions for potential commands and explain their usage. Include common flags and usage examples.

  User Input: {{{command}}}

  Suggestions and Explanations:`,
});

const commandAssistanceFlow = ai.defineFlow(
  {
    name: 'commandAssistanceFlow',
    inputSchema: CommandAssistanceInputSchema,
    outputSchema: CommandAssistanceOutputSchema,
  },
  async input => {
    const {output} = await commandAssistancePrompt(input);
    return output!;
  }
);
