"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { browser: "AppelTotal", visitors: 22, fill: "var(--color-AppelTotal)" },
  { browser: "AppelPositive", visitors: 15, fill: "var(--color-AppelPositive)" },
  { browser: "AppelNegative", visitors: 7, fill: "var(--color-AppelNegative)" },
]

const chartConfig = {
  visitors: {
    label: "Appels",
  },
  AppelTotal: {
    label: "Appel Total",
    color: "#002b5b",
  },
  AppelPositive: {
    label: "Appel Positive",
    color: "#22C55E",
  },
  AppelNegative: {
    label: "Appel Negative",
    color: "#EF4444",
  }
} satisfies ChartConfig

export function MyBetterChart() {
  return (
    <Card className="w-full bg-blanc shadow-blue">
      <CardHeader>
        <CardTitle className="text-blue">Vue d'ensemble</CardTitle>
        <CardDescription className="text-blue">visualisation de l'evolution des appelles</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="browser"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="visitors"
              strokeWidth={2}
              radius={8}
              activeIndex={2}
              activeBar={({ ...props }) => {
                return (
                  <Rectangle
                    {...props}
                    fillOpacity={0.8}
                    stroke={props.payload.fill}
                    strokeDasharray={4}
                    strokeDashoffset={4}
                  />
                )
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}

      </CardFooter>
    </Card>
  )
}
