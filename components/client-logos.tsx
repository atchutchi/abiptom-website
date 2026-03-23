"use client"

import Image from "next/image"

const staticLogos = [
  { src: "/images/clients/unicef.svg", name: "UNICEF" },
  { src: "/images/clients/undp.svg", name: "UNDP" },
  { src: "/images/clients/unido.svg", name: "UNIDO" },
  { src: "/images/clients/governo_da_guine_bissau.svg", name: "Governo da Guiné-Bissau" },
  { src: "/images/clients/aldeas_sos.svg", name: "Aldeias SOS" },
  { src: "/images/clients/arn.svg", name: "ARN" },
  { src: "/images/clients/hotel_uaque.svg", name: "Hotel Uaque" },
  { src: "/images/clients/darling.svg", name: "Darling" },
  { src: "/images/clients/apbef_gb.svg", name: "APBEF" },
  { src: "/images/clients/amae.svg", name: "AMAE" },
  { src: "/images/clients/bioguinea.svg", name: "BioGuiné" },
  { src: "/images/clients/cica.svg", name: "CICA" },
  { src: "/images/clients/fundei.svg", name: "FUNDEI" },
  { src: "/images/clients/gbd.svg", name: "Guiné-Bissau Digital" },
  { src: "/images/clients/genesis.svg", name: "Génesis" },
  { src: "/images/clients/kau_criar.svg", name: "Kau Criar" },
  { src: "/images/clients/ligcca.svg", name: "LIGCCA" },
  { src: "/images/clients/mobiss.svg", name: "Mobiss" },
  { src: "/images/clients/nha_guinendadi.svg", name: "Nha Guinendadi" },
  { src: "/images/clients/papa_loca.svg", name: "Papa Loca" },
  { src: "/images/clients/rnep.svg", name: "RNEP" },
  { src: "/images/clients/tchico_te.svg", name: "Tchico Té" },
  { src: "/images/clients/ucb.svg", name: "UCB" },
  { src: "/images/clients/wacomp.svg", name: "WACOMP" },
  { src: "/images/clients/wefa.svg", name: "WEFA Natura" },
  { src: "/images/clients/afrochic.svg", name: "Afrochic" },
  { src: "/images/clients/aptrading.svg", name: "AP Trading" },
  { src: "/images/clients/agua_balur.svg", name: "Água Balur" },
  { src: "/images/clients/satyam.svg", name: "Satyam Travel" },
  { src: "/images/clients/convencao_cidada.svg", name: "Convenção Cidadã" },
  { src: "/images/clients/barbershop.svg", name: "Barbershop AOS" },
  { src: "/images/clients/apgb.svg", name: "APGB" },
  { src: "/images/clients/fogão_de_ouro.svg", name: "Fogão de Ouro" },
  { src: "/images/clients/gamela.svg", name: "Gamela" },
  { src: "/images/clients/inunde.svg", name: "Inundé" },
  { src: "/images/clients/france_lait.svg", name: "France Lait" },
  { src: "/images/clients/santo_global_group.svg", name: "Santo Global Group" },
  { src: "/images/clients/jardim_da_infancia_casa_mamã.svg", name: "Casa Mamã" },
]

const LOGO_WIDTH = 140

export function ClientLogos() {
  const duplicated = [...staticLogos, ...staticLogos]
  const trackWidth = duplicated.length * LOGO_WIDTH

  return (
    <div className="relative w-full overflow-hidden py-8">
      <div
        className="flex animate-crawling-line"
        style={{
          width: `${trackWidth}px`,
          ["--crawl-duration" as string]: `${staticLogos.length * 1.2}s`,
        }}
      >
        {duplicated.map((logo, index) => (
          <div
            key={`${logo.name}-${index}`}
            className="flex items-center justify-center px-6"
            style={{ flex: `0 0 ${LOGO_WIDTH}px` }}
          >
            <Image
              alt={logo.name}
              className="max-h-10 md:max-h-14 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity duration-obys grayscale hover:grayscale-0"
              src={logo.src}
              width={100}
              height={56}
              loading="lazy"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.visibility = "hidden"
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
