"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { serviceStats } from "@/lib/mock-data"

const chartConfig = {
  count: {
    label: "Atendimentos",
    color: "hsl(45 93% 47%)",
  },
}

export function ServicesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços mais Populares</CardTitle>
        <CardDescription>Quantidade de atendimentos por serviço</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart data={serviceStats} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
            <XAxis type="number" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <YAxis
              dataKey="name"
              type="category"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              width={100}
            />
            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
            <Bar dataKey="count" fill="hsl(45 93% 47%)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
