
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";

export const GainsTarget = () => {
    // Mock data
    const currentGains = 2500;
    const targetGains = 8000;
    const progress = (currentGains / targetGains) * 100;

    return (
        <Card className="bg-card/80 backdrop-blur-sm border-primary/20 text-white">
            <CardHeader>
                <CardTitle>Gains & Target</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-baseline">
                    <p className="text-3xl font-bold text-green-400">${currentGains.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">/ ${targetGains.toLocaleString()}</p>
                </div>
                <Progress value={progress} className="mt-4" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Current Gains</span>
                    <span>Target</span>
                </div>
                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">Trading Days Remaining</p>
                    <p className="text-2xl font-bold text-white">23</p>
                </div>
            </CardContent>
        </Card>
    );
};
