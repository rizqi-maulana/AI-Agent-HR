import React, { useContext } from "react";
import { contextApp } from "@/context";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

const experienceSchema = z.object({
  currentTitle: z.string().min(1, "Current/most recent job title is required"),
  company: z.string().min(1, "Company name is required"),
  experienceYears: z.string().min(1, "Experience level is required"),
  skills: z.string().min(1, "Please list at least one skill"),
  coverLetter: z.string().optional(),
});

export type ExperienceValues = z.infer<typeof experienceSchema>;

interface ExperienceFormProps {
  onSubmit: (values: ExperienceValues) => void;
  onBack: () => void;
  defaultValues?: Partial<ExperienceValues>;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  onSubmit,
  onBack,
  defaultValues = {
    currentTitle: "",
    company: "",
    experienceYears: "",
    skills: "",
    coverLetter: "",
  },
}) => {
  const form = useForm<ExperienceValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues,
  });
  const {
    setCurrentTitle,
    setCompany,
    setExperienceYears,
    setSkills,
    setCoverLetter,
    ConfigCompany,
    ConfigJob,
  } = useContext(contextApp);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 animate-in fade-in-50"
      >
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="currentTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current/Most Recent Job Title</FormLabel>
                <Select
                  onValueChange={(event) => {
                    field.onChange(event);
                    setCurrentTitle(event);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job title" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    {ConfigJob.map((data, index) => (
                      <SelectItem key={index} value={data}>
                        {data}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <Select
                  onValueChange={(event) => {
                    field.onChange(event);
                    setCompany(event);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job title" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    {ConfigCompany.map((data, index) => (
                      <SelectItem key={index} value={data}>
                        {data}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experienceYears"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <Select
                  onValueChange={(event) => {
                    field.onChange(event);
                    setExperienceYears(event);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    <SelectItem value="0-1">Less than 1 year</SelectItem>
                    <SelectItem value="1-2">1-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-7">5-7 years</SelectItem>
                    <SelectItem value="7+">7+ years</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key Skills</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. JavaScript, React, Node.js"
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      setSkills(event.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coverLetter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Letter (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us why you're a good fit for this position"
                    className="min-h-[120px]"
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      setCoverLetter(event.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between">
          <Button type="button" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </Form>
  );
};

export default ExperienceForm;
