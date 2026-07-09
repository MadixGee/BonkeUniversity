import { describe, expect, it } from 'vitest';
import { AssignmentSchema } from '../../../src/schemas/assignment.schema.js';

describe('AssignmentSchema', () => {
  it('accepts a valid assignment payload', () => {
    const result = AssignmentSchema.safeParse({
      title: 'Build a small API',
      summary: 'Create a simple service',
      deliverables: ['Code', 'README'],
      acceptanceCriteria: ['Runs locally'],
    });

    expect(result.success).toBe(true);
  });

  it('rejects malformed assignment payloads', () => {
    const result = AssignmentSchema.safeParse({ title: '', summary: '', deliverables: [], acceptanceCriteria: [] });
    expect(result.success).toBe(false);
  });
});
