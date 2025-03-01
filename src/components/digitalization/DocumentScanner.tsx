import React, { useState } from "react";
import {
  Upload,
  Camera,
  Scan,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface DocumentScannerProps {
  onScanComplete?: (data: any) => void;
  onCancel?: () => void;
}

const DocumentScanner = ({
  onScanComplete = () => {},
  onCancel = () => {},
}: DocumentScannerProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<string>("baptism");
  const [aiModel, setAiModel] = useState<string>("openai");
  const [apiKey, setApiKey] = useState<string>("");

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      setScanResult(null);
      setError(null);
    }
  };

  // Handle camera capture
  const handleCameraCapture = () => {
    // In a real implementation, this would access the device camera
    // For now, we'll just show a message
    setError("La funcionalidad de cámara no está implementada en esta demo.");
  };

  // Process the document with AI
  const processDocument = async () => {
    if (!selectedFile) {
      setError("Por favor, seleccione una imagen para digitalizar.");
      return;
    }

    if (!apiKey) {
      setError("Por favor, configure una clave API en la configuración.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock response based on document type
      let mockData;

      switch (documentType) {
        case "baptism":
          mockData = {
            firstName: "Juan Carlos",
            lastName: "Rodríguez Pérez",
            dateOfBirth: "2023-01-10",
            dateOfBaptism: "2023-05-15",
            placeOfBaptism: "Parroquia Santa María",
            fatherName: "Carlos Rodríguez",
            motherName: "Ana Pérez",
            godparentName: "Miguel Ángel López",
            ministerName: "Padre Francisco Gómez",
            notes: "Ceremonia realizada después de la misa dominical.",
          };
          break;
        case "marriage":
          mockData = {
            groomFirstName: "Pedro",
            groomLastName: "Martínez",
            brideFirstName: "María",
            brideLastName: "González",
            dateOfMarriage: "2023-06-22",
            placeOfMarriage: "Catedral Metropolitana",
            witnessName1: "Juan Pérez",
            witnessName2: "Luisa Fernández",
            ministerName: "Padre Antonio Ramírez",
            notes: "Ceremonia con 150 invitados.",
          };
          break;
        case "communion":
          mockData = {
            firstName: "Ana Lucía",
            lastName: "Fernández",
            dateOfBirth: "2015-08-12",
            dateOfCommunion: "2023-04-10",
            placeOfCommunion: "Parroquia San José",
            ministerName: "Padre Miguel Torres",
            notes: "Primera comunión en grupo de 25 niños.",
          };
          break;
        case "confirmation":
          mockData = {
            firstName: "Roberto",
            lastName: "Sánchez",
            dateOfBirth: "2008-03-25",
            dateOfConfirmation: "2023-07-05",
            placeOfConfirmation: "Parroquia San Francisco",
            sponsorName: "Carlos Mendoza",
            ministerName: "Obispo Javier Rodríguez",
            notes: "Confirmación realizada durante visita pastoral.",
          };
          break;
        default:
          mockData = {};
      }

      setScanResult({
        documentType,
        extractedData: mockData,
        confidence: 0.92,
        processingTime: "1.2 segundos",
        aiModel: aiModel === "openai" ? "GPT-4 Vision" : "DeepSeek-VL",
      });
    } catch (err) {
      setError(
        "Error al procesar el documento. Por favor, intente nuevamente.",
      );
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle form submission with extracted data
  const handleSubmit = () => {
    if (scanResult) {
      onScanComplete({
        ...scanResult.extractedData,
        documentType: scanResult.documentType,
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Digitalización de Documentos
        </CardTitle>
        <CardDescription>
          Digitalice documentos sacramentales utilizando inteligencia artificial
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="upload">Subir Imagen</TabsTrigger>
            <TabsTrigger value="camera">Usar Cámara</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="document-type">Tipo de Documento</Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger id="document-type">
                      <SelectValue placeholder="Seleccione tipo de documento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baptism">Bautismo</SelectItem>
                      <SelectItem value="marriage">Matrimonio</SelectItem>
                      <SelectItem value="communion">
                        Primera Comunión
                      </SelectItem>
                      <SelectItem value="confirmation">Confirmación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file-upload">Subir Imagen</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Formatos aceptados: JPG, PNG, PDF (máx. 10MB)
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="pt-4">
                  <Button
                    onClick={processDocument}
                    disabled={!selectedFile || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Scan className="mr-2 h-4 w-4" />
                        Digitalizar Documento
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="border rounded-md p-4 flex flex-col items-center justify-center bg-gray-50 min-h-[300px]">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Vista previa del documento"
                    className="max-w-full max-h-[300px] object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <Upload className="mx-auto h-12 w-12 mb-2" />
                    <p>Vista previa del documento</p>
                    <p className="text-sm">
                      Suba una imagen para ver la vista previa
                    </p>
                  </div>
                )}
              </div>
            </div>

            {scanResult && (
              <div className="mt-6 border rounded-md p-4 bg-green-50">
                <div className="flex items-center mb-4">
                  <Check className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-medium">
                    Digitalización Completada
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Tipo de Documento</p>
                    <p className="font-medium">
                      {documentType === "baptism" && "Bautismo"}
                      {documentType === "marriage" && "Matrimonio"}
                      {documentType === "communion" && "Primera Comunión"}
                      {documentType === "confirmation" && "Confirmación"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Modelo de IA</p>
                    <p className="font-medium">{scanResult.aiModel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Confianza</p>
                    <p className="font-medium">
                      {scanResult.confidence * 100}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Tiempo de Procesamiento
                    </p>
                    <p className="font-medium">{scanResult.processingTime}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Datos Extraídos:</h4>
                  <div className="bg-white p-4 rounded-md border max-h-[200px] overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap">
                      {JSON.stringify(scanResult.extractedData, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="camera" className="space-y-4">
            <div className="border rounded-md p-6 flex flex-col items-center justify-center bg-gray-50 min-h-[400px]">
              <Camera className="h-12 w-12 mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">Capturar con Cámara</h3>
              <p className="text-gray-500 text-center mb-4">
                Utilice la cámara de su dispositivo para capturar una imagen del
                documento sacramental.
              </p>
              <Button onClick={handleCameraCapture}>
                <Camera className="mr-2 h-4 w-4" />
                Iniciar Cámara
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-model">Modelo de IA</Label>
                <Select value={aiModel} onValueChange={setAiModel}>
                  <SelectTrigger id="ai-model">
                    <SelectValue placeholder="Seleccione modelo de IA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI GPT-4 Vision</SelectItem>
                    <SelectItem value="deepseek">DeepSeek-VL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">
                  Clave API de {aiModel === "openai" ? "OpenAI" : "DeepSeek"}
                </Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                />
                <p className="text-sm text-gray-500">
                  {aiModel === "openai"
                    ? "Obtenga su clave API en https://platform.openai.com/api-keys"
                    : "Obtenga su clave API en el portal de DeepSeek"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="advanced-settings">
                  Configuración Avanzada
                </Label>
                <Textarea
                  id="advanced-settings"
                  placeholder={`{
  "temperature": 0.7,
  "max_tokens": 1000,
  "extraction_format": "json"  
}`}
                  className="font-mono text-sm"
                  rows={6}
                />
                <p className="text-sm text-gray-500">
                  Configuración avanzada en formato JSON (opcional)
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={!scanResult || isProcessing}>
          Usar Datos Extraídos
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentScanner;
