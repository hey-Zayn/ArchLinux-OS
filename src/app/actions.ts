'use server';

import {
  commandAssistance as commandAssistanceFlow,
  type CommandAssistanceInput,
} from '@/ai/flows/command-assistance';

export async function getCommandAssistance(input: CommandAssistanceInput) {
  try {
    const result = await commandAssistanceFlow(input);
    return result;
  } catch (error) {
    console.error('Error getting command assistance:', error);
    // In a real app, you would handle this more gracefully
    return {
      suggestions: [],
      explanation: 'Error: Could not connect to AI service.',
    };
  }
}
