import React, { useState } from "react";
import { Search, Calendar, Filter, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import DatePickerWithRange from "../ui/date-picker-with-range";

interface AdvancedSearchProps {
  onSearch?: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

interface SearchFilters {
  query: string;
  documentType: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  parish?: string;
  book?: string;
  page?: string;
  includeArchived?: boolean;
}

const AdvancedSearch = ({
  onSearch = () => {},
  isLoading = false,
}: AdvancedSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    documentType: "all",
    parish: "",
    book: "",
    page: "",
    includeArchived: false,
  });

  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFilters((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      documentType: "all",
      parish: "",
      book: "",
      page: "",
      includeArchived: false,
    });
  };

  return (
    <div className="w-full bg-background p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">
            Búsqueda Avanzada de Documentos
          </CardTitle>
          <CardDescription>
            Busque documentos sacramentales utilizando múltiples criterios de
            filtrado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch}>
            <div className="flex flex-col space-y-4">
              {/* Main search bar */}
              <div className="flex w-full items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="query"
                    placeholder="Buscar por nombre, apellido o número de documento..."
                    className="pl-10"
                    value={filters.query}
                    onChange={handleInputChange}
                  />
                </div>
                <Select
                  value={filters.documentType}
                  onValueChange={(value) =>
                    handleSelectChange("documentType", value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los documentos</SelectItem>
                    <SelectItem value="baptism">Bautismo</SelectItem>
                    <SelectItem value="marriage">Matrimonio</SelectItem>
                    <SelectItem value="communion">Primera Comunión</SelectItem>
                    <SelectItem value="confirmation">Confirmación</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  {isFilterExpanded ? "Ocultar filtros" : "Mostrar filtros"}
                </Button>
              </div>

              {/* Advanced filters */}
              {isFilterExpanded && (
                <div className="grid grid-cols-1 gap-4 rounded-md border p-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="parish">Parroquia</Label>
                    <Input
                      id="parish"
                      name="parish"
                      placeholder="Nombre de la parroquia"
                      value={filters.parish}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="book">Libro</Label>
                    <Input
                      id="book"
                      name="book"
                      placeholder="Número o nombre del libro"
                      value={filters.book}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="page">Página</Label>
                    <Input
                      id="page"
                      name="page"
                      placeholder="Número de página"
                      value={filters.page}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2 lg:col-span-3">
                    <Label>Rango de fechas</Label>
                    <DatePickerWithRange className="w-full" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeArchived"
                      checked={filters.includeArchived}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "includeArchived",
                          checked as boolean,
                        )
                      }
                    />
                    <Label htmlFor="includeArchived">
                      Incluir documentos archivados
                    </Label>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <Button type="button" variant="outline" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" /> Limpiar filtros
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Buscando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Search className="mr-2 h-4 w-4" /> Buscar
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedSearch;
