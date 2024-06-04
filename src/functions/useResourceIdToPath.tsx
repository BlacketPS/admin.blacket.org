import { useResource } from "@stores/ResourceStore/index";

export function useResourceIdToPath(resourceId: number): string {
    const { resources } = useResource();

    return resources.find((resource) => resource.id === resourceId)?.path ?? "";
}
