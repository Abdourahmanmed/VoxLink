"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

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

export const description = "A donut chart with text"

interface MychartPropos {
    QuickTotalData:number
    LivTotalData:number
  }

export function PieChartDonutWithText({QuickTotalData,LivTotalData}:MychartPropos) {
    const chartData = [
        { browser: "QuickPoste", visitors: QuickTotalData, fill: "var(--color-QuickPoste)" },
        { browser: "Livraison", visitors: LivTotalData, fill: "var(--color-Livraison)" },
    ]

    const chartConfig = {
        visitors: {
            label: "Livraison",
        },
        QuickPoste: {
            label: "Quick Poste ",
            color: "#EA580C",
        },
        Livraison: {
            label: "Livraison",
            color: "#84CC16",
        },
    } satisfies ChartConfig

    const totalVisitors = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
    }, [QuickTotalData,LivTotalData])

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle className="text-blue">Evolution des livraisons</CardTitle>
                <CardDescription ><span className="text-orange-600">Quick poste</span> - <span className="text-lime-500">Livraison normale</span></CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="visitors"
                            nameKey="browser"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold text-blue"
                                                >
                                                    {totalVisitors.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground text-blue"
                                                >
                                                    Livraisons
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="leading-none text-muted-foreground flex gap-2 text-orange-700">
                    Afficher le total des livraisons  <TrendingUp className="h-4 w-4" />
                </div>
            </CardFooter>
        </Card>
    )
}
