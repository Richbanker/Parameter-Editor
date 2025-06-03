import * as React from 'react'
import ModelSelector from '../components/ModelSelector'
import ParamTable from '../components/ParamTable'
import useParamsStore from '../store/useParamsStore'

const EditorPage: React.FC = () => {
  const { selectedModel, updateParameter } = useParamsStore()

  const handleParameterChange = (paramId: string, value: string | number) => {
    if (selectedModel) {
      updateParameter(selectedModel.id, paramId, value)
    }
  }

  return (
    <div className="editor-page">
      <h1>Parameter Editor</h1>
      <ModelSelector />
      {selectedModel ? (
        <div className="editor-content">
          <h2>{selectedModel.name}</h2>
          <ParamTable
            parameters={selectedModel.parameters}
            onParameterChange={handleParameterChange}
          />
        </div>
      ) : (
        <p>Please select a model to edit its parameters</p>
      )}
    </div>
  )
}

export default EditorPage 