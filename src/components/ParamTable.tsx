import * as React from 'react'
import { Parameter } from '../types/models'
import ParamEditor from './ParamEditor'

interface ParamTableProps {
  parameters: Parameter[]
  onParameterChange: (paramId: string, value: string | number) => void
}

const ParamTable: React.FC<ParamTableProps> = ({ parameters, onParameterChange }) => {
  return (
    <table className="param-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Value</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {parameters.map((param) => (
          <tr key={param.id}>
            <td>{param.name}</td>
            <td>
              <ParamEditor
                parameter={param}
                onChange={(value) => onParameterChange(param.id, value)}
              />
            </td>
            <td>{param.type}</td>
            <td>{param.description || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ParamTable 