import React from "react";
import { Button, Card } from "../components/ui";
import { PRIVACY_MESSAGES } from "../constants/privacy";

const features = [
  {
    icon: "◉",
    title: "Utilidade percebida",
    desc: "A IA realmente ajuda no seu dia a dia? Queremos entender o valor real.",
  },
  {
    icon: "◈",
    title: "Confiança e governança",
    desc: "Você confia nas recomendações? Elas seguem as políticas do banco?",
  },
  {
    icon: "◎",
    title: "Qualidade do contexto",
    desc: "Os dados do cliente estavam corretos e atualizados?",
  },
  {
    icon: "◆",
    title: "Adoção e jornada",
    desc: "Foi fácil usar? Encaixou na sua rotina sem atrapalhar?",
  },
  {
    icon: "◇",
    title: "Riscos e compliance",
    desc: "Algo pareceu errado, arriscado ou fora de conformidade?",
  },
  {
    icon: "⊕",
    title: "Backlog estruturado",
    desc: "Cada opinião vira insumo rastreável para a evolução do produto.",
  },
];

const areas = [
  "Assistente Virtual",
  "Análise de Vendas",
  "Resumo Global",
  "Central de Dados",
  "Jornada do Usuário",
  "APIs e Integrações",
  "Governança",
  "Performance",
];

export default function HomePage({ setPage }) {
  return (
    <div className="home">
      {}
      <section className="hero">
        <div className="hero__eyebrow">
          <span className="hero__tag">Plataforma Alpha</span>
        </div>
        <h1 className="hero__title">
          Sua opinião <br />
          <span className="hero__accent">vira evolução.</span>
        </h1>
        <p className="hero__lead">
          Este portal coleta feedbacks estruturados sobre as ferramentas de IA
          da Plataforma Alpha. Leva cerca de <strong>5 minutos</strong>{" "}
          e é completamente <strong>anônimo</strong>.
        </p>
        <p className="hero__sublead">
          Queremos ouvir de verdade: o que funciona, o que atrapalha e o que
          pode melhorar. Cada resposta gera métricas que orientam evolução do
          produto.
        </p>
        <div className="hero__actions">
          <Button onClick={() => setPage("form")} size="lg">
            Enviar meu feedback →
          </Button>
          <Button
            onClick={() => setPage("dashboard")}
            variant="ghost"
            size="lg"
          >
            Ver métricas do time
          </Button>
        </div>

        <div className="hero__privacy">
          <span className="hero__privacy-icon">⚐</span>
          {PRIVACY_MESSAGES.warning}
        </div>
      </section>

      {}
      <section className="features">
        <h2 className="features__title">O que capturamos</h2>
        <div className="features__grid">
          {features.map((f) => (
            <Card key={f.title} className="feature-card">
              <div className="feature-card__icon">{f.icon}</div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Areas */}
      <section className="areas">
        <h2 className="areas__title">Frentes avaliadas</h2>
        <div className="areas__list">
          {areas.map((a) => (
            <span key={a} className="area-tag">
              {a}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta__inner">
          <h2 className="cta__title">Pronto para contribuir?</h2>
          <p className="cta__desc">
            Sua experiência importa. O formulário é rápido, anônimo e cada
            resposta ajuda a melhorar as ferramentas que você usa no dia a dia.
          </p>
          <Button onClick={() => setPage("form")} size="lg">
            Começar agora →
          </Button>
        </div>
      </section>
    </div>
  );
}
