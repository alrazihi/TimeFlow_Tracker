// adjust-time-estimates.ts
'use server';
/**
 * @fileOverview Adjust Time Estimates AI agent.
 *
 * - adjustTimeEstimates - A function that handles the adjust time estimates process.
 * - AdjustTimeEstimatesInput - The input type for the adjustTimeEstimates function.
 * - AdjustTimeEstimatesOutput - The return type for the adjustTimeEstimates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustTimeEstimatesInputSchema = z.object({
  taskName: z.string().describe('The name of the task.'),
  estimatedTime: z.number().describe('The estimated time for the task in minutes.'),
  actualTimes: z
    .array(z.number())
    .describe('An array of actual times spent on the task in minutes.'),
});
export type AdjustTimeEstimatesInput = z.infer<typeof AdjustTimeEstimatesInputSchema>;

const AdjustTimeEstimatesOutputSchema = z.object({
  suggestedAdjustment: z
    .number()
    .describe('The suggested adjustment to the estimated time in minutes.'),
  reason: z.string().describe('The reasoning behind the suggested adjustment.'),
});
export type AdjustTimeEstimatesOutput = z.infer<typeof AdjustTimeEstimatesOutputSchema>;

export async function adjustTimeEstimates(input: AdjustTimeEstimatesInput): Promise<AdjustTimeEstimatesOutput> {
  return adjustTimeEstimatesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adjustTimeEstimatesPrompt',
  input: {schema: AdjustTimeEstimatesInputSchema},
  output: {schema: AdjustTimeEstimatesOutputSchema},
  prompt: `You are a time management expert. Analyze the past task completion times and suggest adjustments to the estimated times.

Task Name: {{{taskName}}}
Estimated Time: {{{estimatedTime}}} minutes
Actual Times: {{{actualTimes}}}

Based on this data, suggest an adjustment to the estimated time and explain your reasoning.`,
});

const adjustTimeEstimatesFlow = ai.defineFlow(
  {
    name: 'adjustTimeEstimatesFlow',
    inputSchema: AdjustTimeEstimatesInputSchema,
    outputSchema: AdjustTimeEstimatesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
