import React, { useState } from "react"
import { styled, keyframes } from "@stitches/react"
import { violet, blackA, mauve, green } from "@radix-ui/colors"
import { Cross2Icon } from "@radix-ui/react-icons"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { signIn } from "../../near"
import Spinner from "../spinner"

const overlayShow = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
})

const contentShow = keyframes({
  "0%": { opacity: 0, transform: "translate(-50%, -48%) scale(.96)" },
  "100%": { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
})

const StyledOverlay = styled(DialogPrimitive.Overlay, {
  backgroundColor: blackA.blackA9,
  position: "fixed",
  inset: 0,
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
})

const StyledContent = styled(DialogPrimitive.Content, {
  backgroundColor: "white",
  borderRadius: 6,
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: "450px",
  maxHeight: "85vh",
  padding: 25,
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
  "&:focus": { outline: "none" },
})

const StyledTitle = styled(DialogPrimitive.Title, {
  margin: 0,
  fontWeight: 500,
  color: mauve.mauve12,
  fontSize: 17,
})

const StyledDescription = styled(DialogPrimitive.Description, {
  margin: "10px 0 20px",
  color: mauve.mauve11,
  fontSize: 15,
  lineHeight: 1.5,
})

// Exports
export const Dialog = DialogPrimitive.Root
export const DialogContent = DialogPrimitive.Portal
export const DialogTitle = StyledTitle
export const DialogDescription = StyledDescription
export const DialogClose = DialogPrimitive.Close

// Your app...
const Flex = styled("div", { display: "flex" })
const Box = styled("div", {})

const IconButton = styled("button", {
  all: "unset",
  fontFamily: "inherit",
  borderRadius: "100%",
  height: 25,
  width: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: violet.violet11,
  position: "absolute",
  top: 10,
  right: 10,

  "&:hover": { backgroundColor: violet.violet4 },
  "&:focus": { boxShadow: `0 0 0 2px ${violet.violet7}` },
})

type Props = {
  showConnectModal: boolean
  setShowConnectModal: React.Dispatch<React.SetStateAction<boolean>>
}

const ConnectModal = ({ showConnectModal, setShowConnectModal }: Props) => {
  const [showSpinner, setShowSpinner] = useState(false)

  const handleClose = () => {
    setShowConnectModal(false)
  }

  const handleSignIn = () => {
    setShowSpinner(true)
    signIn()
  }

  return (
    <>
      {showSpinner && <Spinner />}
      <Dialog open={showConnectModal}>
        <DialogContent>
          <StyledOverlay />
          {!showSpinner && (
            <StyledContent>
              <DialogTitle>Error</DialogTitle>
              <DialogDescription>
                To mint a NFT you must first connect your wallet.
              </DialogDescription>
              <Flex css={{ marginTop: 25, justifyContent: "flex-end" }}>
                <button
                  className="secondary"
                  onClick={handleSignIn}
                  style={{ marginRight: "10px" }}
                >
                  Login with NEAR
                </button>
                <DialogClose asChild>
                  <button className="dark" onClick={handleClose}>
                    Close
                  </button>
                </DialogClose>
              </Flex>
            </StyledContent>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ConnectModal
