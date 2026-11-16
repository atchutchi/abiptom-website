'use client';

import Image from 'next/image';
import { useState, type MouseEvent, type FormEvent } from 'react';
import { ArrowUpRight, SlidersHorizontal, Check, Loader2, Download } from 'lucide-react-core';
import { AdminSurface } from '@/core/components/layout/AdminSurface';
import { Sidebar } from '@/core/components/layout/Sidebar';
import { DashboardView } from '@/core/components/dashboard/DashboardView';
import { ReportsView } from '@/core/components/reports/ReportsView';
import { UsersTable } from '@/core/components/users/UsersTable';
import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { Badge } from '@/core/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/core/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/core/components/ui/select';
import { demoStats, demoReport, demoMonthlyReport, demoUsers } from './admin-fixtures';

export function AdminDesignReview() {
  const [section, setSection] = useState('Painel');
  const [activePath, setActivePath] = useState('/admin/dashboard');
  const [notice, setNotice] = useState('');
  const [empty, setEmpty] = useState(false);
  const [periodo, setPeriodo] = useState<'mensal' | 'trimestral'>('trimestral');

  function navigate(event: MouseEvent<HTMLDivElement>) {
    const anchor = (event.target as HTMLElement).closest('a');
    if (!anchor) return;
    event.preventDefault();
    const href = anchor.getAttribute('href') ?? '';
    if (href.startsWith('/api/')) { setNotice('A exportação está desactivada nesta demonstração.'); return; }
    setActivePath(href.split('?')[0]);
    if (href.includes('reports')) setSection('Relatórios');
    else if (href === '/admin/users') setSection('Utilizadores');
    else if (href.includes('dashboard')) setSection('Painel');
    else { setSection('Componentes'); setNotice('Exemplo visual. As operações reais continuam disponíveis apenas na aplicação autenticada.'); }
  }

  function submit(event: FormEvent<HTMLDivElement>) {
    const form = event.target as HTMLFormElement;
    if (!form.querySelector('[name="periodo"]')) return;
    event.preventDefault();
    const data = new FormData(form);
    setPeriodo(data.get('periodo') === 'mensal' ? 'mensal' : 'trimestral');
    setNotice('Os filtros estão a mostrar uma amostra fictícia. Nenhuma consulta de produção foi executada.');
  }

  const stats = empty ? { ...demoStats, facturasAbertas: { count: 0, totalXof: 0 }, facturasVencidas: { count: 0, totalXof: 0 }, ultimasFacturas: [], projectosActivos: 0, clientesActivos: 0, facturadoMes: 0, recebidoMes: 0, despesasMes: 0, dividendosPagosMes: 0, folhaMes: { ...demoStats.folhaMes, totalLiquido: 0, estado: null }, saldoGlobalMes: 0, saldoAcumuladoTrimestre: 0 } : demoStats;

  return (
    <AdminSurface onClickCapture={navigate} onSubmitCapture={submit}>
      <Sidebar role="ca" userName="Equipa de demonstração" activePath={activePath} storageKey="abiptom_review_sidebar" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="review-banner">Versão de teste · Dados inteiramente fictícios · Sem ligação à produção</div>
        <header data-slot="admin-header" className="flex items-center justify-between gap-3 border-b px-8">
          <div className="flex min-w-0 items-center gap-3"><Image src="/brand/abiptom-logo.png" alt="ABIPTOM" width={34} height={34} className="rounded-full" /><span className="truncate text-sm font-medium">{section}</span></div>
          <Button variant="outline" onClick={() => setSection('Componentes')}><SlidersHorizontal aria-hidden="true" className="size-4" /><span className="hidden sm:inline">Explorar componentes</span></Button>
        </header>
        <div className="review-tabs" aria-label="Vistas da demonstração">
          {['Painel', 'Relatórios', 'Utilizadores', 'Componentes'].map(name => <Button key={name} variant="ghost" aria-pressed={section === name} onClick={() => { setSection(name); setActivePath(name === 'Painel' ? '/admin/dashboard' : name === 'Relatórios' ? '/admin/reports' : '/admin/users'); setNotice(''); }}>{name}</Button>)}
          {section === 'Painel' && <Button variant="outline" className="ml-auto" aria-pressed={empty} onClick={() => setEmpty(!empty)}>{empty ? 'Mostrar amostra' : 'Testar estado vazio'}</Button>}
        </div>
        {notice && <p role="status" className="mx-4 mt-4 rounded-lg border border-border px-4 py-3 text-sm text-muted-foreground md:mx-8">{notice}</p>}
        {section === 'Painel' ? <DashboardView stats={stats} userName="Equipa" /> : section === 'Relatórios' ? <ReportsView report={periodo === 'mensal' ? demoMonthlyReport : demoReport} ano={2026} mes={11} trimestre={4} periodo={periodo} /> : section === 'Utilizadores' ? <main><div className="mx-auto max-w-6xl space-y-4"><h1>Utilizadores</h1><p className="text-sm text-muted-foreground">Exemplos fictícios com textos longos para verificar todas as colunas.</p><UsersTable users={demoUsers} /></div></main> : <ComponentExamples />}
      </div>
    </AdminSurface>
  );
}

function ComponentExamples() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  function validate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const valid = String(values.get('nome') ?? '').trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values.get('email') ?? ''));
    setError(valid ? '' : 'Preenche o nome e um endereço de email válido.');
    setSuccess(valid);
  }
  return (
    <main><div className="mx-auto max-w-6xl space-y-6">
      <div><h1>Componentes administrativos</h1><p className="mt-2 text-sm text-muted-foreground">Formulários, tabelas e acções com o mesmo sistema visual.</p></div>
      <section data-financial-panel=""><h2>Acções e estados</h2><p className="mt-2 text-sm text-muted-foreground">A acção principal destaca-se. As operações sensíveis mantêm uma confirmação.</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button onClick={() => setSuccess(true)}><Check className="size-4" aria-hidden="true" />Acção principal</Button>
          <Button variant="outline"><Download className="size-4" aria-hidden="true" />Acção secundária</Button>
          <Button variant="ghost">Acção discreta<ArrowUpRight className="size-4" aria-hidden="true" /></Button>
          <Button disabled><Loader2 className="size-4" aria-hidden="true" />A processar</Button>
          <Dialog><DialogTrigger render={<Button variant="destructive" />}>Exemplo de confirmação</DialogTrigger>
            <DialogContent><DialogHeader><DialogTitle>Confirmar operação</DialogTitle><DialogDescription>Esta janela demonstra a confirmação de uma acção sensível. Nenhum registo será alterado.</DialogDescription></DialogHeader><DialogFooter><DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose><DialogClose render={<Button />}>Concluir exemplo</DialogClose></DialogFooter></DialogContent>
          </Dialog>
        </div>
        <div className="mt-5 flex flex-wrap gap-2"><Badge>Calculado</Badge><Badge className="bg-green-100 text-green-700">Confirmado</Badge><Badge className="bg-amber-100 text-amber-700">Aberto</Badge><Badge variant="destructive">Atenção necessária</Badge></div>
      </section>
      <section data-financial-panel=""><h2>Formulário de exemplo</h2><form noValidate onSubmit={validate} className="mt-5 max-w-xl space-y-5">
        <div className="space-y-2"><Label htmlFor="demo-nome">Nome do cliente</Label><Input id="demo-nome" name="nome" placeholder="Exemplo de cliente" aria-invalid={Boolean(error)} aria-describedby={error ? 'demo-error' : undefined} /></div>
        <div className="space-y-2"><Label htmlFor="demo-email">Email</Label><Input id="demo-email" name="email" type="email" placeholder="cliente@exemplo.gw" aria-invalid={Boolean(error)} aria-describedby={error ? 'demo-error' : undefined} /></div>
        <div className="space-y-2"><Label id="demo-tipo-label">Tipo de cliente</Label><Select defaultValue="empresa" items={[{ value: 'empresa', label: 'Empresa' }, { value: 'instituicao', label: 'Instituição' }, { value: 'particular', label: 'Particular' }]}><SelectTrigger aria-labelledby="demo-tipo-label" className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="empresa">Empresa</SelectItem><SelectItem value="instituicao">Instituição</SelectItem><SelectItem value="particular">Particular</SelectItem></SelectContent></Select></div>
        {error && <p role="alert" id="demo-error" className="text-sm text-red-700">{error}</p>}
        {success && <p role="status" className="text-sm text-green-700">Exemplo validado localmente. Nenhum registo foi criado.</p>}
        <Button type="submit">Validar exemplo</Button>
      </form></section>
      <section data-financial-panel=""><h2>Mensagens e notificações</h2><p className="mt-2 text-sm text-muted-foreground">Exemplos de contraste do Chat, sem enviar mensagens.</p><div className="mt-4 flex items-center justify-between gap-4"><div data-slot="message-bubble" data-mine="true" className="rounded-lg bg-[color:var(--brand-ink)] px-4 py-3 text-sm text-[#fff8df]">Mensagem de demonstração enviada.</div><span data-slot="message-count" className="rounded-full bg-[color:var(--brand-gold)] px-2 py-1 text-sm text-[color:var(--brand-ink)]" aria-label="3 mensagens por ler">3</span></div></section>
      <section data-financial-panel=""><h2>Tabela de exemplo</h2><div className="mt-4 overflow-x-auto"><table className="min-w-[520px] text-sm"><caption className="sr-only">Clientes fictícios</caption><thead><tr><th className="text-left">Cliente</th><th className="text-left">Estado</th><th className="text-right">Facturado</th></tr></thead><tbody>{demoStats.ultimasFacturas.map(row => <tr key={row.id}><td>{row.clientNome}</td><td><Badge variant="secondary">Activo</Badge></td><td className="text-right">{Number(row.total).toLocaleString('pt-PT')} XOF</td></tr>)}</tbody></table></div></section>
    </div></main>
  );
}
