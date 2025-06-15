
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  affiliate_code: z.string().min(4, "Code must be at least 4 characters.").max(20, "Code must be at most 20 characters.").regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed."),
  social_media_urls: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  promotion_methods: z.string().min(10, "Please describe your promotion methods in at least 10 characters."),
});

const AffiliateApplicationForm = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            affiliate_code: "",
            social_media_urls: "",
            promotion_methods: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user) {
            toast.error("You must be logged in to apply.");
            return;
        }

        const { error } = await supabase.from("affiliates").insert({
            user_id: user.id,
            affiliate_code: values.affiliate_code,
            social_media_urls: values.social_media_urls ? [values.social_media_urls] : null,
            promotion_methods: values.promotion_methods,
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Application submitted successfully! We will review it shortly.");
            await queryClient.invalidateQueries({ queryKey: ['affiliateData', user.id] });
            navigate("/affiliate-portal");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <FormField
                    control={form.control}
                    name="social_media_urls"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Website or Social Media URL</FormLabel>
                            <FormControl>
                                <Input placeholder="https://yourwebsite.com" {...field} />
                            </FormControl>
                             <FormDescription>
                                Where you plan to promote us (e.g., blog, YouTube channel).
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="promotion_methods"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>How do you plan to promote us?</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us a bit about your promotion strategies."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Application
                </Button>
            </form>
        </Form>
    );
};

export default AffiliateApplicationForm;
