import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, X, Calendar } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Checkbox } from "../ui/checkbox";

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
}

const IntentionForm = ({
  intentionId = "",
  onSubmit = () => {},
  onCancel = () => {},
  priests = [
    { id: "1", name: "Padre Francisco" },
    { id: "2", name: "Padre Antonio" },
    { id: "3", name: "Padre Miguel" },
  ],
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
                      <Input placeholder="Nombre del solicitante" {...field} />
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
                      <Input type="date" {...field} />
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
                        <Input type="date" {...field} />
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="mr-2 h-4 w-4" /> Cancelar
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> Guardar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default IntentionForm;
