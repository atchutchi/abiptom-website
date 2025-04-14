export function PortfolioPreview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Website */}
      <div className="group overflow-hidden rounded-lg border">
        <div className="relative aspect-video overflow-hidden">
          <img
            alt="Website ARN"
            className="object-cover w-full h-full transition-all group-hover:scale-105"
            src="/images/portfolio/websites/arn.png"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold font-bauhaus">Website ARN</h3>
          <p className="text-sm text-gray-dark">
            Desenvolvimento de website institucional com sistema de gestão de conteúdo.
          </p>
        </div>
      </div>

      {/* Design Gráfico */}
      <div className="group overflow-hidden rounded-lg border">
        <div className="relative aspect-video overflow-hidden">
          <img
            alt="Bissau Rising - Banners"
            className="object-cover w-full h-full transition-all group-hover:scale-105"
            src="/images/portfolio/graphicdesign/bissaurising-banner.png"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold font-bauhaus">Bissau Rising</h3>
          <p className="text-sm text-gray-dark">
            Design de banners e materiais para redes sociais do fórum de investimentos.
          </p>
        </div>
      </div>

      {/* Vídeo */}
      <div className="group overflow-hidden rounded-lg border">
        <div className="relative aspect-video overflow-hidden">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/N_Oq4NavzGA"
            title="BISSAU RISING - Impact Investment & Trade Forum"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold font-bauhaus">BISSAU RISING</h3>
          <p className="text-sm text-gray-dark">
            Impact Investment & Trade Forum - Produção audiovisual do evento.
          </p>
        </div>
      </div>

      {/* Social Media */}
      <div className="group overflow-hidden rounded-lg border">
        <div className="relative aspect-video overflow-hidden">
          <img
            alt="Yunus Social Business"
            className="object-cover w-full h-full transition-all group-hover:scale-105"
            src="/images/portfolio/graphicdesign/ysb-design-social-media-1.jpg"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold font-bauhaus">Yunus Social Business</h3>
          <p className="text-sm text-gray-dark">
            Gestão de redes sociais e criação de conteúdo para organização social.
          </p>
        </div>
      </div>

      {/* Design Gráfico 2 */}
      <div className="group overflow-hidden rounded-lg border">
        <div className="relative aspect-video overflow-hidden">
          <img
            alt="Campanha MTN Boss"
            className="object-cover w-full h-full transition-all group-hover:scale-105"
            src="/images/portfolio/graphicdesign/campanha-boss-mtn-guine-bissau.jpg"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold font-bauhaus">Campanha MTN Boss</h3>
          <p className="text-sm text-gray-dark">
            Design para campanha publicitária da MTN Guiné-Bissau.
          </p>
        </div>
      </div>

      {/* Website 2 */}
      <div className="group overflow-hidden rounded-lg border">
        <div className="relative aspect-video overflow-hidden">
          <img
            alt="Website Hotel Uque"
            className="object-cover w-full h-full transition-all group-hover:scale-105"
            src="/images/portfolio/websites/hotel-uque.png"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold font-bauhaus">Website Hotel Uque</h3>
          <p className="text-sm text-gray-dark">
            Site com sistema de reservas e gestão hoteleira.
          </p>
        </div>
      </div>
    </div>
  )
} 