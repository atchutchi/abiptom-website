'use client';

import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ReferenceLine, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { formatCurrency } from '@/core/lib/utils/format';
import type { FinancialDatum } from '@/core/lib/admin/chart-data';

const compact = new Intl.NumberFormat('pt-PT', { notation: 'compact', maximumFractionDigits: 1 });
const amountConfig = { value: { label: 'Montante', color: '#f5b800' } } satisfies ChartConfig;
const series = {
  recebido: { label: 'Recebido', color: '#f5b800' },
  despesas: { label: 'Despesas', color: '#81b5ff' },
  saldo: { label: 'Saldo global', color: '#7dd3b0' },
} satisfies ChartConfig;

export function FinancialBarChart({ title, description, data }: { title: string; description: string; data: FinancialDatum[] }) {
  const invalid = data.some(row => !Number.isFinite(row.value));
  return (
    <figure data-financial-panel="">
      <figcaption><h2>{title}</h2><p>{description}</p></figcaption>
      {invalid ? <p role="alert" className="mt-4 text-red-700">Não foi possível apresentar estes valores.</p> : data.length === 0 ? (
        <p className="py-12 text-sm text-muted-foreground">Sem movimentos neste período.</p>
      ) : (
        <>
          <ChartContainer config={amountConfig} className="mt-5 h-[280px] w-full aspect-auto" aria-label={`${title}, valores em XOF`}>
            <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 0, right: 24, top: 8, bottom: 8 }}>
              <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="3 5" />
              <XAxis type="number" tickFormatter={value => compact.format(value)} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
              <YAxis type="category" dataKey="label" width={106} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} tickFormatter={value => String(value).length > 17 ? `${String(value).slice(0, 16)}…` : value} />
              <ReferenceLine x={0} stroke="var(--muted-foreground)" />
              <ChartTooltip cursor={{ fill: 'var(--muted)' }} content={<ChartTooltipContent labelFormatter={(_, payload) => payload?.[0]?.payload?.label} formatter={value => <span className="font-semibold tabular-nums">{formatCurrency(Number(value))}</span>} />} />
              <Bar dataKey="value" radius={4} maxBarSize={24} isAnimationActive={false}>
                {data.map((row, index) => <Cell key={row.label} fill={row.value < 0 ? '#e99f95' : index % 2 ? '#81b5ff' : '#f5b800'} />)}
              </Bar>
            </BarChart>
          </ChartContainer>
          <details>
            <summary>Consultar valores exactos em XOF</summary>
            <div className="overflow-x-auto"><table className="text-sm"><caption className="sr-only">{title}</caption><thead><tr><th className="text-left">Descrição</th><th className="text-right">Montante</th></tr></thead><tbody>
              {data.map(row => <tr key={row.label}><td>{row.label}</td><td className="text-right tabular-nums">{formatCurrency(row.value)}</td></tr>)}
            </tbody></table></div>
          </details>
        </>
      )}
    </figure>
  );
}

export function MonthlyFinancialChart({ data }: { data: { label: string; recebido: number; despesas: number; saldo: number }[] }) {
  if (!data.length) return null;
  const invalid = data.some(row => ![row.recebido, row.despesas, row.saldo].every(Number.isFinite));
  return (
    <figure data-financial-panel="">
      <figcaption><h2>Evolução no trimestre</h2><p>Valores mensais em XOF. O saldo inclui as saídas consideradas no relatório.</p></figcaption>
      {invalid ? <p role="alert" className="mt-4 text-red-700">Não foi possível apresentar estes valores.</p> : <>
        <ul className="mt-5 flex flex-wrap gap-5 text-sm" aria-label="Legenda do gráfico">
          {Object.entries(series).map(([key, item]) => <li key={key} className="flex items-center gap-2"><span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: item.color }} />{item.label}</li>)}
        </ul>
        <ChartContainer config={series} className="mt-3 h-[280px] w-full aspect-auto" aria-label="Evolução mensal em XOF">
          <LineChart accessibilityLayer data={data} margin={{ left: 0, right: 20, top: 16, bottom: 8 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 5" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
            <YAxis tickFormatter={value => compact.format(value)} width={64} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
            <ReferenceLine y={0} stroke="var(--muted-foreground)" />
            <ChartTooltip content={<ChartTooltipContent formatter={(value, name) => <span className="flex w-full justify-between gap-4"><span>{series[name as keyof typeof series]?.label ?? name}</span><strong className="tabular-nums">{formatCurrency(Number(value))}</strong></span>} />} />
            {Object.entries(series).map(([key, item], index) => <Line key={key} type="linear" dataKey={key} stroke={item.color} strokeWidth={2.5} strokeDasharray={index === 1 ? '6 4' : undefined} dot={{ r: index === 2 ? 5 : 3 }} activeDot={{ r: 6 }} isAnimationActive={false} />)}
          </LineChart>
        </ChartContainer>
        <details><summary>Consultar valores mensais em XOF</summary><div className="overflow-x-auto"><table className="min-w-[440px] text-sm"><caption className="sr-only">Evolução no trimestre</caption><thead><tr><th className="text-left">Mês</th><th className="text-right">Recebido</th><th className="text-right">Despesas</th><th className="text-right">Saldo global</th></tr></thead><tbody>
          {data.map(row => <tr key={row.label}><td>{row.label}</td>{[row.recebido, row.despesas, row.saldo].map((value, i) => <td key={i} className="text-right tabular-nums">{formatCurrency(value)}</td>)}</tr>)}
        </tbody></table></div></details>
      </>}
    </figure>
  );
}
