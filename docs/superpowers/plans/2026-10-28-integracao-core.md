# Integração do ABIPTOM Core

Plano aprovado na conversa de 28 de Outubro de 2026. Execução local por superpowers:executing-plans.

Objectivo: uma aplicação Next.js no repositório do site, com Login, /admin e /staff. Mostrar a versão de teste antes de publicar. Preservar bases, utilizadores, identificadores, anexos e histórico.

Arquitectura: grupos (public) e (core) com layouts raiz distintos. Código Core em core/ com imports @/core/. APIs originais mantidas porque não existem colisões. Credenciais Core com nomes próprios, separadas das do site. Uma só configuração Next.js, React 19 e compilação separada dos estilos Tailwind 3 e 4 para preservar a apresentação pública. Sem recriar ou migrar a base.

Restrições: nenhuma publicação de produção, alteração de domínio, execução de cron, seed ou migration nesta fase. Pré-visualização local sem credenciais de produção e sem operações externas. Sem bypass de autenticação. Sem prometer segurança absoluta. O projecto Vercel do site e a base de testes ainda têm de ser identificados antes da publicação de uma versão funcional ligada a dados.

Foco da revisão: pedidos anónimos às APIs, contas inactivas, privilégios manipulados, redireccionamentos externos, pedidos de outra origem e operações na pré-visualização. Sessões separadas do site. Headers privados sem cache. Logs sem segredos. Documentar testes com dados reais que ainda não forem possíveis.

1. Isolamento e base de referência. Worktree codex/integracao-core. Executar checks do site e unitários do Core. Guardar resultados no registo.
2. Integração. Reorganizar app/(public), app/(core), core/, APIs e assets. Compatibilizar dependências e compilar CSS Core separado. Acrescentar Login no cabeçalho. Testar build, tipos e regressão visual.
3. Segurança. Testes primeiro em checks/core-integration.test.ts e core/tests/unit/auth. Unificar proxy com autenticação validada, autorização nas APIs e acções, rejeição de redireccionamentos externos, origem e pré-visualização fechada. Seed indisponível. Cron exige segredo em todos os ambientes.
4. Verificação. Suite pública, unitários Core, lint, tipos, build, auditoria de dependências e navegador no servidor local. Testar navegação pública, Login, acessos anónimos e pedidos maliciosos sem escrever em serviços reais.
5. Entrega de teste. Abrir versão local e guardar capturas. Documentar configuração isolada, serviços a preservar, verificação de backup/restauro e passagem futura a produção. Manter projecto e repositório antigos. Publicar apenas após validação do utilizador.

Critério de passagem a produção: backup recuperável fora da produção, inventário/contagens antes e depois, testes autenticados por perfil em base isolada, emails e PDFs verificados, agendamentos únicos, identidade do projecto e domínio confirmadas e aprovação expressa da versão de teste.
