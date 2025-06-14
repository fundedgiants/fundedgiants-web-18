
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Program } from '@/data/checkoutData';

interface ProgramSelectorProps {
  programs: Program[];
  selectedProgram: Program | null;
  onSelectProgram: (program: Program) => void;
}

const ProgramSelector = ({ programs, selectedProgram, onSelectProgram }: ProgramSelectorProps) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-8 text-primary">Choose Your Program</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {programs.map((program) => (
          <Card
            key={program.id}
            className={cn(
              'cursor-pointer border-2 transition-all duration-300 hover:border-primary/80 hover:shadow-lg',
              selectedProgram?.id === program.id ? 'border-primary shadow-primary/20' : 'border-border'
            )}
            onClick={() => onSelectProgram(program)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{program.name}</span>
                {selectedProgram?.id === program.id && <CheckCircle className="h-6 w-6 text-primary" />}
              </CardTitle>
              <CardDescription>{program.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-foreground mb-1">${program.price}</p>
              <p className="text-lg font-semibold text-primary">{program.size} Account</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProgramSelector;
