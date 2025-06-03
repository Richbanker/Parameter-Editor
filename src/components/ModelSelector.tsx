import * as React from 'react'
import useParamsStore from '../store/useParamsStore'
import { Model } from '../types/models'

const ModelSelector: React.FC = () => {
  const { models, selectedModel, setSelectedModel } = useParamsStore()

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const model = models.find((m) => m.id === event.target.value)
    if (model) {
      setSelectedModel(model)
    }
  }

  return (
    <div className="model-selector">
      <label htmlFor="model-select">Select Model:</label>
      <select
        id="model-select"
        value={selectedModel?.id || ''}
        onChange={handleModelChange}
      >
        <option value="">Select a model</option>
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ModelSelector 