"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Schéma de validation
const formSchema = z.object({
  region: z.string().min(1, "La région est obligatoire"),
  agent: z.string().min(1, "L’agent est obligatoire"),
});

type FormValues = z.infer<typeof formSchema>;

type Agent = {
  value: string;
  label: string;
};

// ✅ Liste fixe des régions
const regions = [
  { value: "ali-sabieh", label: "Ali-Sabieh" },
  { value: "dikhil", label: "Dikhil" },
  { value: "obock", label: "Obock" },
  { value: "arta", label: "Arta" },
  { value: "tadjourah", label: "Tadjourah" },
];

const Affectation_Mass_deleguer: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      region: "",
      agent: "",
    },
  });

  // ✅ Récupération des agents depuis ton API
  const fetchAgents = async () => {
    const apiUrl =
      "http://192.168.100.4:8080/Vox_Backend/api.php?method=AfficherPourSuperviseurTele";

    try {
      const response = await fetch(apiUrl, { method: "GET" });

      if (!response.ok) {
        console.error("❌ Erreur API");
        return;
      }

      const responseData = await response.json();

      // ✅ Mapping du JSON vers {value, label}
      const mappedAgents: Agent[] = responseData.map((a: any) => ({
        value: String(a.id),
        label: a.Nom,
      }));

      setAgents(mappedAgents);
    } catch (error) {
      console.error("❌ Erreur récupération agents:", error);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // ✅ Soumission du formulaire
  const onSubmit = async (values: FormValues) => {
    setLoading(true); // activer le loading

    try {
      const response = await fetch(
        "http://192.168.100.4:8080/Vox_Backend/api.php?method=AffectationParRegion",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      const result = await response.json();

      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        // ✅ retrouver le nom de l’agent
        const agentName =
          agents.find((a) => a.value === values.agent)?.label || values.agent;

        const regionLabel =
          regions.find((r) => r.value === values.region)?.label ||
          values.region;

        toast.success(`L’agent ${agentName} a été affecté à la région ${regionLabel}`);

        // ✅ reset du formulaire
        form.reset();
      } else {
        toast.info("Réponse inattendue du serveur.");
      }
    } catch (error) {
      console.error("❌ Erreur API:", error);
      toast.error("Erreur lors de l’enregistrement de l’affectation");
    } finally {
      setLoading(false); // désactiver le loading
    }
  };

  return (
    <Card className="w-[1000px] mx-auto mt-10 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle>Affectation d’un agent à une région</CardTitle>
      </CardHeader>
      <CardContent>
        <ToastContainer position="top-center" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Sélection région */}
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Région</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="👉 Choisir une région" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {regions.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sélection agent */}
            <FormField
              control={form.control}
              name="agent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="👉 Choisir un agent" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {agents.map((a) => (
                        <SelectItem key={a.value} value={a.value}>
                          {a.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bouton Affecter */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "⏳ Affectation en cours..." : "Affecter"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Affectation_Mass_deleguer;
