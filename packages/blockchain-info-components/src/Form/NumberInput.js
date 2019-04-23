import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const BaseNumberInput = styled.input.attrs({
  type: 'number'
})`
  display: block;
  width: 100%;
  height: ${props => props.height};
  min-height: ${props => (props.minHeight ? props.minHeight : '40px')};
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: ${props => props.size || '14px'};
  font-weight: 400;
  color: ${props =>
    props.color ? props.theme[props.color] : props.theme['gray-5']};
  background-color: ${props => props.theme['white']};
  font-family: 'Montserrat', Helvetica, sans-serif;
  background-image: none;
  outline-width: 0;
  user-select: text;
  border-radius: 4px;
  border: 1px solid ${props => props.theme[props.borderColor]};
  border-right: ${props => (props.borderRightNone ? 'none' : '')};
  border-top: ${props => (props.borderTopNone ? 'none' : '')};
  cursor: ${props => props.disabled && 'not-allowed'};
  -moz-appearance: textfield;
  &::placeholder {
    color: ${props => props.theme['gray-3']};
    opacity: 0.4;
  }
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

const selectBorderColor = state => {
  switch (state) {
    case 'initial':
      return 'gray-2'
    case 'invalid':
      return 'error'
    case 'valid':
      return 'success'
    default:
      return 'gray-2'
  }
}

const NumberInput = props => {
  const { errorState, ...rest } = props
  const borderColor = selectBorderColor(errorState)

  return <BaseNumberInput borderColor={borderColor} {...rest} />
}

NumberInput.propTypes = {
  disabled: PropTypes.bool,
  height: PropTypes.string,
  minHeight: PropTypes.string,
  step: PropTypes.string
}

NumberInput.defaultProps = {
  disabled: false,
  height: '40px',
  minHeight: '40px',
  step: '0.01'
}

export default NumberInput
