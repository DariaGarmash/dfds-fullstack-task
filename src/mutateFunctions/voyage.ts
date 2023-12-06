import { toast } from "~/components/ui/use-toast";
import { type TVoyagePayloadCreate } from "~/pages/api/voyage/create";

export const createVoyage = async (payload: TVoyagePayloadCreate) => {
    const response = await fetch(`/api/voyage/create`, {
        method: "POST",
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error("Failed to create the voyage");
    }
}

export const deleteVoayage = async (voyageId: string) => {
    const response = await fetch(`/api/voyage/delete?id=${voyageId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        toast({
            title: 'Error',
            description: "Failed to delete the voyage",
            variant: 'danger'
        });
        throw new Error("Failed to delete the voyage");
    }
}