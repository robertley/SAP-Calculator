import { AbilityContext } from './ability.class';
import { LogService } from 'app/integrations/log.service';
import { Pet } from './pet.class';
import { Log } from 'app/domain/interfaces/log.interface';

export interface AbilityLogExtras extends Partial<Log> {}

export function logAbilityEvent(
  logService: LogService,
  owner: Pet,
  context: AbilityContext,
  message: string,
  extras: AbilityLogExtras = {},
): void {
  logService.createLog({
    message,
    type: 'ability',
    player: owner.parent,
    tiger: context.tiger,
    pteranodon: context.pteranodon,
    ...extras,
  });
}

export function transformPetWithLog(options: {
  logService: LogService;
  owner: Pet;
  context: AbilityContext;
  fromPet: Pet;
  toPet: Pet;
  message: string;
  extras?: AbilityLogExtras;
}) {
  logAbilityEvent(
    options.logService,
    options.owner,
    options.context,
    options.message,
    options.extras,
  );
  options.owner.parent.transformPet(options.fromPet, options.toPet);
}

export function awardExperienceWithLog(options: {
  logService: LogService;
  owner: Pet;
  context: AbilityContext;
  target: Pet;
  amount: number;
  message?: string;
  extras?: AbilityLogExtras;
}) {
  if (options.amount <= 0) {
    return;
  }
  const message =
    options.message ??
    `${options.owner.name} gave ${options.target.name} +${options.amount} experience.`;
  logAbilityEvent(
    options.logService,
    options.owner,
    options.context,
    message,
    options.extras,
  );
  options.target.increaseExp(options.amount);
}

