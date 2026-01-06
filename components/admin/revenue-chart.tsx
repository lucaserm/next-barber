"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { revenueData } from "@/lib/mock-data"

const chartConfig = {
  revenue: {
    label: "Receita",
    color: "hsl(45 93% 47%)",
  },
}

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita Mensal</CardTitle>
        <CardDescription>Evolução da receita nos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(45 93% 47%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(45 93% 47%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) => `R$${value / 1000}k`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelKey="month"
                  formatter={(value) => <span className="font-medium">R$ {Number(value).toLocaleString("pt-BR")}</span>}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(45 93% 47%)"
              strokeWidth={2}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
