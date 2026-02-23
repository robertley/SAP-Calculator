import { Injectable } from '@angular/core';
import { getDefaultTeams } from './team-presets.defaults';
import { PetForm } from './pet/pet-factory.service';

export interface TeamPreset {
  id: string;
  name: string;
  createdAt: number;
  pets: PetForm[];
  toyName?: string | null;
  toyLevel?: number;
  playerToyName?: string | null;
  playerToyLevel?: number;
  opponentToyName?: string | null;
  opponentToyLevel?: number;
  playerHardToy?: string | null;
  playerHardToyLevel?: number;
  opponentHardToy?: string | null;
  opponentHardToyLevel?: number;
  rollAmount?: number;
  transformationAmount?: number;
  turn?: number;
  playerGoldSpent?: number;
  opponentGoldSpent?: number;
  allPets?: boolean;
  tokenPets?: boolean;
  komodoShuffle?: boolean;
  mana?: boolean;
  seed?: number | null;
  triggersConsumed?: boolean;
  changeEquipmentUses?: boolean;
  playerRollAmount?: number;
  opponentRollAmount?: number;
  playerLevel3Sold?: number;
  opponentLevel3Sold?: number;
  playerSummonedAmount?: number;
  opponentSummonedAmount?: number;
  playerTransformationAmount?: number;
  opponentTransformationAmount?: number;
}

@Injectable({
  providedIn: 'root',
})
export class TeamPresetsService {
  private readonly storageKey = 'sap-team-presets';
  private readonly removedPresetIds = new Set([
    'default-shoggoth',
    'default-shoggoths-return',
    'default-sloths',
  ]);

  loadTeams(): TeamPreset[] {
    const raw = window.localStorage.getItem(this.storageKey);
    if (!raw) {
      return getDefaultTeams();
    }
    try {
      const parsed = JSON.parse(raw);
      const existing = Array.isArray(parsed) ? parsed : [];
      const migrated = this.migrateTeams(existing);
      if (migrated.changed) {
        this.persistTeams(migrated.teams);
      }
      return this.mergeDefaultTeams(migrated.teams);
    } catch {
      return getDefaultTeams();
    }
  }

  persistTeams(teams: TeamPreset[]): void {
    window.localStorage.setItem(this.storageKey, JSON.stringify(teams));
  }

  private mergeDefaultTeams(existing: TeamPreset[]): TeamPreset[] {
    const defaults = getDefaultTeams();
    const existingIds = new Set(existing.map((team) => team.id));
    const merged = [...existing];
    for (const team of defaults) {
      if (!existingIds.has(team.id)) {
        merged.push(team);
      }
    }
    return merged;
  }

  private migrateTeams(teams: TeamPreset[]): {
    teams: TeamPreset[];
    changed: boolean;
  } {
    let changed = false;
    const migrated = teams.map((team) => {
      if (team?.id !== 'default-ability-removal') {
        return team;
      }
      return team;
    });

    const filtered = migrated.filter((team) => {
      if (this.removedPresetIds.has(team.id)) {
        changed = true;
        return false;
      }
      return true;
    });

    return { teams: filtered, changed };
  }
}
