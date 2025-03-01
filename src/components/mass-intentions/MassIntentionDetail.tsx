import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Calendar,
  Edit,
  Trash2,
  Check,
  X,
  ArrowLeft,
  User,
  FileText,
} from "lucide-react";

interface MassIntentionDetailProps {
  id?: string;
  name?: string;
  surname?: string;
  startDate?: string;
  endDate?: string;
  intention?: string;
  priest?: string;
  notes?: string;
  status?: "pending" | "completed" | "cancelled";
  onBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (status: "pending" | "completed" | "cancelled") => void;
  userRole?: "admin" | "secretary" | "priest";
}

const MassIntentionDetail = ({
  id = "12345",
  name = "María",
  surname = "González",
  startDate = "2023-05-15",
  endDate,
  intention = "Por el eterno descanso de Juan Pérez",
  priest = "Padre Francisco",
  notes = "Misa de aniversario",
  status = "pending",
  onBack = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onStatusChange = () => {},
  userRole = "secretary",
}: MassIntentionDetailProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

  return (
    <div className="w-full h-full bg-white p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold flex-1">
          Detalle de Intención de Misa
        </h1>
        <div className="flex space-x-2">
          {userRole === "secretary" && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={onEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Editar esta intención</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-red-500">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmar eliminación</DialogTitle>
                    <DialogDescription>
                      ¿Está seguro que desea eliminar esta intención de misa?
                      Esta acción no se puede deshacer.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        onDelete();
                        setIsDeleteDialogOpen(false);
                      }}
                    >
                      Eliminar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}

          {userRole === "priest" && (
            <div className="flex space-x-2">
              <Button
                variant={status === "pending" ? "default" : "outline"}
                onClick={() => onStatusChange("pending")}
                disabled={status === "pending"}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Pendiente
              </Button>
              <Button
                variant={status === "completed" ? "success" : "outline"}
                className={status === "completed" ? "bg-green-600" : ""}
                onClick={() => onStatusChange("completed")}
                disabled={status === "completed"}
              >
                <Check className="h-4 w-4 mr-2" />
                Completada
              </Button>
              <Button
                variant={status === "cancelled" ? "destructive" : "outline"}
                onClick={() => onStatusChange("cancelled")}
                disabled={status === "cancelled"}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelada
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">Intención de Misa</CardTitle>
                <CardDescription>ID: {id}</CardDescription>
              </div>
              <Badge variant={getStatusColor(status) as any}>
                {translateStatus(status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Información General</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Solicitante</p>
                  <p>
                    {name} {surname}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sacerdote</p>
                  <p>{priest}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p>
                    {formatDate(startDate)}
                    {endDate && ` - ${formatDate(endDate)}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <Badge variant={getStatusColor(status) as any}>
                    {translateStatus(status)}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">Intención</h3>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-gray-700">{intention}</p>
              </div>
            </div>

            {notes && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Notas Adicionales
                  </h3>
                  <p className="text-gray-700">{notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial</CardTitle>
            <CardDescription>Registro de actividad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-2 border-blue-500 pl-4 py-2">
                <p className="text-sm text-gray-500">Hoy, 10:30 AM</p>
                <p className="font-medium">Intención consultada</p>
                <p className="text-sm">Usuario: Admin</p>
              </div>
              <div className="border-l-2 border-green-500 pl-4 py-2">
                <p className="text-sm text-gray-500">{formatDate(startDate)}</p>
                <p className="font-medium">Intención creada</p>
                <p className="text-sm">Usuario: Secretario</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Ver historial completo
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default MassIntentionDetail;
