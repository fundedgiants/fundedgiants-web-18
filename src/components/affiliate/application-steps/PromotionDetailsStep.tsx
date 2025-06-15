
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface PromotionDetailsStepProps {
  form: UseFormReturn<any>;
}

const PromotionDetailsStep = ({ form }: PromotionDetailsStepProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-4 rounded-lg border p-4 bg-background/50">
          <h3 className="text-lg font-medium">Social Media Presence</h3>
          <p className="text-sm text-muted-foreground">
              Provide links to at least 3 of your social media profiles. X (Twitter) and YouTube profiles are required.
          </p>
          <FormField
              control={form.control}
              name="x_url"
              render={({ field }) => (
                  <FormItem>
                      <FormLabel>X (Twitter) Profile URL <span className="text-destructive">*</span></FormLabel>
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
                      <FormLabel>YouTube Channel URL <span className="text-destructive">*</span></FormLabel>
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
    </div>
  )
}

export default PromotionDetailsStep;
