import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

const exchangeRateSchema = z.object({
  rate: z.coerce.number().positive("Rate must be a positive number"),
});

const ExchangeRate = () => {
  const queryClient = useQueryClient();

  const { data: exchangeRate, isLoading, error } = useQuery({
    queryKey: ['exchange_rate', 'USD_NGN'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exchange_rates')
        .select('rate')
        .eq('currency_pair', 'USD_NGN')
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const form = useForm<z.infer<typeof exchangeRateSchema>>({
    resolver: zodResolver(exchangeRateSchema),
    values: {
        rate: exchangeRate?.rate || 1700,
    }
  });

  const { mutate: updateRate, isPending: isUpdating } = useMutation({
    mutationFn: async (newRate: number) => {
      const { error } = await supabase
        .from('exchange_rates')
        .update({ rate: newRate, updated_at: new Date().toISOString() })
        .eq('currency_pair', 'USD_NGN');

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Exchange rate updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['exchange_rate', 'USD_NGN'] });
    },
    onError: (error) => {
      toast.error(`Failed to update rate: ${error.message}`);
    }
  });

  const onSubmit = (values: z.infer<typeof exchangeRateSchema>) => {
    updateRate(values.rate);
  };
  
  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  if (error) {
    return <div className="text-destructive">Error loading exchange rate: {error.message}</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Manage Exchange Rate</CardTitle>
          <CardDescription>Update the USD to NGN exchange rate for Klasha payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>USD to NGN Rate</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Enter new rate" {...field} />
                    </FormControl>
                    <FormDescription>
                      This rate will be used to convert USD prices to NGN for payments.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Rate
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExchangeRate;
