/**
 * Rodape — Footer da página
 *
 * Responsabilidades:
 *   • Identificação do site e localização
 *   • Links sociais em Space Mono com efeito magnético
 */

import { useRef } from 'react'
import { useMagnetic } from '../hooks/useMagnetic'

const ANO = new Date().getFullYear()

const LINKS = [
  { label: 'github',    href: 'https://github.com/MateusLima00',                    ariaLabel: 'GitHub' },
  { label: 'linkedin',  href: 'https://www.linkedin.com/in/mateus-costa-3b5960207/', ariaLabel: 'LinkedIn' },
  { label: 'instagram', href: '#',                                                   ariaLabel: 'Instagram' },
]

function Rodape() {
  const ref0 = useRef(null)
  const ref1 = useRef(null)
  const ref2 = useRef(null)

  useMagnetic(ref0, 0.25)
  useMagnetic(ref1, 0.25)
  useMagnetic(ref2, 0.25)

  const refs = [ref0, ref1, ref2]

  return (
    <footer className="rodape">
      <p className="rodape__identidade">
        <strong>devmateus.com</strong> — Fortaleza / CE · {ANO}
      </p>

      <ul className="rodape__links" aria-label="Redes sociais">
        {LINKS.map((link, i) => (
          <li key={link.label}>
            <a
              ref={refs[i]}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rodape__link"
              aria-label={link.ariaLabel}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  )
}

export default Rodape
