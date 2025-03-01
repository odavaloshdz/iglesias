import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { massIntentionService } from "@/services/massIntentionService";
import { Printer, Download, ArrowLeft, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface MassIntentionReportProps {
  onBack?: () => void;
  priestId?: string;
  startDate?: string;
  endDate?: string;
}

const MassIntentionReport = ({
  onBack = () => {},
  priestId,
  startDate = new Date().toISOString().split("T")[0],
  endDate,
}: MassIntentionReportProps) => {
  const [intentions, setIntentions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportType, setReportType] = useState<string>("daily");

  // Fetch intentions on component mount
  useEffect(() => {
    fetchIntentions();
  }, []);

  // Fetch all intentions
  const fetchIntentions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await massIntentionService.getIntentions();
      setIntentions(data);
    } catch (err) {
      console.error("Error fetching intentions:", err);
      setError("Error al cargar las intenciones de misa.");
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "default";
      case "completed":
        return "success";
      case "cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  // Translate status to Spanish
  const translateStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "completed":
        return "Completada";
      case "cancelled":
        return "Cancelada";
      default:
        return status;
    }
  };

  // Filter intentions based on report type
  const filteredIntentions = intentions.filter((intention) => {
    if (reportType === "daily") {
      // Today's intentions
      const today = new Date().toISOString().split("T")[0];
      if (intention.end_date) {
        return intention.start_date <= today && intention.end_date >= today;
      }
      return intention.start_date === today;
    } else if (reportType === "weekly") {
      // This week's intentions
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
      const endOfWeek = new Date(today);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday

      const startDate = startOfWeek.toISOString().split("T")[0];
      const endDate = endOfWeek.toISOString().split("T")[0];

      if (intention.end_date) {
        return (
          intention.start_date <= endDate && intention.end_date >= startDate
        );
      }
      return (
        intention.start_date >= startDate && intention.start_date <= endDate
      );
    } else if (reportType === "monthly") {
      // This month's intentions
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const startDate = startOfMonth.toISOString().split("T")[0];
      const endDate = endOfMonth.toISOString().split("T")[0];

      if (intention.end_date) {
        return (
          intention.start_date <= endDate && intention.end_date >= startDate
        );
      }
      return (
        intention.start_date >= startDate && intention.start_date <= endDate
      );
    }
    return true; // All intentions
  });

  // Group intentions by date
  const groupedIntentions = filteredIntentions.reduce(
    (acc, intention) => {
      const date = intention.start_date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(intention);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  // Sort dates
  const sortedDates = Object.keys(groupedIntentions).sort();

  // Handle print report
  const handlePrint = () => {
    window.print();
  };

  // Handle download report as PDF
  const handleDownload = () => {
    alert("Funcionalidad de descarga en desarrollo");
  };

  return (
    <div className="w-full bg-white p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold flex-1">
          Reporte de Intenciones de Misa
        </h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Descargar PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Intenciones de Misa</CardTitle>
          <CardDescription>
            Reporte de intenciones de misa según el período seleccionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="daily"
            value={reportType}
            onValueChange={setReportType}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="daily">Diario</TabsTrigger>
              <TabsTrigger value="weekly">Semanal</TabsTrigger>
              <TabsTrigger value="monthly">Mensual</TabsTrigger>
              <TabsTrigger value="all">Todos</TabsTrigger>
            </TabsList>

            {isLoading ? (
              <div className="flex justify-center items-center h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500 p-4">{error}</div>
            ) : filteredIntentions.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                No hay intenciones de misa para el período seleccionado.
              </div>
            ) : (
              <div className="space-y-6">
                {sortedDates.map((date) => (
                  <div key={date} className="border rounded-md overflow-hidden">
                    <div className="bg-gray-50 p-3 font-medium">
                      {formatDate(date)}
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Solicitante</TableHead>
                          <TableHead>Intención</TableHead>
                          <TableHead>Sacerdote</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {groupedIntentions[date].map((intention) => (
                          <TableRow key={intention.id}>
                            <TableCell className="font-medium">
                              {intention.name} {intention.surname}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {intention.intention}
                            </TableCell>
                            <TableCell>{intention.priests?.name}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  getStatusColor(intention.status) as any
                                }
                              >
                                {translateStatus(intention.status)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            )}
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            Total de intenciones: {filteredIntentions.length}
          </div>
          <div className="text-sm text-gray-500">
            Generado el: {new Date().toLocaleDateString()}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MassIntentionReport;
