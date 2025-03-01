import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, X, Calendar, Loader2 } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { massIntentionService } from "@/services/massIntentionService";

// Define form schema
const intentionFormSchema = z.object({
  name: z.string().min(2, { message: "El nombre es requerido" }),
  surname: z.string().min(2, { message: "El apellido es requerido" }),
  startDate: z.string().min(1, { message: "La fecha de inicio es requerida" }),
  endDate: z.string().optional(),
  isDateRange: z.boolean().default(false),
  intention: z.string().min(5, { message: "La intención es requerida" }),
  priest: z.string().min(1, { message: "Seleccione un sacerdote" }),
  notes: z.string().optional(),
});

type IntentionFormValues = z.infer<typeof intentionFormSchema>;

interface IntentionFormProps {
  intentionId?: string;
  onSubmit?: (data: IntentionFormValues) => void;
  onCancel?: () => void;
  priests?: { id: string; name: string }[];
  isLoading?: boolean;
}

const IntentionForm = ({
  intentionId = "",
  onSubmit = () => {},
  onCancel = () => {},
  priests = [],
  isLoading = false,
}: IntentionFormProps) => {
  const form = useForm<IntentionFormValues>({
    resolver: zodResolver(intentionFormSchema),
    defaultValues: {
      name: "",
      surname: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      isDateRange: false,
      intention: "",
      priest: "",
      notes: "",
    },
  });

  // Load intention data if editing
  useEffect(() => {
    const loadIntention = async () => {
      if (intentionId) {
        try {
          const intention =
            await massIntentionService.getIntentionById(intentionId);
          form.reset({
            name: intention.name,
            surname: intention.surname,
            startDate: intention.start_date,
            endDate: intention.end_date || "",
            isDateRange: !!intention.end_date,
            intention: intention.intention,
            priest: intention.priest_id,
            notes: intention.notes || "",
          });
        } catch (error) {
          console.error("Error loading intention:", error);
        }
      }
    };

    loadIntention();
  }, [intentionId, form]);

  const isDateRange = form.watch("isDateRange");

  const handleSubmit = (data: IntentionFormValues) => {
    // If not a date range, remove the end date
    if (!data.isDateRange) {
      data.endDate = undefined;
    }
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {intentionId ? "Editar" : "Nueva"} Intención de Misa
        </CardTitle>
        <CardDescription>
          Complete los detalles para{" "}
          {intentionId ? "actualizar la" : "registrar una nueva"} intención de
          misa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nombre del solicitante"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Apellido del solicitante"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 mb-2">
                  <FormField
                    control={form.control}
                    name="isDateRange"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            La intención es para un rango de fechas
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {isDateRange ? "Fecha de inicio" : "Fecha"}
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isDateRange && (
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de fin</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="priest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sacerdote</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un sacerdote" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priests.map((priest) => (
                          <SelectItem key={priest.id} value={priest.id}>
                            {priest.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="intention"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intención</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describa la intención de la misa"
                      className="min-h-[100px]"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas adicionales (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Información adicional relevante"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                <X className="mr-2 h-4 w-4" /> Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Guardar
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default IntentionForm;
