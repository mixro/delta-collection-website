const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

export const SearchIcon = (p) => (<svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>)
export const BagIcon = (p) => (<svg {...base} {...p}><path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>)
export const MenuIcon = (p) => (<svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h10" /></svg>)
export const CloseIcon = (p) => (<svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>)
export const ArrowRight = (p) => (<svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>)
export const ChevronDown = (p) => (<svg {...base} {...p}><path d="m6 9 6 6 6-6" /></svg>)
export const PlusIcon = (p) => (<svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>)
export const MinusIcon = (p) => (<svg {...base} {...p}><path d="M5 12h14" /></svg>)
export const CheckIcon = (p) => (<svg {...base} {...p}><path d="m5 12 5 5 9-10" /></svg>)
export const ShareIcon = (p) => (<svg {...base} {...p}><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4" /></svg>)
export const FilterIcon = (p) => (<svg {...base} {...p}><path d="M4 6h16M7 12h10M10 18h4" /></svg>)
export const SparkleIcon = (p) => (<svg {...base} {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" /></svg>)
export const ShieldIcon = (p) => (<svg {...base} {...p}><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>)
export const TruckIcon = (p) => (<svg {...base} {...p}><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg>)
export const ChatIcon = (p) => (<svg {...base} {...p}><path d="M4 5h16v11H9l-5 4V5Z" /></svg>)
export const InstagramIcon = (p) => (<svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" /></svg>)
export const PhoneIcon = (p) => (<svg {...base} {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>)
export const PinIcon = (p) => (<svg {...base} {...p}><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></svg>)
export const ClockIcon = (p) => (<svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>)
export const WhatsAppIcon = ({ width = 20, height = 20, ...p }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 8.23 8.24c0 4.54-3.7 8.23-8.22 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.22-.08-.39-.12-.55.13-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
  </svg>
)
