import React, { useState } from "react";
import {
  Search,
  Calendar,
  Edit,
  Trash2,
  Filter,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Check,
  X,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface MassIntention {
  id: string;
  name: string;
  surname: string;
  startDate: string;
  endDate?: string;
  intention: string;
  status: "pending" | "completed" | "cancelled";
  priest?: string;
}

interface IntentionListProps {
  intentions?: MassIntention[];
  userRole?: "priest" | "secretary";
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (
    id: string,
    status: "pending" | "completed" | "cancelled",
  ) => void;
}

const IntentionList = ({
  intentions = [
    {
      id: "1",
      name: "María",
      surname: "González",
      startDate: "2023-05-15",
      intention: "Por el eterno descanso de Juan Pérez",
      status: "pending",
      priest: "Padre Francisco",
    },
    {
      id: "2",
      name: "Carlos",
      surname: "Rodríguez",
      startDate: "2023-05-20",
      endDate: "2023-05-27",
      intention: "Por la salud de la familia Rodríguez",
      status: "pending",
      priest: "Padre Antonio",
    },
    {
      id: "3",
      name: "Ana",
      surname: "Martínez",
      startDate: "2023-05-10",
      intention: "En acción de gracias",
      status: "completed",
      priest: "Padre Francisco",
    },
    {
      id: "4",
      name: "José",
      surname: "López",
      startDate: "2023-06-01",
      endDate: "2023-06-30",
      intention: "Por las almas del purgatorio",
      status: "pending",
      priest: "Padre Miguel",
    },
    {
      id: "5",
      name: "Luisa",
      surname: "Fernández",
      startDate: "2023-05-12",
      intention: "Por los enfermos de la parroquia",
      status: "cancelled",
      priest: "Padre Antonio",
    },
  ],
  userRole = "secretary",
  onView = (id) => console.log(`View intention ${id}`),
  onEdit = (id) => console.log(`Edit intention ${id}`),
  onDelete = (id) => console.log(`Delete intention ${id}`),
  onStatusChange = (id, status) =>
    console.log(`Change status of ${id} to ${status}`),
}: IntentionListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof MassIntention;
    direction: "ascending" | "descending";
  } | null>(null);

  // Handle sorting
  const requestSort = (key: keyof MassIntention) => {
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

  // Filter and sort intentions
  const filteredIntentions = intentions
    .filter((intention) => {
      const matchesSearch =
        intention.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intention.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intention.intention.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus
        ? intention.status === selectedStatus
        : true;
      return matchesSearch && matchesStatus;
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
  const getSortDirectionIcon = (key: keyof MassIntention) => {
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

  // Format date range
  const formatDateRange = (startDate: string, endDate?: string) => {
    if (!endDate) return formatDate(startDate);
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
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

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Intenciones de Misa
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o intención"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="completed">Completada</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
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
          <TableCaption>Lista de intenciones de misa</TableCaption>
          <TableHeader>
            <TableRow>
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
                onClick={() => requestSort("startDate")}
              >
                <div className="flex items-center">
                  Fecha {getSortDirectionIcon("startDate")}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">Intención</div>
              </TableHead>
              {userRole === "priest" && (
                <TableHead>
                  <div className="flex items-center">Solicitante</div>
                </TableHead>
              )}
              {userRole === "secretary" && (
                <TableHead>
                  <div className="flex items-center">Sacerdote</div>
                </TableHead>
              )}
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
            {filteredIntentions.length > 0 ? (
              filteredIntentions.map((intention) => (
                <TableRow key={intention.id}>
                  <TableCell className="font-medium">
                    {intention.name} {intention.surname}
                  </TableCell>
                  <TableCell>
                    {formatDateRange(intention.startDate, intention.endDate)}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {intention.intention}
                  </TableCell>
                  {userRole === "priest" && (
                    <TableCell>
                      {intention.name} {intention.surname}
                    </TableCell>
                  )}
                  {userRole === "secretary" && (
                    <TableCell>{intention.priest}</TableCell>
                  )}
                  <TableCell>
                    <Badge variant={getStatusColor(intention.status) as any}>
                      {translateStatus(intention.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {userRole === "priest" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              onStatusChange(intention.id, "completed")
                            }
                            disabled={intention.status === "completed"}
                            title="Marcar como completada"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              onStatusChange(intention.id, "cancelled")
                            }
                            disabled={intention.status === "cancelled"}
                            title="Cancelar intención"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {userRole === "secretary" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(intention.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => onEdit(intention.id)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onDelete(intention.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={userRole === "priest" ? 6 : 6}
                  className="text-center py-8 text-gray-500"
                >
                  No se encontraron intenciones que coincidan con los criterios
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

export default IntentionList;
