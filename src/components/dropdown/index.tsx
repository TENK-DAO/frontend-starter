import React from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as css from "./dropdown.module.css"

const Dropdown: React.FC<{
  trigger: React.ReactChild
  items: DropdownMenu.MenuItemProps[]
}> = ({ trigger, items }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className={`secondary ${css.trigger}`}>
        {trigger}
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className={css.content}>
        {items.map(({ className, ...props }, i) => (
          <DropdownMenu.Item
            key={i}
            className={`${css.item} ${className}`}
            {...props}
          />
        ))}
        <DropdownMenu.Arrow className={css.arrow} />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default Dropdown
