import React, { useContext, useEffect, useState } from "react";
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
import { Button } from "@/app/components/ui/button";

const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Valid phone number is required"),
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  onSubmit: (values: PersonalInfoValues) => void;
  defaultValues?: Partial<PersonalInfoValues>;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  onSubmit,
  defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  },
}) => {
  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues,
  });
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setlastName] = useState<string>();
  const { setName, setEmail, setPhone } = useContext(contextApp);

  useEffect(() => {
    setName(`${firstName} ${lastName}`);
  }, [firstName, lastName]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 animate-in fade-in-50"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your first name"
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      setFirstName(event.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your last name"
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      setlastName(event.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email address"
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      setEmail(event.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your phone number"
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      setPhone(event.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </Form>
  );
};

export default PersonalInfoForm;
