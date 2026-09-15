import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import './Pill.css'

const Pill = forwardRef<HTMLSpanElement, ComponentPropsWithoutRef<'span'>>(
  function Pill({ className, ...rest }, ref) {
    return <span ref={ref} className={className ? `pill ${className}` : 'pill'} {...rest} />
  },
)

export default Pill
