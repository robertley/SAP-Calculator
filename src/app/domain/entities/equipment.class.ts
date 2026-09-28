/** Equipment display metadata; battle behavior belongs to sap-battle-engine. */
export interface Equipment {
  name: string;
  tier?: number;
  uses?: number;
  originalUses?: number;
}
