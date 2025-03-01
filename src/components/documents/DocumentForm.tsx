import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, X } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define form schema based on document type
const baptismFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  dateOfBirth: z.string(),
  dateOfBaptism: z.string(),
  placeOfBaptism: z.string(),
  fatherName: z.string(),
  motherName: z.string(),
  godparentName: z.string(),
  ministerName: z.string(),
  notes: z.string().optional(),
});

const marriageFormSchema = z.object({
  groomFirstName: z
    .string()
    .min(2, { message: "Groom first name is required" }),
  groomLastName: z.string().min(2, { message: "Groom last name is required" }),
  brideFirstName: z
    .string()
    .min(2, { message: "Bride first name is required" }),
  brideLastName: z.string().min(2, { message: "Bride last name is required" }),
  dateOfMarriage: z.string(),
  placeOfMarriage: z.string(),
  witnessName1: z.string(),
  witnessName2: z.string(),
  ministerName: z.string(),
  notes: z.string().optional(),
});

const communionFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  dateOfBirth: z.string(),
  dateOfCommunion: z.string(),
  placeOfCommunion: z.string(),
  ministerName: z.string(),
  notes: z.string().optional(),
});

const confirmationFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  dateOfBirth: z.string(),
  dateOfConfirmation: z.string(),
  placeOfConfirmation: z.string(),
  sponsorName: z.string(),
  ministerName: z.string(),
  notes: z.string().optional(),
});

interface DocumentFormProps {
  documentId?: string;
  documentType?: "baptism" | "marriage" | "communion" | "confirmation";
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

const DocumentForm = ({
  documentId = "",
  documentType = "baptism",
  onSubmit = () => {},
  onCancel = () => {},
}: DocumentFormProps) => {
  const [activeTab, setActiveTab] = useState<string>(documentType);

  // Initialize form based on document type
  const baptismForm = useForm<z.infer<typeof baptismFormSchema>>({
    resolver: zodResolver(baptismFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      dateOfBaptism: "",
      placeOfBaptism: "",
      fatherName: "",
      motherName: "",
      godparentName: "",
      ministerName: "",
      notes: "",
    },
  });

  const marriageForm = useForm<z.infer<typeof marriageFormSchema>>({
    resolver: zodResolver(marriageFormSchema),
    defaultValues: {
      groomFirstName: "",
      groomLastName: "",
      brideFirstName: "",
      brideLastName: "",
      dateOfMarriage: "",
      placeOfMarriage: "",
      witnessName1: "",
      witnessName2: "",
      ministerName: "",
      notes: "",
    },
  });

  const communionForm = useForm<z.infer<typeof communionFormSchema>>({
    resolver: zodResolver(communionFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      dateOfCommunion: "",
      placeOfCommunion: "",
      ministerName: "",
      notes: "",
    },
  });

  const confirmationForm = useForm<z.infer<typeof confirmationFormSchema>>({
    resolver: zodResolver(confirmationFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      dateOfConfirmation: "",
      placeOfConfirmation: "",
      sponsorName: "",
      ministerName: "",
      notes: "",
    },
  });

  const handleSubmit = (data: any) => {
    onSubmit({
      ...data,
      documentType: activeTab,
      id: documentId || undefined,
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {documentId ? "Edit" : "Create"} Sacramental Record
        </CardTitle>
        <CardDescription>
          Fill in the details for the {activeTab} record.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue={documentType}
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="baptism">Baptism</TabsTrigger>
            <TabsTrigger value="marriage">Marriage</TabsTrigger>
            <TabsTrigger value="communion">First Communion</TabsTrigger>
            <TabsTrigger value="confirmation">Confirmation</TabsTrigger>
          </TabsList>

          {/* Baptism Form */}
          <TabsContent value="baptism">
            <Form {...baptismForm}>
              <form
                onSubmit={baptismForm.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={baptismForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={baptismForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={baptismForm.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={baptismForm.control}
                    name="dateOfBaptism"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Baptism</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={baptismForm.control}
                    name="placeOfBaptism"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place of Baptism</FormLabel>
                        <FormControl>
                          <Input placeholder="Church name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={baptismForm.control}
                    name="fatherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father's Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Father's full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={baptismForm.control}
                    name="motherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother's Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Mother's full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={baptismForm.control}
                    name="godparentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Godparent's Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Godparent's full name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={baptismForm.control}
                    name="ministerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minister's Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Minister's full name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={baptismForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional information"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" /> Save Record
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          {/* Marriage Form */}
          <TabsContent value="marriage">
            <Form {...marriageForm}>
              <form
                onSubmit={marriageForm.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium mb-2">
                      Groom Information
                    </h3>
                  </div>
                  <FormField
                    control={marriageForm.control}
                    name="groomFirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Groom's first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={marriageForm.control}
                    name="groomLastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Groom's last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium mb-2">
                      Bride Information
                    </h3>
                  </div>
                  <FormField
                    control={marriageForm.control}
                    name="brideFirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Bride's first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={marriageForm.control}
                    name="brideLastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Bride's last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium mb-2">
                      Marriage Details
                    </h3>
                  </div>
                  <FormField
                    control={marriageForm.control}
                    name="dateOfMarriage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Marriage</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={marriageForm.control}
                    name="placeOfMarriage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place of Marriage</FormLabel>
                        <FormControl>
                          <Input placeholder="Church name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={marriageForm.control}
                    name="witnessName1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Witness 1</FormLabel>
                        <FormControl>
                          <Input placeholder="First witness name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={marriageForm.control}
                    name="witnessName2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Witness 2</FormLabel>
                        <FormControl>
                          <Input placeholder="Second witness name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={marriageForm.control}
                    name="ministerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minister's Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Minister's full name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={marriageForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional information"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" /> Save Record
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          {/* First Communion Form */}
          <TabsContent value="communion">
            <Form {...communionForm}>
              <form
                onSubmit={communionForm.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={communionForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={communionForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={communionForm.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={communionForm.control}
                    name="dateOfCommunion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of First Communion</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={communionForm.control}
                    name="placeOfCommunion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place of First Communion</FormLabel>
                        <FormControl>
                          <Input placeholder="Church name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={communionForm.control}
                    name="ministerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minister's Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Minister's full name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={communionForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional information"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" /> Save Record
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          {/* Confirmation Form */}
          <TabsContent value="confirmation">
            <Form {...confirmationForm}>
              <form
                onSubmit={confirmationForm.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={confirmationForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={confirmationForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={confirmationForm.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={confirmationForm.control}
                    name="dateOfConfirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Confirmation</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={confirmationForm.control}
                    name="placeOfConfirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place of Confirmation</FormLabel>
                        <FormControl>
                          <Input placeholder="Church name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={confirmationForm.control}
                    name="sponsorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sponsor's Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Sponsor's full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={confirmationForm.control}
                    name="ministerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minister's Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Minister's full name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={confirmationForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional information"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" /> Save Record
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentForm;
