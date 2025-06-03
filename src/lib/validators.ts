import { z } from 'zod';
import { ParamType } from '../types/models';

export const validationRuleSchema = z.object({
  required: z.boolean().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
  enum: z.array(z.string()).optional(),
  custom: z.function().optional(),
});

export const parameterSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  value: z.any(),
  type: z.enum(['number', 'string', 'boolean', 'enum', 'color'] as const),
  description: z.string().optional(),
  category: z.string().optional(),
  validation: validationRuleSchema.optional(),
  metadata: z.record(z.any()).optional(),
});

export const modelSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  parameters: z.array(parameterSchema),
  createdAt: z.number(),
  updatedAt: z.number(),
  version: z.number(),
});

export const validateParameter = (param: unknown, type: ParamType) => {
  const schema = parameterSchema.extend({
    type: z.literal(type),
  });

  try {
    schema.parse(param);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return { valid: false, errors: [{ path: '', message: 'Unknown error' }] };
  }
};

export const validateModel = (model: unknown) => {
  try {
    modelSchema.parse(model);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return { valid: false, errors: [{ path: '', message: 'Unknown error' }] };
  }
}; 