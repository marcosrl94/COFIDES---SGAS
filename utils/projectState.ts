import { ProjectState } from '../types';

/**
 * Obtiene el país primario del estado del proyecto.
 * Prioriza el primer location cuando hay múltiples países.
 */
export function getPrimaryCountry(state: ProjectState) {
  return state.locations?.[0]?.country ?? state.country ?? null;
}
