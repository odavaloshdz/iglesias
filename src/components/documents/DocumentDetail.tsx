import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import {
  FileText,
  Edit,
  Printer,
  Mail,
  Download,
  Eye,
  ArrowLeft,
} from "lucide-react";

interface Person {
  name: string;
  surname: string;
  birthDate: string;
  birthPlace: string;
}

interface DocumentDetailProps {
  id?: string;
  type?: "baptism" | "marriage" | "communion" | "confirmation";
  date?: string;
  number?: string;
  book?: string;
  page?: string;
  people?: Person[];
  priest?: string;
  church?: string;
  notes?: string;
  onBack?: () => void;
  onEdit?: () => void;
}

const DocumentDetail = ({
  id = "12345",
  type = "baptism",
  date = "2023-05-15",
  number = "B-2023-0042",
  book = "15",
  page = "42",
  people = [
    {
      name: "Juan Carlos",
      surname: "Rodríguez Pérez",
      birthDate: "2023-01-10",
      birthPlace: "Madrid, España",
    },
  ],
  priest = "Padre Miguel Ángel Fernández",
  church = "Parroquia Santa María",
  notes = "Padrinos: Ana María López y Pedro Sánchez",
  onBack = () => {},
  onEdit = () => {},
}: DocumentDetailProps) => {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(true);
  const [emailAddress, setEmailAddress] = useState("");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDocumentTypeLabel = (type: string) => {
    const types = {
      baptism: "Bautismo",
      marriage: "Matrimonio",
      communion: "Primera Comunión",
      confirmation: "Confirmación",
    };
    return types[type as keyof typeof types] || type;
  };

  const getDocumentTypeColor = (type: string) => {
    const colors = {
      baptism: "bg-blue-100 text-blue-800",
      marriage: "bg-pink-100 text-pink-800",
      communion: "bg-yellow-100 text-yellow-800",
      confirmation: "bg-purple-100 text-purple-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="w-full h-full bg-white p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold flex-1">Detalle del Documento</h1>
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar este documento</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Imprimir certificado</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Enviar por Email
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enviar Certificado por Email</DialogTitle>
                <DialogDescription>
                  Ingrese la dirección de correo electrónico donde desea enviar
                  el certificado.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Dirección de Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full p-2 border rounded-md"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="ejemplo@correo.com"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEmailDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button>Enviar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PDF
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Descargar certificado en PDF</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">
                  Acta de {getDocumentTypeLabel(type)}
                </CardTitle>
                <CardDescription>Número: {number}</CardDescription>
              </div>
              <Badge className={getDocumentTypeColor(type)}>
                {getDocumentTypeLabel(type)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Detalles</TabsTrigger>
                <TabsTrigger value="preview">Vista Previa</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Información General
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Fecha</p>
                        <p>{formatDate(date)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Iglesia</p>
                        <p>{church}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Libro</p>
                        <p>{book}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Página</p>
                        <p>{page}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Celebrante</p>
                        <p>{priest}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-2">Personas</h3>
                    {people.map((person, index) => (
                      <div key={index} className="mb-4 p-4 border rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Nombre</p>
                            <p>{person.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Apellidos</p>
                            <p>{person.surname}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Fecha de Nacimiento
                            </p>
                            <p>{formatDate(person.birthDate)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Lugar de Nacimiento
                            </p>
                            <p>{person.birthPlace}</p>
                          </div>
                        </div>
                      </div>
                    ))}
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
                </div>
              </TabsContent>
              <TabsContent value="preview">
                <div className="border rounded-md p-6 min-h-[400px] flex flex-col items-center justify-center">
                  <div className="flex flex-col items-center mb-6">
                    <FileText className="h-16 w-16 text-gray-400 mb-2" />
                    <p className="text-lg font-medium">
                      Vista Previa del Certificado
                    </p>
                  </div>
                  <Button>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Certificado Completo
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial del Documento</CardTitle>
            <CardDescription>Registro de actividad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-2 border-blue-500 pl-4 py-2">
                <p className="text-sm text-gray-500">Hoy, 10:30 AM</p>
                <p className="font-medium">Documento consultado</p>
                <p className="text-sm">Usuario: Admin</p>
              </div>
              <div className="border-l-2 border-green-500 pl-4 py-2">
                <p className="text-sm text-gray-500">{formatDate(date)}</p>
                <p className="font-medium">Documento creado</p>
                <p className="text-sm">Usuario: Secretario</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Ver historial completo
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DocumentDetail;
