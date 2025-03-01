import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  FileText,
  Calendar,
  UserCog,
  AlertCircle,
} from "lucide-react";
import IntentionList from "./IntentionList";
import IntentionForm from "./IntentionForm";
import MassIntentionDetail from "./MassIntentionDetail";
import MassCalendar from "./MassCalendar";
import MassIntentionReport from "./MassIntentionReport";
import { massIntentionService } from "@/services/massIntentionService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ViewType = "list" | "form" | "detail" | "calendar" | "report";

interface MassIntentionsManagerProps {
  userRole?: "priest" | "secretary";
}

const MassIntentionsManager = ({
  userRole = "secretary",
}: MassIntentionsManagerProps) => {
  const [currentView, setCurrentView] = useState<ViewType>("list");
  const [selectedIntentionId, setSelectedIntentionId] = useState<string>("");
  const [intentions, setIntentions] = useState<any[]>([]);
  const [filteredIntentions, setFilteredIntentions] = useState<any[]>([]);
  const [selectedIntention, setSelectedIntention] = useState<any>(null);
  const [priests, setPriests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch intentions and priests on component mount
  useEffect(() => {
    fetchIntentions();
    fetchPriests();
  }, []);

  // Fetch all intentions
  const fetchIntentions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await massIntentionService.getIntentions();
      setIntentions(data);
      setFilteredIntentions(data);
    } catch (err) {
      console.error("Error fetching intentions:", err);
      setError(
        "Error al cargar las intenciones de misa. Por favor, intente nuevamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch priests for the form
  const fetchPriests = async () => {
    try {
      const data = await massIntentionService.getPriests();
      setPriests(data);
    } catch (err) {
      console.error("Error fetching priests:", err);
    }
  };

  // Filter intentions based on tab
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredIntentions(intentions);
    } else if (activeTab === "today") {
      const today = new Date().toISOString().split("T")[0];
      const todayIntentions = intentions.filter((intention) => {
        // Check if today is between start and end date (or equal to start date if no end date)
        if (intention.end_date) {
          return intention.start_date <= today && intention.end_date >= today;
        }
        return intention.start_date === today;
      });
      setFilteredIntentions(todayIntentions);
    } else {
      // Filter by status (pending, completed, cancelled)
      setFilteredIntentions(
        intentions.filter((intention) => intention.status === activeTab),
      );
    }
  }, [activeTab, intentions]);

  // Handle intention selection for viewing details
  const handleViewIntention = async (id: string) => {
    try {
      const intention = await massIntentionService.getIntentionById(id);
      setSelectedIntention(intention);
      setSelectedIntentionId(id);
      setCurrentView("detail");
    } catch (err) {
      console.error("Error fetching intention details:", err);
      setError(
        "Error al cargar los detalles de la intención. Por favor, intente nuevamente.",
      );
    }
  };

  // Handle intention selection for editing
  const handleEditIntention = async (id: string) => {
    try {
      const intention = await massIntentionService.getIntentionById(id);
      setSelectedIntention(intention);
      setSelectedIntentionId(id);
      setCurrentView("form");
    } catch (err) {
      console.error("Error fetching intention for edit:", err);
      setError(
        "Error al cargar la intención para editar. Por favor, intente nuevamente.",
      );
    }
  };

  // Handle creating a new intention
  const handleCreateIntention = () => {
    setSelectedIntention(null);
    setSelectedIntentionId(""); // Clear any selected intention ID
    setCurrentView("form");
  };

  // Handle form submission (create/edit)
  const handleFormSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      if (selectedIntentionId) {
        // Update existing intention
        await massIntentionService.updateIntention(selectedIntentionId, {
          name: data.name,
          surname: data.surname,
          start_date: data.startDate,
          end_date: data.isDateRange ? data.endDate : null,
          intention: data.intention,
          priest_id: data.priest,
          notes: data.notes,
        });
      } else {
        // Create new intention
        await massIntentionService.createIntention({
          name: data.name,
          surname: data.surname,
          start_date: data.startDate,
          end_date: data.isDateRange ? data.endDate : null,
          intention: data.intention,
          priest_id: data.priest,
          notes: data.notes,
          status: "pending",
        });
      }
      // Refresh intentions list
      await fetchIntentions();
      setCurrentView("list");
    } catch (err) {
      console.error("Error saving intention:", err);
      setError("Error al guardar la intención. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form cancellation
  const handleFormCancel = () => {
    setCurrentView("list");
  };

  // Handle status change
  const handleStatusChange = async (
    id: string,
    status: "pending" | "completed" | "cancelled",
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await massIntentionService.updateIntentionStatus(id, status);
      // Refresh intentions list
      await fetchIntentions();
      // If in detail view, refresh the selected intention
      if (currentView === "detail" && selectedIntentionId === id) {
        const updatedIntention =
          await massIntentionService.getIntentionById(id);
        setSelectedIntention(updatedIntention);
      }
    } catch (err) {
      console.error("Error updating intention status:", err);
      setError(
        "Error al actualizar el estado de la intención. Por favor, intente nuevamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle intention deletion
  const handleDeleteIntention = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await massIntentionService.deleteIntention(id);
      // Refresh intentions list
      await fetchIntentions();
      setCurrentView("list");
    } catch (err) {
      console.error("Error deleting intention:", err);
      setError(
        "Error al eliminar la intención. Por favor, intente nuevamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-gray-50 p-6 overflow-auto">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {currentView === "list" && "Intenciones de Misa"}
          {currentView === "form" &&
            (selectedIntentionId ? "Editar Intención" : "Nueva Intención")}
          {currentView === "detail" && "Detalle de Intención"}
          {currentView === "calendar" && "Calendario de Intenciones"}
          {currentView === "report" && "Reportes de Intenciones"}
        </h1>

        <div className="flex flex-wrap gap-2">
          {currentView === "list" && userRole === "secretary" && (
            <Button onClick={handleCreateIntention}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Intención
            </Button>
          )}
          {currentView === "list" && (
            <>
              <Button
                variant="outline"
                onClick={() => setCurrentView("calendar")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Ver Calendario
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentView("report")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Reportes
              </Button>
            </>
          )}
          {(currentView === "detail" ||
            currentView === "form" ||
            currentView === "calendar") && (
            <Button onClick={() => setCurrentView("list")}>
              <FileText className="mr-2 h-4 w-4" />
              Ver Lista
            </Button>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main content area */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-0">
          {currentView === "list" && (
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
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
                  intentions={filteredIntentions}
                  onView={handleViewIntention}
                  onEdit={handleEditIntention}
                  onDelete={handleDeleteIntention}
                  onStatusChange={handleStatusChange}
                  isLoading={isLoading}
                />
              </TabsContent>
              <TabsContent value="pending" className="mt-0">
                <IntentionList
                  userRole={userRole}
                  intentions={filteredIntentions}
                  onView={handleViewIntention}
                  onEdit={handleEditIntention}
                  onDelete={handleDeleteIntention}
                  onStatusChange={handleStatusChange}
                  isLoading={isLoading}
                />
              </TabsContent>
              <TabsContent value="completed" className="mt-0">
                <IntentionList
                  userRole={userRole}
                  intentions={filteredIntentions}
                  onView={handleViewIntention}
                  onEdit={handleEditIntention}
                  onDelete={handleDeleteIntention}
                  onStatusChange={handleStatusChange}
                  isLoading={isLoading}
                />
              </TabsContent>
              <TabsContent value="cancelled" className="mt-0">
                <IntentionList
                  userRole={userRole}
                  intentions={filteredIntentions}
                  onView={handleViewIntention}
                  onEdit={handleEditIntention}
                  onDelete={handleDeleteIntention}
                  onStatusChange={handleStatusChange}
                  isLoading={isLoading}
                />
              </TabsContent>
              {userRole === "priest" && (
                <TabsContent value="today" className="mt-0">
                  <IntentionList
                    userRole={userRole}
                    intentions={filteredIntentions}
                    onView={handleViewIntention}
                    onEdit={handleEditIntention}
                    onDelete={handleDeleteIntention}
                    onStatusChange={handleStatusChange}
                    isLoading={isLoading}
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
                priests={priests}
                isLoading={isLoading}
              />
            </div>
          )}

          {currentView === "detail" && selectedIntention && (
            <MassIntentionDetail
              id={selectedIntention.id}
              name={selectedIntention.name}
              surname={selectedIntention.surname}
              startDate={selectedIntention.start_date}
              endDate={selectedIntention.end_date}
              intention={selectedIntention.intention}
              priest={selectedIntention.priests?.name}
              notes={selectedIntention.notes}
              status={selectedIntention.status}
              onBack={() => setCurrentView("list")}
              onEdit={() => handleEditIntention(selectedIntention.id)}
              onDelete={() => handleDeleteIntention(selectedIntention.id)}
              onStatusChange={(status) =>
                handleStatusChange(selectedIntention.id, status)
              }
              userRole={userRole}
            />
          )}

          {currentView === "report" && (
            <MassIntentionReport onBack={() => setCurrentView("list")} />
          )}

          {currentView === "calendar" && (
            <div className="p-6">
              <MassCalendar
                onSelectIntention={handleViewIntention}
                userRole={userRole}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MassIntentionsManager;
