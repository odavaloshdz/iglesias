import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  FileText,
  Search,
  Settings,
  Scan,
  Church,
} from "lucide-react";
import DocumentList from "../documents/DocumentList";
import DocumentForm from "../documents/DocumentForm";
import AdvancedSearch from "../search/AdvancedSearch";
import DocumentDetail from "../documents/DocumentDetail";
import DocumentScanner from "../digitalization/DocumentScanner";
import AISettings from "../settings/AISettings";
import MassIntentionsManager from "../mass-intentions/MassIntentionsManager";

type ViewType =
  | "list"
  | "form"
  | "detail"
  | "search"
  | "digitalize"
  | "ai-settings"
  | "mass-intentions";
type DocumentType = "baptism" | "marriage" | "communion" | "confirmation";

interface MainContentProps {
  defaultView?: ViewType;
  defaultDocumentType?: DocumentType;
}

const MainContent = ({
  defaultView = "list",
  defaultDocumentType = "baptism",
}: MainContentProps) => {
  const [currentView, setCurrentView] = useState<ViewType>(defaultView);
  const [selectedDocumentType, setSelectedDocumentType] =
    useState<DocumentType>(defaultDocumentType);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>("");

  // Handle document selection for viewing details
  const handleViewDocument = (id: string) => {
    setSelectedDocumentId(id);
    setCurrentView("detail");
  };

  // Handle document editing
  const handleEditDocument = (id: string) => {
    setSelectedDocumentId(id);
    setCurrentView("form");
  };

  // Handle creating a new document
  const handleCreateDocument = (type: DocumentType) => {
    setSelectedDocumentType(type);
    setSelectedDocumentId(""); // Clear any selected document ID
    setCurrentView("form");
  };

  // Handle form submission (create/edit)
  const handleFormSubmit = (data: any) => {
    console.log("Form submitted:", data);
    setCurrentView("list"); // Return to list view after submission
  };

  // Handle form cancellation
  const handleFormCancel = () => {
    setCurrentView("list");
  };

  // Handle back button from detail view
  const handleBackFromDetail = () => {
    setCurrentView("list");
  };

  // Handle search submission
  const handleSearch = (filters: any) => {
    console.log("Search filters:", filters);
    // In a real app, you would filter the documents based on these filters
    setCurrentView("list");
  };

  return (
    <div className="h-full w-full bg-gray-50 p-6 overflow-auto">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {currentView === "list" && "Documentos Sacramentales"}
          {currentView === "form" &&
            (selectedDocumentId ? "Editar Documento" : "Nuevo Documento")}
          {currentView === "detail" && "Detalle del Documento"}
          {currentView === "search" && "Búsqueda Avanzada"}
        </h1>

        <div className="flex flex-wrap gap-2">
          {currentView === "list" && (
            <>
              <Button onClick={() => setCurrentView("search")}>
                <Search className="mr-2 h-4 w-4" />
                Búsqueda Avanzada
              </Button>
              <Button onClick={() => setCurrentView("digitalize")}>
                <Scan className="mr-2 h-4 w-4" />
                Digitalizar Documento
              </Button>
              <Button onClick={() => setCurrentView("mass-intentions")}>
                <Church className="mr-2 h-4 w-4" />
                Intenciones de Misa
              </Button>
              <Button onClick={() => handleCreateDocument("baptism")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Documento
              </Button>
            </>
          )}
          {currentView === "search" && (
            <Button onClick={() => setCurrentView("list")}>
              <FileText className="mr-2 h-4 w-4" />
              Ver Todos los Documentos
            </Button>
          )}
          {currentView === "digitalize" && (
            <Button onClick={() => setCurrentView("list")}>
              <FileText className="mr-2 h-4 w-4" />
              Ver Todos los Documentos
            </Button>
          )}
          {currentView === "mass-intentions" && (
            <Button onClick={() => setCurrentView("list")}>
              <FileText className="mr-2 h-4 w-4" />
              Ver Documentos Sacramentales
            </Button>
          )}
        </div>
      </div>

      {/* Main content area */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-0">
          {currentView === "list" && (
            <Tabs defaultValue="all" className="w-full">
              <div className="border-b px-6 pt-4">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="baptism">Bautismos</TabsTrigger>
                  <TabsTrigger value="marriage">Matrimonios</TabsTrigger>
                  <TabsTrigger value="communion">Comuniones</TabsTrigger>
                  <TabsTrigger value="confirmation">Confirmaciones</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="all" className="mt-0">
                <DocumentList
                  onView={handleViewDocument}
                  onEdit={handleEditDocument}
                />
              </TabsContent>
              <TabsContent value="baptism" className="mt-0">
                <DocumentList
                  documents={[
                    {
                      id: "1",
                      type: "baptism",
                      name: "Juan Carlos Rodríguez",
                      date: "2023-05-15",
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
                  ]}
                  onView={handleViewDocument}
                  onEdit={handleEditDocument}
                />
              </TabsContent>
              <TabsContent value="marriage" className="mt-0">
                <DocumentList
                  documents={[
                    {
                      id: "2",
                      type: "marriage",
                      name: "María González & Pedro Martínez",
                      date: "2023-06-22",
                      parish: "Nuestra Señora de Guadalupe",
                      status: "active",
                    },
                  ]}
                  onView={handleViewDocument}
                  onEdit={handleEditDocument}
                />
              </TabsContent>
              <TabsContent value="communion" className="mt-0">
                <DocumentList
                  documents={[
                    {
                      id: "3",
                      type: "communion",
                      name: "Ana Lucía Fernández",
                      date: "2023-04-10",
                      parish: "Santa Rosa de Lima",
                      status: "archived",
                    },
                  ]}
                  onView={handleViewDocument}
                  onEdit={handleEditDocument}
                />
              </TabsContent>
              <TabsContent value="confirmation" className="mt-0">
                <DocumentList
                  documents={[
                    {
                      id: "4",
                      type: "confirmation",
                      name: "Roberto Sánchez",
                      date: "2023-07-05",
                      parish: "San Francisco de Asís",
                      status: "active",
                    },
                  ]}
                  onView={handleViewDocument}
                  onEdit={handleEditDocument}
                />
              </TabsContent>
            </Tabs>
          )}

          {currentView === "form" && (
            <div className="p-6">
              <DocumentForm
                documentId={selectedDocumentId}
                documentType={selectedDocumentType}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </div>
          )}

          {currentView === "detail" && (
            <DocumentDetail
              id={selectedDocumentId}
              onBack={handleBackFromDetail}
              onEdit={() => handleEditDocument(selectedDocumentId)}
            />
          )}

          {currentView === "search" && (
            <AdvancedSearch onSearch={handleSearch} />
          )}

          {currentView === "digitalize" && (
            <div className="p-6">
              <DocumentScanner
                onScanComplete={(data) => {
                  console.log("Scan completed:", data);
                  // Set the form data and navigate to form view
                  setSelectedDocumentType(data.documentType as DocumentType);
                  setCurrentView("form");
                }}
                onCancel={() => setCurrentView("list")}
              />
            </div>
          )}

          {currentView === "ai-settings" && (
            <div className="p-6">
              <AISettings
                onSave={(settings) => {
                  console.log("AI settings saved:", settings);
                  setCurrentView("list");
                }}
              />
            </div>
          )}

          {currentView === "mass-intentions" && (
            <MassIntentionsManager userRole="secretary" />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MainContent;
