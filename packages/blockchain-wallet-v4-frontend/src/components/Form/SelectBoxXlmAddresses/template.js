import React from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { SelectBox } from 'components/Form'

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  cursor: pointer;
  overflow-x: scroll;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
  }
  > div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`

const renderItem = item => (
  <ItemWrapper data-e2e='xlmAddressOption'>
    <Text weight={300} size='14px'>
      {item.text}
    </Text>
  </ItemWrapper>
)

export default props => (
  <SelectBox {...props} templateItem={renderItem} grouped />
)
