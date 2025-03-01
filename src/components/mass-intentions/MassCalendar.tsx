import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { massIntentionService } from "@/services/massIntentionService";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface MassCalendarProps {
  onSelectIntention?: (id: string) => void;
  userRole?: "priest" | "secretary";
}

const MassCalendar = ({
  onSelectIntention = () => {},
  userRole = "secretary",
}: MassCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [intentions, setIntentions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch intentions on component mount and when month changes
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

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  // Get intentions for a specific date
  const getIntentionsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return intentions.filter((intention) => {
      // Check if date is between start and end date (or equal to start date if no end date)
      if (intention.end_date) {
        return (
          intention.start_date <= dateString && intention.end_date >= dateString
        );
      }
      return intention.start_date === dateString;
    });
  };

  // Render cell content with intentions
  const renderDay = (day: Date) => {
    const dateIntentions = getIntentionsForDate(day);
    if (dateIntentions.length === 0) return null;

    return (
      <div className="w-full h-full flex flex-col">
        <div className="text-xs font-medium">{day.getDate()}</div>
        <div className="mt-1 flex flex-wrap gap-1">
          {dateIntentions.slice(0, 2).map((intention) => (
            <Badge
              key={intention.id}
              variant={
                intention.status === "completed"
                  ? "success"
                  : intention.status === "cancelled"
                    ? "destructive"
                    : "default"
              }
              className="text-[0.6rem] px-1 cursor-pointer"
              onClick={() => onSelectIntention(intention.id)}
            >
              {intention.priests?.name?.split(" ")[0] || "Misa"}
            </Badge>
          ))}
          {dateIntentions.length > 2 && (
            <Badge variant="outline" className="text-[0.6rem] px-1">
              +{dateIntentions.length - 2}
            </Badge>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Calendario de Intenciones</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">
            {currentMonth.toLocaleDateString("es-ES", {
              month: "long",
              year: "numeric",
            })}
          </div>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">{error}</div>
        ) : (
          <Calendar
            mode="default"
            month={currentMonth}
            showOutsideDays
            className="rounded-md border"
            components={{
              Day: ({ date, ...props }) => {
                return (
                  <div
                    className="h-12 w-full relative flex items-start justify-start p-1 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      const dateIntentions = getIntentionsForDate(date);
                      if (dateIntentions.length > 0) {
                        onSelectIntention(dateIntentions[0].id);
                      }
                    }}
                  >
                    {renderDay(date)}
                  </div>
                );
              },
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MassCalendar;
