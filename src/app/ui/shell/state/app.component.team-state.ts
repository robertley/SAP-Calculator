import { FormGroup } from '@angular/forms';
import { Player } from 'app/domain/entities/player.class';
import { EquipmentService } from 'app/integrations/equipment/equipment.service';
import { PetService } from 'app/integrations/pet/pet.service';
import {
  TeamPreset,
  TeamPresetsService,
} from 'app/integrations/team-presets.service';
import { loadTeamPreset, saveTeamPreset } from './app.component.teams';

export interface AppTeamStateContext {
  teamName: string;
  formGroup: FormGroup;
  savedTeams: TeamPreset[];
  selectedTeamId: string;
  teamPresetsService: TeamPresetsService;
  player: Player;
  opponent: Player;
  petService: PetService;
  equipmentService: EquipmentService;
  initPetForms: () => void;
  setStatus: (message: string, tone?: 'success' | 'error') => void;
}

export function saveTeam(ctx: AppTeamStateContext, side: 'player' | 'opponent'): void {
  const normalizedTeamName = ctx.teamName?.trim() ?? '';
  if (!normalizedTeamName) {
    ctx.setStatus('Enter a team name before saving.', 'error');
    return;
  }

  const result = saveTeamPreset({
    side,
    teamName: normalizedTeamName,
    formGroup: ctx.formGroup,
    savedTeams: ctx.savedTeams,
    selectedTeamId: ctx.selectedTeamId,
    teamPresetsService: ctx.teamPresetsService,
  });
  ctx.savedTeams = result.savedTeams;
  ctx.selectedTeamId = result.selectedTeamId;
  ctx.teamName = result.teamName;
}

export function loadTeam(ctx: AppTeamStateContext, side: 'player' | 'opponent'): void {
  loadTeamPreset({
    side,
    selectedTeamId: ctx.selectedTeamId,
    savedTeams: ctx.savedTeams,
    formGroup: ctx.formGroup,
    player: ctx.player,
    opponent: ctx.opponent,
    petService: ctx.petService,
    equipmentService: ctx.equipmentService,
    initPetForms: () => ctx.initPetForms(),
  });
}

export function loadTeamPresets(ctx: AppTeamStateContext): void {
  ctx.savedTeams = ctx.teamPresetsService.loadTeams();
}
