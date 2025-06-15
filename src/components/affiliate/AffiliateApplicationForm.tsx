
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
import { useState } from "react";
import StepIndicator from "./application-steps/StepIndicator";
import PersonalDetailsStep from "./application-steps/PersonalDetailsStep";
import PromotionDetailsStep from "./application-steps/PromotionDetailsStep";
import AccountDetailsStep from "./application-steps/AccountDetailsStep";

const formSchema = z.object({
  // Step 1: Personal Info
  first_name: z.string().min(2, "First name must be at least 2 characters."),
  last_name: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  telegram: z.string().optional(),

  // Step 2: Promotion
  x_url: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  tiktok_url: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  instagram_url: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  facebook_url: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  youtube_url: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  promotion_methods: z.string().min(10, "Please describe your promotion methods in at least 10 characters."),
  
  // Step 3: Account & Payment
  affiliate_code: z.string().min(4, "Code must be at least 4 characters.").max(20, "Code must be at most 20 characters.").regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed."),
  payment_network: z.enum(["TRC20", "Arbitrum"], {
    required_error: "You need to select a payment network.",
  }),
  wallet_address: z.string().min(20, "Please enter a valid wallet address."),
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

    async function onSubmit(values: FormValues) {
        if (!user) {
            toast.error("You must be logged in to apply.");
            return;
        }

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

        const { error } = await supabase.from("affiliates").insert({
            user_id: user.id,
            personal_info,
            affiliate_code: values.affiliate_code,
            social_media_urls: Object.keys(filtered_social_media_urls).length > 0 ? filtered_social_media_urls : null,
            promotion_methods: values.promotion_methods,
            payment_info,
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

    const steps = ["Personal Info", "Promotion Details", "Account & Payment"];
    const stepFields: Record<number, (keyof FormValues)[]> = {
        1: ["first_name", "last_name", "email"],
        2: ["promotion_methods"],
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
