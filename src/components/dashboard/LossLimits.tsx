
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

export const LossLimits = () => {
    // Mock data
    const dailyLoss = 1200;
    const dailyLossLimit = 4000;
    const maxLoss = 2500;
    const maxLossLimit = 8000;

    const dailyLossData = [{ name: 'Daily Loss', value: (dailyLoss / dailyLossLimit) * 100, fill: 'hsl(var(--primary))' }];
    const maxLossData = [{ name: 'Max Loss', value: (maxLoss / maxLossLimit) * 100, fill: 'hsl(var(--destructive))' }];
    
    return (
        <Card className="bg-card/80 backdrop-blur-sm border-primary/20 text-white">
            <CardHeader>
                <CardTitle>Loss Limits</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row justify-around items-center gap-6">
                <div className="text-center w-full sm:w-1/2">
                    <p className="text-muted-foreground text-sm">Daily Loss</p>
                    <ChartContainer config={{}} className="h-32 w-full mx-auto">
                        <RadialBarChart innerRadius="70%" outerRadius="90%" barSize={10} data={dailyLossData} startAngle={90} endAngle={-270}>
                            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                            <RadialBar background dataKey='value' angleAxisId={0} cornerRadius={10} />
                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-lg font-bold">
                                ${dailyLoss}
                            </text>
                        </RadialBarChart>
                    </ChartContainer>
                    <p className="text-xs text-muted-foreground">Limit: ${dailyLossLimit}</p>
                </div>
                <div className="text-center w-full sm:w-1/2">
                    <p className="text-muted-foreground text-sm">Max Loss</p>
                    <ChartContainer config={{}} className="h-32 w-full mx-auto">
                        <RadialBarChart innerRadius="70%" outerRadius="90%" barSize={10} data={maxLossData} startAngle={90} endAngle={-270}>
                            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                            <RadialBar background dataKey='value' angleAxisId={0} cornerRadius={10} />
                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-lg font-bold">
                                ${maxLoss}
                            </text>
                        </RadialBarChart>
                    </ChartContainer>
                    <p className="text-xs text-muted-foreground">Limit: ${maxLossLimit}</p>
                </div>
            </CardContent>
        </Card>
    );
};
