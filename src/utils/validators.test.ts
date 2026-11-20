import type { Parameter } from '../types/models'
import { formatParameterValue, validateParameter } from './validators'

const numericParameter: Parameter = {
  id: 'numeric-1',
  name: 'Quantity',
  value: 1,
  type: 'number',
}

describe('numeric parameter validation', () => {
  it.each(['', ' ', '   ', 'Infinity', '-Infinity', 'not-a-number'])(
    'rejects an empty or non-finite input: %s',
    (value) => {
      expect(validateParameter(numericParameter, value)).toBe(false)
    }
  )

  it.each(['0', '12.5', '-2', 100])('accepts a finite numeric input: %s', (value) => {
    expect(validateParameter(numericParameter, value)).toBe(true)
    expect(Number.isFinite(Number(formatParameterValue(numericParameter, value)))).toBe(true)
  })
})
