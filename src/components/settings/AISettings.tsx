import React, { useState } from "react";
import { Save, Trash, Plus, Info } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface AISettingsProps {
  onSave?: (settings: any) => void;
}

const AISettings = ({ onSave = () => {} }: AISettingsProps) => {
  const [defaultModel, setDefaultModel] = useState("openai");
  const [openaiKey, setOpenaiKey] = useState("");
  const [deepseekKey, setDeepseekKey] = useState("");
  const [autoDigitize, setAutoDigitize] = useState(false);
  const [apiEndpoints, setApiEndpoints] = useState({
    openai: "https://api.openai.com/v1",
    deepseek: "https://api.deepseek.com/v1",
  });
  const [promptTemplates, setPromptTemplates] = useState({
    baptism:
      "Extrae la siguiente información del certificado de bautismo: nombre, apellidos, fecha de nacimiento, fecha de bautismo, lugar, padres, padrinos y ministro.",
    marriage:
      "Extrae la siguiente información del certificado de matrimonio: nombres y apellidos de los contrayentes, fecha, lugar, testigos y ministro.",
    communion:
      "Extrae la siguiente información del certificado de primera comunión: nombre, apellidos, fecha de nacimiento, fecha de comunión, lugar y ministro.",
    confirmation:
      "Extrae la siguiente información del certificado de confirmación: nombre, apellidos, fecha de nacimiento, fecha de confirmación, lugar, padrino/madrina y ministro.",
  });

  const handleSaveSettings = () => {
    const settings = {
      defaultModel,
      apiKeys: {
        openai: openaiKey,
        deepseek: deepseekKey,
      },
      autoDigitize,
      apiEndpoints,
      promptTemplates,
    };
    onSave(settings);
  };

  const updatePromptTemplate = (type: string, value: string) => {
    setPromptTemplates({
      ...promptTemplates,
      [type]: value,
    });
  };

  const updateApiEndpoint = (provider: string, value: string) => {
    setApiEndpoints({
      ...apiEndpoints,
      [provider]: value,
    });
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Configuración de IA para Digitalización
        </CardTitle>
        <CardDescription>
          Configure los modelos de IA y las claves API para la digitalización de
          documentos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* API Keys Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Claves API</h3>

            <div className="space-y-2">
              <Label htmlFor="default-model">Modelo Predeterminado</Label>
              <Select value={defaultModel} onValueChange={setDefaultModel}>
                <SelectTrigger id="default-model">
                  <SelectValue placeholder="Seleccione modelo predeterminado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI GPT-4 Vision</SelectItem>
                  <SelectItem value="deepseek">DeepSeek-VL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="openai-key">Clave API de OpenAI</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-80">
                        Obtenga su clave API en{" "}
                        <a
                          href="https://platform.openai.com/api-keys"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          platform.openai.com/api-keys
                        </a>
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="openai-key"
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-..."
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="deepseek-key">Clave API de DeepSeek</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Obtenga su clave API en el portal de DeepSeek</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="deepseek-key"
                type="password"
                value={deepseekKey}
                onChange={(e) => setDeepseekKey(e.target.value)}
                placeholder="dsk-..."
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="openai-endpoint">Endpoint de OpenAI</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>URL base para las llamadas a la API de OpenAI</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="openai-endpoint"
                value={apiEndpoints.openai}
                onChange={(e) => updateApiEndpoint("openai", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="deepseek-endpoint">Endpoint de DeepSeek</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>URL base para las llamadas a la API de DeepSeek</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="deepseek-endpoint"
                value={apiEndpoints.deepseek}
                onChange={(e) => updateApiEndpoint("deepseek", e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="auto-digitize"
                checked={autoDigitize}
                onCheckedChange={setAutoDigitize}
              />
              <Label htmlFor="auto-digitize">
                Digitalizar automáticamente al subir imágenes
              </Label>
            </div>
          </div>

          {/* Prompt Templates Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Plantillas de Prompts</h3>
            <p className="text-sm text-gray-500">
              Personalice los prompts utilizados para extraer información de
              cada tipo de documento
            </p>

            <div className="space-y-2">
              <Label htmlFor="baptism-prompt">Bautismo</Label>
              <Textarea
                id="baptism-prompt"
                value={promptTemplates.baptism}
                onChange={(e) =>
                  updatePromptTemplate("baptism", e.target.value)
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marriage-prompt">Matrimonio</Label>
              <Textarea
                id="marriage-prompt"
                value={promptTemplates.marriage}
                onChange={(e) =>
                  updatePromptTemplate("marriage", e.target.value)
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="communion-prompt">Primera Comunión</Label>
              <Textarea
                id="communion-prompt"
                value={promptTemplates.communion}
                onChange={(e) =>
                  updatePromptTemplate("communion", e.target.value)
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmation-prompt">Confirmación</Label>
              <Textarea
                id="confirmation-prompt"
                value={promptTemplates.confirmation}
                onChange={(e) =>
                  updatePromptTemplate("confirmation", e.target.value)
                }
                rows={3}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          <Save className="mr-2 h-4 w-4" />
          Guardar Configuración
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AISettings;
