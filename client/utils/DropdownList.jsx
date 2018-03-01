import React from 'react'

const DropdownList = (props) => {
    console.log('props', props)
    return (
      <ul className = "items">
        {props.items ? props.items.map((item, idx) => {
          return (
            <li
              onClick = { () => {
              props.handleSelect(item)
              props.toggleShow(false)
              props.filterByGenre(item)
            }}
              className = "item"
              key = {idx}>{item}
            </li>
          )
        }) : null}
      </ul>
    )
}
export default DropdownList
