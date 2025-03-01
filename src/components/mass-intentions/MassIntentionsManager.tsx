import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { PlusCircle, FileText, Calendar, UserCog } from "lucide-react";
import IntentionList from "./IntentionList";
import IntentionForm from "./IntentionForm";

type ViewType = "list" | "form" | "calendar";

interface MassIntentionsManagerProps {
  userRole?: "priest" | "secretary";
}

const MassIntentionsManager = ({
  userRole = "secretary",
}: MassIntentionsManagerProps) => {
  const [currentView, setCurrentView] = useState<ViewType>("list");
  const [selectedIntentionId, setSelectedIntentionId] = useState<string>("");

  // Handle intention selection for editing
  const handleEditIntention = (id: string) => {
    setSelectedIntentionId(id);
    setCurrentView("form");
  };

  // Handle creating a new intention
  const handleCreateIntention = () => {
    setSelectedIntentionId(""); // Clear any selected intention ID
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

  // Handle status change
  const handleStatusChange = (
    id: string,
    status: "pending" | "completed" | "cancelled",
  ) => {
    console.log(`Changing status of intention ${id} to ${status}`);
    // In a real app, you would update the status in your database
  };

  return (
    <div className="h-full w-full bg-gray-50 p-6 overflow-auto">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {currentView === "list" && "Intenciones de Misa"}
          {currentView === "form" &&
            (selectedIntentionId ? "Editar Intención" : "Nueva Intención")}
          {currentView === "calendar" && "Calendario de Intenciones"}
        </h1>

        <div className="flex flex-wrap gap-2">
          {currentView === "list" && userRole === "secretary" && (
            <Button onClick={handleCreateIntention}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Intención
            </Button>
          )}
          {currentView === "list" && (
            <Button
              variant="outline"
              onClick={() => setCurrentView("calendar")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Ver Calendario
            </Button>
          )}
          {currentView === "calendar" && (
            <Button onClick={() => setCurrentView("list")}>
              <FileText className="mr-2 h-4 w-4" />
              Ver Lista
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
                  <TabsTrigger value="all">Todas</TabsTrigger>
                  <TabsTrigger value="pending">Pendientes</TabsTrigger>
                  <TabsTrigger value="completed">Completadas</TabsTrigger>
                  <TabsTrigger value="cancelled">Canceladas</TabsTrigger>
                  {userRole === "priest" && (
                    <TabsTrigger value="today">Hoy</TabsTrigger>
                  )}
                </TabsList>
              </div>
              <TabsContent value="all" className="mt-0">
                <IntentionList
                  userRole={userRole}
                  onEdit={handleEditIntention}
                  onStatusChange={handleStatusChange}
                />
              </TabsContent>
              <TabsContent value="pending" className="mt-0">
                <IntentionList
                  userRole={userRole}
                  intentions={[
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
                      id: "4",
                      name: "José",
                      surname: "López",
                      startDate: "2023-06-01",
                      endDate: "2023-06-30",
                      intention: "Por las almas del purgatorio",
                      status: "pending",
                      priest: "Padre Miguel",
                    },
                  ]}
                  onEdit={handleEditIntention}
                  onStatusChange={handleStatusChange}
                />
              </TabsContent>
              <TabsContent value="completed" className="mt-0">
                <IntentionList
                  userRole={userRole}
                  intentions={[
                    {
                      id: "3",
                      name: "Ana",
                      surname: "Martínez",
                      startDate: "2023-05-10",
                      intention: "En acción de gracias",
                      status: "completed",
                      priest: "Padre Francisco",
                    },
                  ]}
                  onEdit={handleEditIntention}
                  onStatusChange={handleStatusChange}
                />
              </TabsContent>
              <TabsContent value="cancelled" className="mt-0">
                <IntentionList
                  userRole={userRole}
                  intentions={[
                    {
                      id: "5",
                      name: "Luisa",
                      surname: "Fernández",
                      startDate: "2023-05-12",
                      intention: "Por los enfermos de la parroquia",
                      status: "cancelled",
                      priest: "Padre Antonio",
                    },
                  ]}
                  onEdit={handleEditIntention}
                  onStatusChange={handleStatusChange}
                />
              </TabsContent>
              {userRole === "priest" && (
                <TabsContent value="today" className="mt-0">
                  <IntentionList
                    userRole={userRole}
                    intentions={[
                      {
                        id: "1",
                        name: "María",
                        surname: "González",
                        startDate: new Date().toISOString().split("T")[0],
                        intention: "Por el eterno descanso de Juan Pérez",
                        status: "pending",
                        priest: "Padre Francisco",
                      },
                    ]}
                    onEdit={handleEditIntention}
                    onStatusChange={handleStatusChange}
                  />
                </TabsContent>
              )}
            </Tabs>
          )}

          {currentView === "form" && userRole === "secretary" && (
            <div className="p-6">
              <IntentionForm
                intentionId={selectedIntentionId}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </div>
          )}

          {currentView === "calendar" && (
            <div className="p-6">
              <div className="text-center p-12 border rounded-md">
                <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Vista de Calendario
                </h3>
                <p className="text-gray-500 mb-4">
                  Aquí se mostrará un calendario con todas las intenciones de
                  misa programadas.
                </p>
                <p className="text-sm text-gray-400">
                  Funcionalidad en desarrollo
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MassIntentionsManager;
