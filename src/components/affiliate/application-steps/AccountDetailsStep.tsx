
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";

interface AccountDetailsStepProps {
  form: UseFormReturn<any>;
}

const AccountDetailsStep = ({ form }: AccountDetailsStepProps) => {
  return (
    <div className="space-y-8">
        <FormField
            control={form.control}
            name="affiliate_code"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Desired Affiliate Code</FormLabel>
                    <FormControl>
                        <Input placeholder="your_unique_code" {...field} />
                    </FormControl>
                    <FormDescription>
                        This will be part of your referral link.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
        <div className="space-y-4 rounded-lg border p-4 bg-background/50">
            <h3 className="text-lg font-medium">Payment Information</h3>
            <p className="text-sm text-muted-foreground">
                How would you like to receive your commissions? Payouts are in USDT.
            </p>
            <FormField
                control={form.control}
                name="payment_network"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>USDT Network</FormLabel>
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                            >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="TRC20" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        Tron (TRC20)
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="Arbitrum" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        Arbitrum (ARB)
                                    </FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="wallet_address"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>USDT Wallet Address</FormLabel>
                        <FormControl>
                            <Input placeholder="Your USDT wallet address" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    </div>
  )
}

export default AccountDetailsStep;
