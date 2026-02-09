import { Log } from 'app/domain/interfaces/log.interface';
import { Pet } from './pet.class';
import { LogService } from 'app/integrations/log.service';

export function getAdjacentAlivePets(owner: Pet): Pet[] {
  const position = owner.position ?? owner.savedPosition;
  if (position == null) {
    return [];
  }

  const targets: Pet[] = [];
  const left = owner.parent.getPetAtPosition(position - 1);
  const right = owner.parent.getPetAtPosition(position + 1);
  if (left && left.alive) {
    targets.push(left);
  }
  if (right && right.alive) {
    targets.push(right);
  }

  return targets;
}

export function canApplyAilment(target: Pet, ailmentName: string): boolean {
  const hasPerk =
    target.equipment && !target.equipment.equipmentClass?.startsWith('ailment');
  const alreadyAilment = target.equipment?.name === ailmentName;
  return !hasPerk && !alreadyAilment;
}

export interface FriendSummonedTargetResult {
  pet?: Pet;
  random: boolean;
}

export function logAbility(
  logService: LogService,
  owner: Pet,
  message: string,
  tiger?: boolean,
  pteranodon?: boolean,
  extras: Partial<Log> = {},
): void {
  logService.createLog({
    message,
    type: 'ability',
    player: owner.parent,
    tiger,
    pteranodon,
    sourcePet: owner,
    ...extras,
  });
}

export function resolveFriendSummonedTarget(
  owner: Pet,
  triggerPet?: Pet,
  getter?: (owner: Pet, triggerPet: Pet) => FriendSummonedTargetResult,
): FriendSummonedTargetResult {
  if (!triggerPet) {
    return {
      random: false,
    };
  }

  if (getter) {
    return getter(owner, triggerPet) ?? { random: false };
  }

  return owner.parent.getSpecificPet(owner, triggerPet);
}

export function getAliveTriggerTarget(
  owner: Pet,
  triggerPet?: Pet,
): FriendSummonedTargetResult {
  if (!triggerPet) {
    return { random: false };
  }

  const targetResp = owner.parent.getSpecificPet(owner, triggerPet);
  const target = targetResp.pet;
  if (!target || !target.alive) {
    return { random: targetResp.random };
  }

  return targetResp;
}

export function canUseAliveTriggerTarget(
  owner: Pet,
  triggerPet?: Pet,
  options?: { excludeOwner?: boolean },
): boolean {
  if (!triggerPet) {
    return false;
  }
  if (options?.excludeOwner && triggerPet === owner) {
    return false;
  }

  return !!getAliveTriggerTarget(owner, triggerPet).pet;
}

// Backward-compatible aliases for existing call sites.
export const resolveTriggerTargetAlive = getAliveTriggerTarget;
export const hasAliveTriggerTarget = canUseAliveTriggerTarget;

