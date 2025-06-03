import { Parameter } from '../types/models'

export const validateParameter = (param: Parameter, value: string | number): boolean => {
  if (param.type === 'number') {
    return !isNaN(Number(value))
  }
  return typeof value === 'string'
}

export const formatParameterValue = (param: Parameter, value: string | number): string | number => {
  if (param.type === 'number') {
    return Number(value)
  }
  return String(value)
} 