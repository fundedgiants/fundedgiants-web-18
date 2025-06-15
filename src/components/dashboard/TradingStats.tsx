
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const TradingStats = () => {
    // Mock data
    const stats = [
        { label: "Win Rate", value: "68%" },
        { label: "Avg. Win", value: "$450.25" },
        { label: "Avg. Loss", value: "$210.80" },
        { label: "Profit Factor", value: "2.14" },
        { label: "Sharpe Ratio", value: "1.2" },
        { label: "Total Trades", value: "52" },
    ];
    return (
        <Card className="bg-card/80 backdrop-blur-sm border-primary/20 text-white">
            <CardHeader>
                <CardTitle>Trading Statistics</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                {stats.map(stat => (
                    <div key={stat.label} className="p-3 bg-background/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-lg font-bold">{stat.value}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
