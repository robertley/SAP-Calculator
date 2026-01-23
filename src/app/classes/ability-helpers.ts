import { Log } from 'app/interfaces/log.interface';
import { Pet } from './pet.class';
import { LogService } from 'app/services/log.service';

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
