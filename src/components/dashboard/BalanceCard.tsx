
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

export const BalanceCard = ({ account, user }) => (
    <Card className="bg-gradient-to-br from-primary to-primary/60 text-white">
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Balance</CardTitle>
                <span className="text-xs font-mono px-2 py-1 rounded-full bg-black/20">LIVE</span>
            </div>
        </CardHeader>
        <CardContent>
            <p className="text-4xl font-bold">${Number(account.starting_balance).toLocaleString()}</p>
            <div className="flex items-center gap-2 text-sm mt-2 text-primary-foreground/80">
                <User className="w-4 h-4" />
                <span>{user?.user_metadata.first_name} {user?.user_metadata.last_name}</span>
            </div>
            <div className="flex justify-between mt-4 text-sm text-primary-foreground/80">
                <span>{account.program_name}</span>
                <span>ID: {account.login_id}</span>
            </div>
        </CardContent>
    </Card>
);
