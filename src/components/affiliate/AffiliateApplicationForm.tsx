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
  x_url: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  tiktok_url: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  instagram_url: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  facebook_url: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  youtube_url: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
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
            x_url: "",
            tiktok_url: "",
            instagram_url: "",
            facebook_url: "",
            youtube_url: "",
            promotion_methods: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user) {
            toast.error("You must be logged in to apply.");
            return;
        }

        const social_media_urls = {
            x: values.x_url,
            tiktok: values.tiktok_url,
            instagram: values.instagram_url,
            facebook: values.facebook_url,
            youtube: values.youtube_url,
        };
        
        const filtered_social_media_urls = Object.fromEntries(Object.entries(social_media_urls).filter(([_, v]) => v && v.length > 0));

        const { error } = await supabase.from("affiliates").insert({
            user_id: user.id,
            affiliate_code: values.affiliate_code,
            social_media_urls: Object.keys(filtered_social_media_urls).length > 0 ? filtered_social_media_urls : null,
            promotion_methods: values.promotion_methods,
        });

        if (error) {
            if (error.code === '23505') { // unique constraint violation
                 toast.error("This affiliate code is already taken. Please choose another one.");
            } else {
                 toast.error(error.message);
            }
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
                <div className="space-y-4 rounded-lg border p-4 bg-background/50">
                    <h3 className="text-lg font-medium">Social Media Presence</h3>
                    <p className="text-sm text-muted-foreground">
                        Provide links to your social media profiles where you plan to promote us.
                    </p>
                    <FormField
                        control={form.control}
                        name="x_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>X (Twitter) Profile URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://x.com/yourprofile" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tiktok_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>TikTok Profile URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://tiktok.com/@yourprofile" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="instagram_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Instagram Profile URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://instagram.com/yourprofile" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="facebook_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Facebook Profile URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://facebook.com/yourprofile" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="youtube_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>YouTube Channel URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://youtube.com/c/yourchannel" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
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
