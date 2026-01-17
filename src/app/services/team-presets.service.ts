import { Injectable } from '@angular/core';

export interface TeamPreset {
  id: string;
  name: string;
  createdAt: number;
  pets: any[];
  toyName?: string;
  toyLevel?: number;
  rollAmount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TeamPresetsService {
  private readonly storageKey = 'sap-team-presets';

  loadTeams(): TeamPreset[] {
    const raw = window.localStorage.getItem(this.storageKey);
    if (!raw) {
      return this.getDefaultTeams();
    }
    try {
      const parsed = JSON.parse(raw);
      const existing = Array.isArray(parsed) ? parsed : [];
      return this.mergeDefaultTeams(existing);
    } catch {
      return this.getDefaultTeams();
    }
  }

  persistTeams(teams: TeamPreset[]): void {
    window.localStorage.setItem(this.storageKey, JSON.stringify(teams));
  }

  getDefaultTeams(): TeamPreset[] {
    return [
      {
        id: 'default-max-damage',
        name: '1000 Mana',
        createdAt: Date.now(),
        toyName: 'Nutcracker',
        toyLevel: 3,
          pets: Array.from({ length: 5 }, () => ({
            name: 'Sea Serpent',
            attack: 50,
            health: 50,
            exp: 5,
            equipment: { name: 'Coconut' },
            belugaSwallowedPet: null,
            sarcasticFringeheadSwallowedPet: null,
            mana: 50,
            triggersConsumed: 0,
          abominationSwallowedPet1: null,
          abominationSwallowedPet2: null,
          abominationSwallowedPet3: null,
          abominationSwallowedPet1TimesHurt: 0,
          abominationSwallowedPet2TimesHurt: 0,
          abominationSwallowedPet3TimesHurt: 0,
          battlesFought: 0,
          timesHurt: 0,
          equipmentUses: null,
          })),
      },
      {
        id: 'default-great-six',
        name: 'The Great Six',
        createdAt: Date.now(),
        toyName: 'Evil Book',
        toyLevel: 3,
          pets: Array.from({ length: 5 }, () => ({
            name: 'Beluga Whale',
            attack: 50,
            health: 50,
            exp: 5,
            equipment: { name: 'White Okra' },
            belugaSwallowedPet: 'Great One',
            sarcasticFringeheadSwallowedPet: null,
            mana: 50,
            triggersConsumed: 0,
          abominationSwallowedPet1: null,
          abominationSwallowedPet2: null,
          abominationSwallowedPet3: null,
          abominationSwallowedPet1TimesHurt: 0,
          abominationSwallowedPet2TimesHurt: 0,
          abominationSwallowedPet3TimesHurt: 0,
          battlesFought: 0,
          timesHurt: 0,
          equipmentUses: null,
          })),
      },
      {
        id: 'default-ability-removal',
        name: 'Ability Removal',
        createdAt: Date.now(),
        toyName: 'Nutcracker',
        toyLevel: 3,
        rollAmount: 14,
        pets: [
          {
            name: 'Abomination',
            attack: 50,
            health: 50,
            exp: 5,
            equipment: { name: 'White Okra' },
            belugaSwallowedPet: null,
            sarcasticFringeheadSwallowedPet: null,
            mana: 50,
            triggersConsumed: 0,
              abominationSwallowedPet1: 'Red Lipped Batfish',
              abominationSwallowedPet2: 'Sea Serpent',
              abominationSwallowedPet3: 'Nessie',
              abominationSwallowedPet1Level: 3,
              abominationSwallowedPet2Level: 3,
              abominationSwallowedPet3Level: 3,
              abominationSwallowedPet1TimesHurt: 0,
              abominationSwallowedPet2TimesHurt: 0,
              abominationSwallowedPet3TimesHurt: 0,
            battlesFought: 0,
            timesHurt: 0,
            equipmentUses: null,
          },
          ...Array.from({ length: 4 }, () => ({
            name: 'Red Lipped Batfish',
            attack: 50,
            health: 50,
            exp: 5,
            equipment: { name: 'White Okra' },
            belugaSwallowedPet: null,
            sarcasticFringeheadSwallowedPet: null,
            mana: 50,
            triggersConsumed: 0,
            abominationSwallowedPet1: null,
            abominationSwallowedPet2: null,
            abominationSwallowedPet3: null,
            abominationSwallowedPet1TimesHurt: 0,
            abominationSwallowedPet2TimesHurt: 0,
            abominationSwallowedPet3TimesHurt: 0,
            battlesFought: 0,
            timesHurt: 0,
            equipmentUses: null,
          }))
        ],
      },
      {
        id: 'default-sloths',
        name: 'Sloths',
        createdAt: Date.now(),
        toyName: null,
        toyLevel: 1,
        pets: Array.from({ length: 5 }, () => ({
          name: 'Sloth',
          attack: 1,
          health: 1,
          exp: 0,
          equipment: null,
          belugaSwallowedPet: null,
          sarcasticFringeheadSwallowedPet: null,
          mana: 0,
          triggersConsumed: 0,
          abominationSwallowedPet1: null,
          abominationSwallowedPet2: null,
          abominationSwallowedPet3: null,
          abominationSwallowedPet1TimesHurt: 0,
          abominationSwallowedPet2TimesHurt: 0,
          abominationSwallowedPet3TimesHurt: 0,
          battlesFought: 0,
          timesHurt: 0,
          equipmentUses: null,
        })),
      },
      {
        id: 'default-sob-snipes',
        name: 'SoB Snipes',
        createdAt: Date.now(),
        toyName: 'Nutcracker',
        toyLevel: 3,
        pets: Array.from({ length: 5 }, () => ({
          name: 'Leopard',
          attack: 50,
          health: 50,
          exp: 5,
          equipment: { name: 'Churros' },
          belugaSwallowedPet: null,
          sarcasticFringeheadSwallowedPet: null,
          mana: 50,
          triggersConsumed: 0,
          abominationSwallowedPet1: null,
          abominationSwallowedPet2: null,
          abominationSwallowedPet3: null,
          battlesFought: 0,
          timesHurt: 0,
          equipmentUses: null,
        })),
      },
    ];
  }

  private mergeDefaultTeams(existing: TeamPreset[]): TeamPreset[] {
    const defaults = this.getDefaultTeams();
    const existingIds = new Set(existing.map((team) => team.id));
    const merged = [...existing];
    for (const team of defaults) {
      if (!existingIds.has(team.id)) {
        merged.push(team);
      }
    }
    return merged;
  }
}
