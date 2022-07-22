import React from "react"
import { styled, keyframes } from "@stitches/react"
import { blackA } from "@radix-ui/colors"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import * as css from "./spinner.module.css"
import { StaticImage } from "gatsby-plugin-image"

const overlayShow = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
})

const StyledOverlay = styled(DialogPrimitive.Overlay, {
  backgroundColor: blackA.blackA11,
  position: "fixed",
  inset: 0,
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
})

// Exports
export const Dialog = DialogPrimitive.Root
export const DialogContent = DialogPrimitive.Portal

const Spinner = () => {
  return (
    <Dialog open={true}>
      <DialogContent>
        <StyledOverlay />
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            marginTop: "-30px",
            marginLeft: "-35px",
            zIndex: 100,
          }}
        >
          <StaticImage
            className={css.cheddarSpinner}
            src="./cheddar.svg"
            alt="Cheddar Logo"
            height={60}
            width={60}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Spinner
