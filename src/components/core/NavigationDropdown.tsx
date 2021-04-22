import React, { FC, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { MassetName } from '../../types'
import { Dropdown } from './Dropdown'

export interface NavItem {
  title: string
  path: string
}

interface Props {
  items: NavItem[]
  massetName: MassetName
}

export const NavigationDropdown: FC<Props> = ({ items, massetName }) => {
  const history = useHistory()
  const [selected, setSelected] = useState<string | undefined>(undefined)

  const options = items.map(item => item.title)
  const tab: string | undefined = window.location.hash.split('/')[2]

  const defaultOption = options.find(option => option?.toLowerCase() === tab?.toLowerCase())

  const handleSelect = (selectedTitle?: string): void => {
    if (!selectedTitle) return

    setSelected(selectedTitle)

    const path = items.find(({ title }) => title === selectedTitle)?.path
    history.push(`/${massetName}${path}`)
  }

  const option = selected ?? defaultOption

  return option ? (
    <Dropdown onChange={handleSelect} options={Object.fromEntries([...options.map(v => [v, {}])])} defaultOption={option} />
  ) : null
}
