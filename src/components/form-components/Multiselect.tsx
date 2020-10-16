import React  from 'react'
import { Question } from '~/forms/types'
import { Box, Text } from 'grommet'
import './single-select.css'
import { useFormField } from '~/contexts/form'

interface Props {
  value: string[]
  question: Question
  onChange: (val: string[]) => void
  [key: string]: any
}

const Multiselect: React.FC<Props> = (props) => {
  const { question } = props
  const [ value, setValue ] = useFormField(question.id) as [string[] | string, any]

  const onSelectValue = (option: string) => {
    if (!value) {
      return setValue([option])
    }
    if (!Array.isArray(value)) {
      return setValue([value, option])
    }
    if (value.includes(option)) {
      return setValue(value.filter(val => val !== option))
    }

    setValue([...value, option])
  }

  if (!question || !question.options) {
    return <Box />
  }

  return (
    <Box>
      {question.options.map(o => {
        const isSelected = value && value.includes(o.id)
        return (
          <Box onClick={() => onSelectValue(o.id)} style={{ background: isSelected ? "#EBFFFA" : "white" }} align="start" key={o.id} margin={{ bottom: 'xsmall' }} pad='small' className="single-select" direction="row">
            <Box 
              style={{ 
                background: isSelected ? "#008060" : "white", 
                height: 44, 
                width: 44, 
                borderRadius: '50%', 
                flexShrink: 0,
                border: 'solid 2px rgba(0,0,0,0.15)',
                // margin-left: 0
              }} 
              margin={{ right: 'small' }} 
              className="single-select-border" 
            />
            <Text>{o.name}</Text>
          </Box>
        )
      })}
    </Box>
  )
}

export default Multiselect
