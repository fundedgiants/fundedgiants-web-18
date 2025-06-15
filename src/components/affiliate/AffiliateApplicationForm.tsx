import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import StepIndicator from "./application-steps/StepIndicator";
import PersonalDetailsStep from "./application-steps/PersonalDetailsStep";
import PromotionDetailsStep from "./application-steps/PromotionDetailsStep";
import AccountDetailsStep from "./application-steps/AccountDetailsStep";

const formSchema = z.object({
  // Step 1: Personal Info
  first_name: z.string().min(2, "First name must be at least 2 characters."),
  last_name: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters.").optional(),
  confirmPassword: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  telegram: z.string().optional(),

  // Step 2: Promotion
  x_url: z.string().min(1, "X (Twitter) Profile URL is required.").url("Please enter a valid URL."),
  tiktok_url: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  instagram_url: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  facebook_url: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  youtube_url: z.string().min(1, "YouTube Channel URL is required.").url("Please enter a valid URL."),
  promotion_methods: z.string().min(10, "Please describe your promotion methods in at least 10 characters."),
  
  // Step 3: Account & Payment
  affiliate_code: z.string().min(4, "Code must be at least 4 characters.").max(20, "Code must be at most 20 characters.").regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed."),
  payment_network: z.enum(["TRC20", "Arbitrum"], {
    required_error: "You need to select a payment network.",
  }),
  wallet_address: z.string().min(20, "Please enter a valid wallet address."),
}).refine((data) => {
    // Only validate password confirmation if a password is provided (for new users).
    if (data.password) {
        return data.password === data.confirmPassword;
    }
    return true;
}, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})
.refine((data) => !!data.whatsapp?.trim() || !!data.telegram?.trim(), {
    message: "Please provide either a WhatsApp number or a Telegram username.",
    path: ["whatsapp"],
})
.refine((data) => !!data.whatsapp?.trim() || !!data.telegram?.trim(), {
    message: "Please provide either a WhatsApp number or a Telegram username.",
    path: ["telegram"],
})
.superRefine((data, ctx) => {
    const socialUrls = [
        data.x_url,
        data.tiktok_url,
        data.instagram_url,
        data.facebook_url,
        data.youtube_url,
    ];
    const providedUrlsCount = socialUrls.filter(url => url?.trim()).length;

    if (providedUrlsCount < 3) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["tiktok_url"],
            message: "Please provide at least 3 social media links in total.",
        });
    }
});

type FormValues = z.infer<typeof formSchema>;

const AffiliateApplicationForm = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: user?.email || "",
            password: "",
            confirmPassword: "",
            phone: "",
            whatsapp: "",
            telegram: "",
            affiliate_code: "",
            x_url: "",
            tiktok_url: "",
            instagram_url: "",
            facebook_url: "",
            youtube_url: "",
            promotion_methods: "",
            wallet_address: "",
        },
        mode: "onChange",
    });

    useEffect(() => {
        if (user) {
            form.setValue('email', user.email || '');
            // NOTE: The password fields will still be visible to logged-in users.
            // This is a known UX issue that cannot be fixed without editing the read-only step components.
            // Logged-in users should ignore these fields.
        }
    }, [user, form]);

    async function onSubmit(values: FormValues) {
        let affiliateUserId = user?.id;
        const isNewUser = !user;

        // 1. Sign up the user if they are a new visitor
        if (isNewUser) {
            if (!values.password || values.password.length < 6) {
                toast.error("Password must be at least 6 characters.");
                return;
            }
             if (values.password !== values.confirmPassword) {
                toast.error("Passwords do not match.");
                return;
            }

            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: values.email,
                password: values.password,
                options: {
                    data: {
                        first_name: values.first_name,
                        last_name: values.last_name,
                    },
                    emailRedirectTo: `${window.location.origin}/affiliate-portal`,
                },
            });

            if (signUpError) {
                toast.error(signUpError.message);
                return;
            }

            if (!signUpData.user) {
                toast.error("An unexpected error occurred during sign up. Please try again.");
                return;
            }
            
            affiliateUserId = signUpData.user.id;
        }

        if (!affiliateUserId) {
            toast.error("Could not create affiliate application: user is not identified.");
            return;
        }
        
        const newUserId = affiliateUserId;

        // 2. Create the affiliate record
        const personal_info = {
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            phone: values.phone,
            whatsapp: values.whatsapp,
            telegram: values.telegram,
        };

        const social_media_urls = {
            x: values.x_url,
            tiktok: values.tiktok_url,
            instagram: values.instagram_url,
            facebook: values.facebook_url,
            youtube: values.youtube_url,
        };
        
        const filtered_social_media_urls = Object.fromEntries(Object.entries(social_media_urls).filter(([_, v]) => v && v.length > 0));

        const payment_info = {
            network: values.payment_network,
            address: values.wallet_address,
        };

        const { error: affiliateInsertError } = await supabase.from("affiliates").insert({
            user_id: affiliateUserId,
            personal_info,
            affiliate_code: values.affiliate_code,
            social_media_urls: Object.keys(filtered_social_media_urls).length > 0 ? filtered_social_media_urls : null,
            promotion_methods: values.promotion_methods,
            payment_info,
            status: 'approved', // Auto-approve the affiliate
        });

        if (affiliateInsertError) {
            if (affiliateInsertError.code === '23505') { // unique constraint violation
                 toast.error("This affiliate code is already taken. Please choose another one.");
            } else {
                 toast.error(affiliateInsertError.message);
            }
        } else {
            toast.success(
                isNewUser 
                ? "Application submitted! Please check your email to verify your account."
                : "Application submitted successfully! Your application is under review."
            );
            await queryClient.invalidateQueries({ queryKey: ['affiliateData', affiliateUserId] });
            navigate("/affiliate-portal");
        }
    }

    const steps = ["Personal Info", "Promotion Details", "Account & Payment"];
    const stepFields: Record<number, (keyof FormValues)[]> = {
        1: ["first_name", "last_name", "email", "password", "confirmPassword", "whatsapp", "telegram"],
        2: ["promotion_methods", "x_url", "tiktok_url", "instagram_url", "facebook_url", "youtube_url"],
    };

    const handleNext = async () => {
        const fieldsToValidate = stepFields[currentStep];
        const isValid = await form.trigger(fieldsToValidate);
        if (isValid) {
            setCurrentStep(prev => prev + 1);
        }
    }

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <StepIndicator currentStep={currentStep} steps={steps} />
                
                <div className="min-h-[300px]">
                    {currentStep === 1 && <PersonalDetailsStep form={form} />}
                    {currentStep === 2 && <PromotionDetailsStep form={form} />}
                    {currentStep === 3 && <AccountDetailsStep form={form} />}
                </div>

                <div className="flex justify-between pt-4">
                    {currentStep > 1 ? (
                        <Button type="button" variant="outline" onClick={handleBack} disabled={form.formState.isSubmitting}>
                            Back
                        </Button>
                    ) : <div></div>}
                    {currentStep < steps.length && (
                         <Button type="button" onClick={handleNext} disabled={form.formState.isSubmitting}>
                            Next
                        </Button>
                    )}
                    {currentStep === steps.length && (
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Application
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
};

export default AffiliateApplicationForm;
