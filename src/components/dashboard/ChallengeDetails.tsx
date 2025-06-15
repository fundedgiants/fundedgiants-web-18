
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ChallengeDetails = ({ account }) => (
  <Card className="bg-card/80 backdrop-blur-sm border-primary/20 text-white">
    <CardHeader>
      <CardTitle>Challenge Details</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Account Size</span>
          <span className="font-bold">${Number(account.starting_balance).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Platform</span>
          <span className="font-bold">{account.platform}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Start Date</span>
          <span className="font-bold">{new Date(account.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">End Date</span>
          <span className="font-bold text-muted-foreground">N/A</span>
        </div>
      </div>
    </CardContent>
  </Card>
);
