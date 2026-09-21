import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/*
 * Shared modal, wrapping Radix Dialog.
 *
 * The hand-rolled modals this replaces were a div with an onClick overlay.
 * That looks the same and behaves very differently: a keyboard user could
 * Tab straight through the dialog into the page behind it, Escape did
 * nothing, the background scrolled, and a screen reader was never told a
 * dialog had opened at all.
 *
 * Radix supplies the parts that are tedious and easy to get subtly wrong --
 * focus trap, focus restore to the trigger on close, Escape, scroll lock,
 * outside-click, and role/aria-modal wiring. Styling stays ours: the panel
 * still uses glass-strong and the same tokens, so nothing changes visually.
 *
 * forceMount + AnimatePresence is deliberate. Radix would otherwise unmount
 * the content the instant `open` flips false, and the exit animation would
 * never render.
 */
const Modal = ({
  open,
  onOpenChange,
  eyebrow,
  title,
  description,
  children,
  maxWidth = 'max-w-sm',
}) => {
  const reduce = useReducedMotion();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[200] bg-ink/70 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount>
              <motion.div
                initial={reduce ? false : { opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`fixed left-1/2 top-1/2 z-[201] w-[calc(100%-3rem)] ${maxWidth}
                            -translate-x-1/2 -translate-y-1/2 glass-strong rounded-2xl p-8
                            max-h-[85vh] overflow-y-auto focus:outline-none`}
              >
                {eyebrow && (
                  <p className="mono text-xs uppercase tracking-widest text-signal mb-2">{eyebrow}</p>
                )}

                {/* Radix requires a Title for the accessible name. */}
                <Dialog.Title className="text-2xl font-serif text-paper mb-4">
                  {title}
                </Dialog.Title>

                {description
                  ? <Dialog.Description className="text-mist text-sm mb-4">{description}</Dialog.Description>
                  /* No description is fine, but Radix warns unless told so explicitly. */
                  : <Dialog.Description className="sr-only">{title}</Dialog.Description>}

                {children}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export default Modal;
