import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Barlow+Condensed:wght@700;800;900&display=swap');`;

const STYLES = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }

  .wr { font-family: 'Space Grotesk', sans-serif; background: #08000F; color: #EDE8F5; overflow-x: hidden; position: relative; }

  /* noise texture overlay for premium feel */
  .noise {
    position: fixed; inset: 0; z-index: 1; pointer-events: none;
    opacity: 0.025; mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  /* scroll progress bar */
  .progress-bar {
    position: fixed; top: 0; left: 0; height: 2px;
    background: linear-gradient(90deg, #F0B429, #BFEF45);
    z-index: 200; transition: width 0.1s linear;
  }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 20px 5vw; display: flex; justify-content: space-between; align-items: center;
    transition: background 0.4s, border-color 0.4s, padding 0.3s;
    border-bottom: 1px solid transparent;
  }
  .nav.scrolled { background: rgba(8,0,15,0.92); backdrop-filter: blur(20px); border-bottom-color: rgba(196,139,255,0.1); padding: 14px 5vw; }
  .nav-links { display: flex; gap: 36px; align-items: center; }
  .nav-link {
    font-size: 12.5px; color: #8A6FAA; letter-spacing: 0.04em; cursor: pointer;
    transition: color 0.2s; position: relative;
  }
  .nav-link:hover { color: #EDE8F5; }
  @media(max-width: 860px) { .nav-links-text { display: none; } }
  .nav-cta {
    background: transparent; border: 1px solid #C48BFF; color: #C48BFF;
    font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase; padding: 11px 24px; cursor: pointer;
    transition: all 0.25s;
  }
  .nav-cta:hover { background: #C48BFF; color: #08000F; box-shadow: 0 0 24px rgba(196,139,255,0.35); }

  /* HERO */
  .hero {
    position: relative; min-height: 100vh;
    display: flex; flex-direction: column; justify-content: center;
    padding: 120px 5vw 60px; overflow: hidden;
  }
  .grid-bg {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(150,80,240,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(150,80,240,0.06) 1px, transparent 1px);
    background-size: 52px 52px; pointer-events: none;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 100%);
  }
  .hero-orb {
    position: absolute; border-radius: 50%; filter: blur(130px); pointer-events: none;
    animation: orbpulse 7s ease-in-out infinite;
  }
  .orb1 { width: 700px; height: 700px; background: #3D0870; top: -180px; right: -120px; opacity: 0.38; }
  .orb2 { width: 380px; height: 380px; background: #12003A; bottom: -60px; left: -80px; opacity: 0.55; animation-delay: 3.5s; }
  @keyframes orbpulse { 0%,100%{transform:scale(1);opacity:0.38;} 50%{transform:scale(1.1);opacity:0.55;} }

  .eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 10.5px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase;
    color: #BFEF45; margin-bottom: 30px;
  }
  .eyebrow-line { width: 28px; height: 1px; background: #BFEF45; }

  .hero-headline {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(58px, 9vw, 132px);
    font-weight: 900; line-height: 0.9; letter-spacing: -0.01em;
    color: #EDE8F5; max-width: 920px;
  }
  .hero-headline .hl-gold { color: #F0B429; }
  .hero-headline .hl-outline { -webkit-text-stroke: 2px rgba(237,232,245,0.45); color: transparent; }

  .hero-sub {
    margin-top: 28px; font-size: clamp(15px, 1.6vw, 18px); font-weight: 400;
    color: #8A6FAA; max-width: 520px; line-height: 1.72;
  }
  .hero-ctas { display: flex; gap: 14px; margin-top: 42px; flex-wrap: wrap; align-items: center; }

  .btn-primary {
    background: linear-gradient(135deg, #F0B429, #E8940A);
    color: #08000F; font-family: 'Space Grotesk', sans-serif;
    font-size: 13px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 17px 38px; border: none; cursor: pointer; transition: all 0.25s;
    clip-path: polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));
  }
  .btn-primary:hover { background: linear-gradient(135deg,#BFEF45,#9ED100); transform: translateY(-2px); box-shadow: 0 10px 36px rgba(240,180,41,0.32); }
  .btn-ghost {
    background: transparent; color: #EDE8F5;
    font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 500;
    letter-spacing: 0.07em; padding: 16px 34px;
    border: 1px solid rgba(237,232,245,0.18); cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; gap: 8px;
  }
  .btn-ghost:hover { border-color: #C48BFF; color: #C48BFF; }

  /* hero stat strip */
  .hero-stats {
    display: flex; gap: 44px; margin-top: 64px; flex-wrap: wrap;
    padding-top: 32px; border-top: 1px solid rgba(196,139,255,0.1);
    max-width: 700px;
  }
  .hero-stat-num {
    font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
    font-size: 34px; color: #F0B429; line-height: 1;
  }
  .hero-stat-label { font-size: 11px; color: #5E4178; letter-spacing: 0.04em; margin-top: 6px; }

  .hero-badge {
    position: absolute; bottom: 36px; right: 5vw;
    display: flex; flex-direction: column; align-items: flex-end; gap: 4px;
  }
  .hero-badge-line { width: 1px; height: 44px; background: linear-gradient(to bottom,transparent,#3D1A5E); margin-left: auto; }
  .hero-badge-text { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #3D1A5E; }

  /* TICKER */
  .ticker-wrap { background: #F0B429; overflow: hidden; padding: 13px 0; position: relative; z-index: 2; }
  .ticker-inner { display: flex; animation: ticker 20s linear infinite; width: max-content; }
  .ticker-item {
    font-family: 'Barlow Condensed', sans-serif; font-weight: 800;
    font-size: 17px; letter-spacing: 0.12em; color: #08000F; padding: 0 36px; white-space: nowrap;
    display: flex; align-items: center; gap: 36px;
  }
  @keyframes ticker { from{transform:translateX(0);} to{transform:translateX(-50%);} }

  /* COMMON */
  .section { padding: 130px 5vw; position: relative; z-index: 2; }
  .section-label {
    font-size: 10.5px; font-weight: 700; letter-spacing: 0.26em; text-transform: uppercase;
    color: #BFEF45; margin-bottom: 18px; display: flex; align-items: center; gap: 10px;
  }
  .section-label::before { content:''; display:block; width:22px; height:1px; background:#BFEF45; }
  .section-title {
    font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
    font-size: clamp(38px, 5.2vw, 72px); line-height: 0.95; color: #EDE8F5;
  }
  .section-title .gold { color: #F0B429; }
  .divider { width:100%; height:1px; background: linear-gradient(90deg,transparent,#1E0840,transparent); position: relative; z-index: 2; }

  /* DORES */
  .dores-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(250px,1fr)); gap: 1px; margin-top: 56px; background: #1E0840; }
  .dor-card {
    background: #0B0118; padding: 36px 30px;
    border-top: 2px solid transparent; transition: border-color 0.3s, background 0.3s;
  }
  .dor-card:hover { border-top-color: #F0B429; background: #110126; }
  .dor-icon { font-size: 26px; margin-bottom: 18px; display: block; }
  .dor-title { font-size: 15px; font-weight: 700; color: #EDE8F5; margin-bottom: 9px; }
  .dor-text { font-size: 13.5px; color: #6A4A84; line-height: 1.72; }

  /* COMPARAÇÃO */
  .compare-wrap { background: #060010; }
  .compare-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 1px; margin-top: 56px;
    background: #1E0840; border: 1px solid #1E0840;
  }
  @media(max-width: 720px) { .compare-grid { grid-template-columns: 1fr; } }
  .compare-col { background: #0B0118; padding: 44px 38px; }
  .compare-col.highlight { background: linear-gradient(155deg, #160230, #0B0118); position: relative; }
  .compare-col.highlight::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #F0B429, #BFEF45);
  }
  .compare-head { font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-size: 26px; margin-bottom: 28px; }
  .compare-head.muted { color: #4A2E66; }
  .compare-head.gold { color: #F0B429; }
  .compare-list { list-style: none; display: flex; flex-direction: column; gap: 16px; }
  .compare-list li { font-size: 14px; line-height: 1.55; display: flex; align-items: flex-start; gap: 12px; }
  .compare-list.muted li { color: #5E4178; }
  .compare-list.gold li { color: #C8B8DC; }
  .compare-mark { flex-shrink: 0; font-size: 14px; line-height: 1.5; }
  .compare-mark.x { color: #5E2A4A; }
  .compare-mark.check { color: #BFEF45; }

  /* ECOSSISTEMA */
  .eco-wrap { background: #060010; position: relative; }
  .eco-header-row {
    display: flex; justify-content: space-between; align-items: flex-end;
    flex-wrap: wrap; gap: 24px; margin-bottom: 56px;
  }
  .eco-header-desc { font-size: 14.5px; color: #6A4A84; max-width: 400px; line-height: 1.72; }

  .eco-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; position: relative; background: #1E0840; }
  @media(max-width: 680px) { .eco-grid { grid-template-columns: 1fr; } }

  .eco-center {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 68px; height: 68px; background: #0D001E; border: 1px solid #3D1A6A;
    display: flex; align-items: center; justify-content: center; z-index: 4;
    clip-path: polygon(50% 0%,100% 50%,50% 100%,0% 50%);
  }
  @media(max-width: 680px) { .eco-center { display: none; } }

  .eco-card {
    background: linear-gradient(155deg, #110022, #08000F);
    padding: 40px 34px 36px; position: relative; overflow: hidden;
    transition: background 0.35s, transform 0.35s;
  }
  .eco-card:hover { background: linear-gradient(155deg, #16002C, #0A0014); transform: scale(1.012); z-index: 2; }
  .eco-card::before {
    content: ''; position: absolute; width: 44px; height: 2px;
    background: linear-gradient(90deg, #F0B429, transparent); top: 0; left: 0;
  }
  .eco-card.flip::before { left: auto; right: 0; background: linear-gradient(270deg, #F0B429, transparent); }

  .eco-num {
    font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
    font-size: 76px; color: #160030; position: absolute;
    bottom: 10px; right: 18px; line-height: 1; user-select: none; pointer-events: none;
  }
  .eco-tag {
    display: inline-block; font-size: 9.5px; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: #BFEF45; background: rgba(191,239,69,0.07); padding: 3px 9px; margin-bottom: 14px;
  }
  .eco-title {
    font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
    font-size: 38px; color: #EDE8F5; line-height: 1; margin-bottom: 10px;
  }
  .eco-desc { font-size: 13.5px; color: #6A4A84; line-height: 1.68; margin-bottom: 20px; }
  .eco-items { list-style: none; display: flex; flex-direction: column; gap: 7px; }
  .eco-items li { font-size: 12.5px; color: #9A7AB4; display: flex; align-items: center; gap: 8px; }
  .eco-items li::before { content:''; display:block; width:3px; height:3px; background:#F0B429; border-radius:50%; flex-shrink:0; }

  /* PROOF */
  .proof-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(190px,1fr)); gap: 1px; margin-top: 52px; background: #1E0840; }
  .proof-card {
    background: #0B0118; padding: 42px 28px; text-align: center;
    border-bottom: 3px solid transparent; transition: border-color 0.3s, background 0.3s;
  }
  .proof-card:hover { border-bottom-color: #F0B429; background: #110126; }
  .proof-number {
    font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
    font-size: 68px; color: #F0B429; line-height: 1; margin-bottom: 8px;
  }
  .proof-label { font-size: 12.5px; color: #6A4A84; letter-spacing: 0.04em; }

  /* TESTIMONIAL */
  .testi-wrap { background: #0B0118; }
  .testi-quote-mark {
    font-family: 'Barlow Condensed', sans-serif; font-size: 120px; font-weight: 900;
    color: #1E0840; line-height: 0.5; margin-bottom: 8px;
  }
  .testi-text {
    font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
    font-size: clamp(24px, 3vw, 38px); line-height: 1.3; color: #EDE8F5; max-width: 820px;
  }
  .testi-author { margin-top: 32px; display: flex; align-items: center; gap: 14px; }
  .testi-avatar {
    width: 44px; height: 44px; border-radius: 50%;
    background: linear-gradient(135deg, #C48BFF, #6E2FB8);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-size: 18px; color: #08000F;
  }
  .testi-name { font-size: 14px; font-weight: 700; color: #EDE8F5; }
  .testi-role { font-size: 12.5px; color: #6A4A84; }

  /* STEPS */
  .steps { display: grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap: 1px; margin-top: 56px; background: #1E0840; }
  .step {
    padding: 50px 38px; background: #0B0118; position: relative;
    border-left: 3px solid transparent; transition: border-left-color 0.3s, background 0.3s;
  }
  .step:hover { border-left-color: #F0B429; background: #110126; }
  .step-num {
    font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
    font-size: 86px; color: #130028; line-height: 1; margin-bottom: 14px;
  }
  .step-title { font-size: 19px; font-weight: 700; color: #EDE8F5; margin-bottom: 11px; }
  .step-desc { font-size: 13.5px; color: #6A4A84; line-height: 1.72; }

  /* FAQ */
  .faq-wrap { background: #060010; }
  .faq-list { margin-top: 56px; max-width: 760px; }
  .faq-item { border-bottom: 1px solid #1E0840; }
  .faq-q {
    padding: 26px 4px; display: flex; justify-content: space-between; align-items: center;
    cursor: pointer; font-size: 15.5px; font-weight: 600; color: #EDE8F5; gap: 20px;
  }
  .faq-q-icon { color: #F0B429; font-size: 20px; flex-shrink: 0; transition: transform 0.3s; font-weight: 300; }
  .faq-a {
    max-height: 0; overflow: hidden; transition: max-height 0.35s ease, padding 0.35s ease;
    font-size: 14px; color: #6A4A84; line-height: 1.72;
  }
  .faq-a.open { max-height: 200px; padding-bottom: 26px; }

  /* CTA FINAL */
  .cta-final { background: #060010; padding: 140px 5vw; text-align: center; position: relative; overflow: hidden; }
  .cta-orb {
    position: absolute; width: 600px; height: 600px; background: #3D0870;
    border-radius: 50%; filter: blur(160px);
    top: 50%; left: 50%; transform: translate(-50%,-50%); opacity: 0.22; pointer-events: none;
  }
  .cta-headline {
    font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
    font-size: clamp(42px, 6vw, 92px); line-height: 0.92;
    color: #EDE8F5; max-width: 720px; margin: 0 auto 28px; position: relative;
  }
  .cta-sub { font-size: 16px; color: #6A4A84; max-width: 460px; margin: 0 auto 46px; line-height: 1.7; position: relative; }
  .cta-micro { margin-top: 30px; font-size: 11px; color: #2E0D52; letter-spacing: 0.1em; text-transform: uppercase; position: relative; }

  /* FOOTER */
  .footer {
    background: #04000A; padding: 48px 5vw;
    display: flex; justify-content: space-between; align-items: center;
    border-top: 1px solid #0F0022; flex-wrap: wrap; gap: 16px; position: relative; z-index: 2;
  }
  .footer-tagline { font-size: 11.5px; color: #2E0D52; letter-spacing: 0.08em; text-transform: uppercase; }
  .footer-copy { font-size: 11px; color: #1A0533; }

  .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.65s ease, transform 0.65s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }
`;

const WepexLogo = ({ size = 36 }) => (
  <svg width={size * 2.2} height={size} viewBox="0 0 220 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wg" x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#D0D8FF"/>
        <stop offset="45%" stopColor="#A78BFA"/>
        <stop offset="100%" stopColor="#8B5CF6"/>
      </linearGradient>
    </defs>
    <text x="0" y="52" fontFamily="'Barlow Condensed', sans-serif" fontWeight="900" fontSize="62" fill="url(#wg)" letterSpacing="2">wepex</text>
  </svg>
);

const ecossistema = [
  {
    num:"01", tag:"Base", title:"Narrativa", flip:false,
    desc:"Construímos o porquê da sua marca — a história que faz o cliente escolher você antes mesmo de comparar preço.",
    items:["Diagnóstico de marca","Posicionamento de nicho","Identidade verbal e visual","Diferenciação competitiva"],
  },
  {
    num:"02", tag:"Estrutura", title:"Posicionamento", flip:true,
    desc:"Definimos onde e como sua marca aparece no digital para ocupar o espaço de referência na mente do cliente.",
    items:["Arquitetura de perfil","Estratégia de plataforma","Benchmarking e gaps","Autoridade de conteúdo"],
  },
  {
    num:"03", tag:"Presença", title:"Conteúdo", flip:false,
    desc:"Produzimos conteúdo com estratégia — cada peça tem uma função dentro do sistema, não é post por post.",
    items:["Calendário editorial mensal","Reels, carrosséis, stories","Drone e produção premium","Roteiros e direção criativa"],
  },
  {
    num:"04", tag:"Crescimento", title:"Escala", flip:true,
    desc:"Tráfego pago é a cereja. Com posicionamento sólido, cada real investido em anúncio rende exponencialmente mais.",
    items:["Meta Ads e Google Ads","Gestão orientada por dados","Relatórios de performance","Otimização contínua"],
  },
];

const dores = [
  { icon:"👻", title:"Sua marca é invisível", text:"Concorrentes menores aparecem mais e vendem mais. Não por terem produto melhor — por terem posicionamento." },
  { icon:"💸", title:"Tráfego pago que não converte", text:"Rodar anúncio sem narrativa é queimar dinheiro. O problema não é o orçamento — é a ausência de estratégia." },
  { icon:"🔁", title:"Conteúdo sem propósito", text:"Postar por postar não gera autoridade. Cada peça precisa ter uma função dentro de um sistema maior." },
  { icon:"📉", title:"Sem previsibilidade de receita", text:"Vendas irregulares, clientes sazonais, dependência de indicação. Um sistema de posicionamento muda isso." },
];

const compareGenerico = [
  "Posta porque \"tem que postar\"",
  "Roda anúncio sem narrativa por trás",
  "Não existe método, é tentativa e erro",
  "Você não sabe por que algo funcionou",
  "Relação de fornecedor — entrega e some",
];

const compareWepex = [
  "Cada peça de conteúdo tem função no sistema",
  "Tráfego pago validado por posicionamento sólido",
  "Método documentado, replicável, com dados",
  "Você entende exatamente o que gerou resultado",
  "Relação de parceria estratégica contínua",
];

const steps = [
  { num:"01", title:"Diagnóstico Estratégico", desc:"Mapeamos sua marca, mercado e concorrentes. Identificamos o gap entre onde você está e onde deveria estar posicionado." },
  { num:"02", title:"Construção do Ecossistema", desc:"Desenvolvemos narrativa, posicionamento, conteúdo e estrutura de tráfego como um sistema integrado e único." },
  { num:"03", title:"Execução e Escala", desc:"Operamos o sistema mês a mês, com dados reais, ajustes contínuos e relatórios. Você acompanha tudo." },
];

const faqs = [
  { q: "Isso substitui minha equipe de marketing interna?", a: "Não substitui — potencializa. Atuamos como o cérebro estratégico por trás da execução, seja ela feita por você, sua equipe ou nós mesmos." },
  { q: "Funciona para qualquer tipo de negócio?", a: "Funciona para qualquer marca que venda um produto ou serviço e precise ser a escolha óbvia no mercado em que atua, independente do nicho." },
  { q: "Quanto tempo até ver resultado?", a: "Narrativa e posicionamento começam a gerar percepção nas primeiras semanas. Resultados em tráfego e conversão são mensuráveis a partir do primeiro mês de operação." },
  { q: "Preciso ter verba de anúncio desde o início?", a: "Não. Construímos a base de narrativa e posicionamento primeiro — o tráfego pago entra como camada final, quando o terreno já está preparado para converter." },
];

const tickers = ["Narrativa","★","Posicionamento","★","Conteúdo","★","Escala","★","Wepex Estratégias Digitais","★"];

export default function WepexLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 60);
      const h = document.documentElement;
      const scrollPct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      setProgress(scrollPct || 0);
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => document.getElementById(id).scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <style>{FONTS}</style>
      <style>{STYLES}</style>
      <div className="wr">
        <div className="noise" />
        <div className="progress-bar" style={{ width: `${progress}%` }} />

        {/* NAV */}
        <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
          <WepexLogo size={28} />
          <div className="nav-links">
            <span className="nav-link nav-links-text" onClick={() => scrollTo("eco")}>Ecossistema</span>
            <span className="nav-link nav-links-text" onClick={() => scrollTo("compare")}>Diferencial</span>
            <span className="nav-link nav-links-text" onClick={() => scrollTo("faq")}>FAQ</span>
            <button className="nav-cta" onClick={() => scrollTo("cta")}>Quero Posicionamento</button>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="grid-bg" />
          <div className="hero-orb orb1" />
          <div className="hero-orb orb2" />
          <div style={{ position:"relative", zIndex:2 }}>
            <div className="eyebrow">
              <span className="eyebrow-line" />
              Posicionamento Estratégico Digital
            </div>
            <h1 className="hero-headline">
              Sua marca<br />
              ou é <span className="hl-gold">referência.</span><br />
              Ou é <span className="hl-outline">esquecida.</span>
            </h1>
            <p className="hero-sub">
              A Wepex constrói o ecossistema completo — da narrativa ao tráfego pago — que transforma qualquer negócio em autoridade no digital.
            </p>
            <div className="hero-ctas">
              <button className="btn-primary" onClick={() => scrollTo("cta")}>Quero ser referência</button>
              <button className="btn-ghost" onClick={() => scrollTo("eco")}>
                Ver o ecossistema
                <span style={{ fontSize: 16 }}>→</span>
              </button>
            </div>

            <div className="hero-stats">
              <div>
                <div className="hero-stat-num">8+</div>
                <div className="hero-stat-label">MARCAS ATIVAS</div>
              </div>
              <div>
                <div className="hero-stat-num">4</div>
                <div className="hero-stat-label">PILARES INTEGRADOS</div>
              </div>
              <div>
                <div className="hero-stat-num">100%</div>
                <div className="hero-stat-label">ESTRATÉGIA DOCUMENTADA</div>
              </div>
            </div>
          </div>
          <div className="hero-badge">
            <div className="hero-badge-line" />
            <div className="hero-badge-text">Role para explorar</div>
          </div>
        </section>

        {/* TICKER */}
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[...tickers, ...tickers].map((t, i) => <span key={i} className="ticker-item">{t}</span>)}
          </div>
        </div>

        {/* DORES */}
        <section className="section">
          <div className="reveal">
            <div className="section-label">O problema real</div>
            <h2 className="section-title">O que está custando caro<br /><span className="gold">agora mesmo</span></h2>
          </div>
          <div className="dores-grid">
            {dores.map((d, i) => (
              <div key={i} className="dor-card reveal" style={{ transitionDelay:`${i*80}ms` }}>
                <span className="dor-icon">{d.icon}</span>
                <div className="dor-title">{d.title}</div>
                <div className="dor-text">{d.text}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* COMPARAÇÃO */}
        <section className="section compare-wrap" id="compare">
          <div className="reveal">
            <div className="section-label">O diferencial</div>
            <h2 className="section-title">Agência genérica<br /><span className="gold">vs. parceiro estratégico</span></h2>
          </div>
          <div className="compare-grid reveal" style={{ transitionDelay: "100ms" }}>
            <div className="compare-col">
              <div className="compare-head muted">Agência de tráfego comum</div>
              <ul className="compare-list muted">
                {compareGenerico.map((t, i) => (
                  <li key={i}><span className="compare-mark x">✕</span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="compare-col highlight">
              <div className="compare-head gold">Wepex</div>
              <ul className="compare-list gold">
                {compareWepex.map((t, i) => (
                  <li key={i}><span className="compare-mark check">✓</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ECOSSISTEMA */}
        <section className="section eco-wrap" id="eco">
          <div className="eco-header-row reveal">
            <div>
              <div className="section-label">O sistema Wepex</div>
              <h2 className="section-title">Um ecossistema.<br /><span className="gold">Resultado completo.</span></h2>
            </div>
            <p className="eco-header-desc">
              Não vendemos serviços avulsos. Cada camada potencializa a anterior — e o tráfego pago vira prova numérica do posicionamento.
            </p>
          </div>

          <div className="eco-grid reveal" style={{ transitionDelay:"100ms" }}>
            <div className="eco-center">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path d="M13 2 L24 13 L13 24 L2 13Z" stroke="#C48BFF" strokeWidth="1.2" fill="none"/>
                <circle cx="13" cy="13" r="3" fill="#F0B429"/>
              </svg>
            </div>
            {ecossistema.map((card, i) => (
              <div key={i} className={`eco-card reveal ${card.flip ? "flip" : ""}`} style={{ transitionDelay:`${i*100+120}ms` }}>
                <div className="eco-num">{card.num}</div>
                <div className="eco-tag">{card.tag}</div>
                <div className="eco-title">{card.title}</div>
                <div className="eco-desc">{card.desc}</div>
                <ul className="eco-items">
                  {card.items.map((it, j) => <li key={j}>{it}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* PROOF */}
        <section className="section">
          <div className="reveal">
            <div className="section-label">Números reais</div>
            <h2 className="section-title">Resultados que<br /><span className="gold">falam por si.</span></h2>
          </div>
          <div className="proof-grid reveal" style={{ transitionDelay:"120ms" }}>
            {[
              { num:"8+", label:"Marcas gerenciadas ativamente" },
              { num:"4×", label:"Pilares integrados por cliente" },
              { num:"100%", label:"Clientes com estratégia documentada" },
              { num:"∞", label:"Resultado composto mês a mês" },
            ].map((p, i) => (
              <div key={i} className="proof-card">
                <div className="proof-number">{p.num}</div>
                <div className="proof-label">{p.label}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* TESTIMONIAL */}
        <section className="section testi-wrap">
          <div className="reveal">
            <div className="testi-quote-mark">"</div>
            <p className="testi-text">
              Antes a gente postava sem direção. Hoje cada conteúdo tem um motivo, e o resultado em cliente novo apareceu de um jeito que eu não esperava.
            </p>
            <div className="testi-author">
              <div className="testi-avatar">M</div>
              <div>
                <div className="testi-name">Cliente Wepex</div>
                <div className="testi-role">Negócio local · Brejo Paraibano</div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* COMO FUNCIONA */}
        <section className="section">
          <div className="reveal">
            <div className="section-label">O processo</div>
            <h2 className="section-title">Como a Wepex<br /><span className="gold">transforma</span><br />seu negócio</h2>
          </div>
          <div className="steps">
            {steps.map((s, i) => (
              <div key={i} className="step reveal" style={{ transitionDelay:`${i*120}ms` }}>
                <div className="step-num">{s.num}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* FAQ */}
        <section className="section faq-wrap" id="faq">
          <div className="reveal">
            <div className="section-label">Perguntas frequentes</div>
            <h2 className="section-title">Antes de decidir,<br /><span className="gold">esclareça.</span></h2>
          </div>
          <div className="faq-list reveal" style={{ transitionDelay: "100ms" }}>
            {faqs.map((f, i) => (
              <div key={i} className="faq-item">
                <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  {f.q}
                  <span className="faq-q-icon" style={{ transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
                </div>
                <div className={`faq-a ${openFaq === i ? "open" : ""}`}>{f.a}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="cta-final" id="cta">
          <div className="cta-orb" />
          <div className="reveal" style={{ position:"relative" }}>
            <div className="section-label" style={{ justifyContent:"center" }}>Próximo passo</div>
            <h2 className="cta-headline">
              Sua marca precisa<br />de um parceiro<br />
              <span style={{ color:"#F0B429" }}>estratégico.</span>
            </h2>
            <p className="cta-sub">
              Não de mais um fornecedor de post. De um sistema que constrói posicionamento real e converte em receita.
            </p>
            <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", position:"relative" }}>
              <button
                className="btn-primary"
                style={{ fontSize:15, padding:"18px 52px" }}
                onClick={() => window.open("https://wa.me/5583999999999?text=Olá! Quero saber mais sobre o posicionamento Wepex.", "_blank")}
              >
                Falar com a Wepex
              </button>
            </div>
            <p className="cta-micro">Diagnóstico gratuito · Sem fidelidade forçada · Resultados documentados</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <WepexLogo size={22} />
          <div className="footer-tagline">Posicionamento · Conteúdo · Tráfego Pago</div>
          <div className="footer-copy">© 2025 Wepex Estratégias Digitais</div>
        </footer>

      </div>
    </>
  );
}
