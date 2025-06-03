import * as React from 'react'
import { useState } from 'react'
import { Parameter } from '../types/models'
import { validateParameter, formatParameterValue } from '../utils/validators'

interface ParamEditorProps {
  parameter: Parameter
  onChange: (value: string | number) => void
}

const ParamEditor: React.FC<ParamEditorProps> = ({ parameter, onChange }) => {
  const [value, setValue] = useState<string | number>(parameter.value)
  const [error, setError] = useState<string>('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setValue(newValue)

    if (validateParameter(parameter, newValue)) {
      setError('')
      onChange(formatParameterValue(parameter, newValue))
    } else {
      setError(`Invalid ${parameter.type} value`)
    }
  }

  return (
    <div className="param-editor">
      <input
        type={parameter.type === 'number' ? 'number' : 'text'}
        value={value}
        onChange={handleChange}
        className={error ? 'error' : ''}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}

export default ParamEditor 