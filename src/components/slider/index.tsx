import React from "react"
import { Root, Track, Range, Thumb, SliderProps } from "@radix-ui/react-slider"
import * as css from "./slider.module.css"

const Dropdown: React.FC<SliderProps> = (props) => {
  return (
    <Root className={css.root} {...props}>
      <Track className={css.track}>
        <Range className={css.range} />
      </Track>
      <Thumb className={css.thumb}>
        {props.value}
      </Thumb>
    </Root>
  )
}

export default Dropdown
