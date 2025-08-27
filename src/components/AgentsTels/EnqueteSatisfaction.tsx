"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "../ui/scroll-area";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppContext } from "../context/AppContext";
import { schema } from "@/Schemas";


// ✅ Type TypeScript basé sur le schéma
type FormData = z.infer<typeof schema>;

// ✅ Liste des 19 questions
const questions: string[] = [
    "1. Utilisez-vous régulièrement cet ouvrage hydraulique (puits, forage, etc.) pour vos besoins en eau ?",
    "2. À quelle distance se trouve l’ouvrage de votre domicile ?",
    "3. Combien de fois par jour vous rendez-vous à l’ouvrage ?",
    "4. Avez-vous rencontré des problèmes techniques ou pannes sur l’ouvrage ?",
    "5. Depuis l’installation de l’ouvrage, votre accès à l’eau s’est-il amélioré ?",
    "6. Êtes-vous satisfait(e) de la localisation de l’ouvrage ?",
    "7. Quel est votre niveau de satisfaction général vis-à-vis de l’ouvrage ?",
    "8. Avez-vous déjà formulé une plainte ou une demande d’amélioration concernant l’ouvrage ?",
    "9. Les intrants ont-ils bien été reçus dans votre localité ?",
    "10. Avez-vous observé des retards ou des difficultés pendant la distribution ? (Si oui, quelles en étaient les causes ?)",
    "11. Est-ce que tous les ménages bénéficiaires identifiés ont bien reçu les intrants ? (Y a-t-il eu des exclusions, des doublons ou des absents ?)",
    "12. Avez-vous reçu des plaintes ou des préoccupations de la part des bénéficiaires ?",
    "13. Comment les plaintes ou préoccupations sont-elles traitées dans votre localité ?",
    "14. Selon vous, la qualité des intrants distribués était-elle satisfaisante ?",
    "15. Comment les bénéficiaires ont-ils été informés de la distribution ?",
    "16. Y a-t-il eu des cas de favoritisme, de détournement ou de mauvaise gestion signalés ?",
    "17. Que recommandez-vous pour améliorer les prochaines distributions dans votre localité ?",
    "18. Avez-vous des suggestions pour améliorer le mécanisme de gestion des plaintes ?",
    "19. Quel est le niveau de satisfaction général des bénéficiaires que vous avez pu observer ou entendre ?",
];

// ✅ Props du composant
interface Propstype {
    Nom: string;
    localite: string;
    Telephone: number;
    id_contact: string;
}

export default function EnqueteSatisfaction({
    Nom,
    localite,
    Telephone,
    id_contact,
}: Propstype) {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const { setData } = useAppContext();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    // ✅ onSubmit avec UX améliorée
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const id = session?.user?.id;
        if (!id) {
            toast.error("❌ Session expirée. Veuillez vous reconnecter.");
            return;
        }

        const api = `http://192.168.100.4:8080/Vox_Backend//api.php?method=EnregistrementEnquet&iduser=${id}`;

        try {
            setLoading(true);

            // 🔹 Ajout de id_contact dans les données envoyées
            const payload = {
                ...data,
                id_contact // vient directement de la prop du composant
            };
            const res = await fetch(api, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (res.ok && result.success) {
                toast.success("✅ Merci pour votre participation !");
                reset(); // vide le formulaire
                // Supprime bien le contact avec l'id_contact
                setData((prevContacts) =>
                    prevContacts.filter((contact) => contact.id !== id_contact)
                );
            } else {
                toast.error(result.error || "❌ Une erreur est survenue !");
            }
        } catch (error) {
            toast.error("❌ Erreur de connexion au serveur !");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer position="top-center" />
            <div className="flex flex-col gap-4 pl-10">
                <h1>
                    <strong className="text-black">Nom: </strong>{" "}
                    <span className="text-blue">{Nom}</span>
                </h1>
                <h1>
                    <strong className="text-black">Localiter/region: </strong>{" "}
                    <span className="text-blue">{localite}</span>
                </h1>
                <h1>
                    <strong className="text-black">Telephone: </strong>{" "}
                    <span className="text-blue">{Telephone}</span>
                </h1>
            </div>
            <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-6 max-w-3xl mx-auto space-y-6 bg-gray-50 shadow-lg rounded-lg"
                >
                    {questions.map((q, index) => {
                        const name = `question${index + 1}` as keyof FormData;
                        return (
                            <div key={index}>
                                <label className="block font-medium mb-1 text-black">{q}</label>
                                <textarea
                                    {...register(name)}
                                    className="border p-2 w-full rounded min-h-[60px] focus:ring focus:ring-blue-400"
                                    placeholder="Votre réponse..."
                                    disabled={loading}
                                />
                                {errors[name] && (
                                    <p className="text-red-500">{errors[name]?.message}</p>
                                )}
                            </div>
                        );
                    })}

                    <button
                        type="submit"
                        className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 w-full disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "⏳ Envoi en cours..." : "📤 Envoyer"}
                    </button>
                </form>
            </ScrollArea>
        </>
    );
}
