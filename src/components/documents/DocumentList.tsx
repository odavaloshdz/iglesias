import React, { useState } from "react";
import {
  Search,
  FileText,
  Edit,
  Trash2,
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Document {
  id: string;
  type: "baptism" | "marriage" | "communion" | "confirmation";
  name: string;
  date: string;
  parish: string;
  status: "active" | "archived";
}

interface DocumentListProps {
  documents?: Document[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onGeneratePdf?: (id: string) => void;
}

const DocumentList = ({
  documents = [
    {
      id: "1",
      type: "baptism",
      name: "Juan Carlos Rodríguez",
      date: "2023-05-15",
      parish: "San Francisco de Asís",
      status: "active",
    },
    {
      id: "2",
      type: "marriage",
      name: "María González & Pedro Martínez",
      date: "2023-06-22",
      parish: "Nuestra Señora de Guadalupe",
      status: "active",
    },
    {
      id: "3",
      type: "communion",
      name: "Ana Lucía Fernández",
      date: "2023-04-10",
      parish: "Santa Rosa de Lima",
      status: "archived",
    },
    {
      id: "4",
      type: "confirmation",
      name: "Roberto Sánchez",
      date: "2023-07-05",
      parish: "San Francisco de Asís",
      status: "active",
    },
    {
      id: "5",
      type: "baptism",
      name: "Sofía Ramírez",
      date: "2023-03-18",
      parish: "Nuestra Señora de Guadalupe",
      status: "active",
    },
  ],
  onView = (id) => console.log(`View document ${id}`),
  onEdit = (id) => console.log(`Edit document ${id}`),
  onDelete = (id) => console.log(`Delete document ${id}`),
  onGeneratePdf = (id) => console.log(`Generate PDF for document ${id}`),
}: DocumentListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Document;
    direction: "ascending" | "descending";
  } | null>(null);

  // Handle sorting
  const requestSort = (key: keyof Document) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort documents
  const filteredDocuments = documents
    .filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.parish.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType ? doc.type === selectedType : true;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;

      const { key, direction } = sortConfig;
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

  // Get sort direction indicator
  const getSortDirectionIcon = (key: keyof Document) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
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

  // Get badge color based on document type
  const getTypeColor = (type: string) => {
    switch (type) {
      case "baptism":
        return "default";
      case "marriage":
        return "secondary";
      case "communion":
        return "outline";
      case "confirmation":
        return "destructive";
      default:
        return "default";
    }
  };

  // Translate document type to Spanish
  const translateType = (type: string) => {
    switch (type) {
      case "baptism":
        return "Bautismo";
      case "marriage":
        return "Matrimonio";
      case "communion":
        return "Comunión";
      case "confirmation":
        return "Confirmación";
      default:
        return type;
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Documentos Sacramentales
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o parroquia"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Tipo de documento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="baptism">Bautismo</SelectItem>
              <SelectItem value="marriage">Matrimonio</SelectItem>
              <SelectItem value="communion">Comunión</SelectItem>
              <SelectItem value="confirmation">Confirmación</SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filtros avanzados
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableCaption>Lista de documentos sacramentales</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("type")}
              >
                <div className="flex items-center">
                  Tipo {getSortDirectionIcon("type")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("name")}
              >
                <div className="flex items-center">
                  Nombre {getSortDirectionIcon("name")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("date")}
              >
                <div className="flex items-center">
                  Fecha {getSortDirectionIcon("date")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("parish")}
              >
                <div className="flex items-center">
                  Parroquia {getSortDirectionIcon("parish")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("status")}
              >
                <div className="flex items-center">
                  Estado {getSortDirectionIcon("status")}
                </div>
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <Badge variant={getTypeColor(document.type) as any}>
                      {translateType(document.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{document.name}</TableCell>
                  <TableCell>{formatDate(document.date)}</TableCell>
                  <TableCell>{document.parish}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        document.status === "active" ? "default" : "outline"
                      }
                    >
                      {document.status === "active" ? "Activo" : "Archivado"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(document.id)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(document.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onGeneratePdf(document.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView(document.id)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(document.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onGeneratePdf(document.id)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Generar PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(document.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-500"
                >
                  No se encontraron documentos que coincidan con los criterios
                  de búsqueda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DocumentList;
