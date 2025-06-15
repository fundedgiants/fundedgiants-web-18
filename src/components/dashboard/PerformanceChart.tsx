
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

// Mock data
const chartData = [
    { date: "2025-05-01", balance: 100000 },
    { date: "2025-05-03", balance: 100200 },
    { date: "2025-05-05", balance: 101500 },
    { date: "2025-05-07", balance: 102300 },
    { date: "2025-05-09", balance: 102800 },
    { date: "2025-05-11", balance: 103500 },
    { date: "2025-05-13", balance: 103200 },
];

const chartConfig = {
    balance: {
        label: "Balance",
        color: "hsl(var(--primary))",
    },
};

export const PerformanceChart = () => (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20 text-white">
        <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <LineChart accessibilityLayer data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} width={80} tickFormatter={(value) => `$${(value / 1000)}k`} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <Line dataKey="balance" type="monotone" stroke="var(--color-balance)" strokeWidth={2} dot={false} />
                </LineChart>
            </ChartContainer>
        </CardContent>
    </Card>
);
