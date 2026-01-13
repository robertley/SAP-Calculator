import { Ability, AbilityContext } from "../../../../ability.class";
import { AbilityService } from "../../../../../services/ability.service";
import { LogService } from "app/services/log.service";
import { Pack, Pet } from "../../../../pet.class";
import { Player } from "../../../../player.class";

class EstemmenosuchusFriend extends Pet {
    name = 'Estemmenosuchus\'s Ally';
    tier = 1;
    pack: Pack = 'Custom';
    attack = 1;
    health = 1;

    initAbilities(): void {
        // Tokens do not gain abilities
    }

    constructor(
        logService: LogService,
        abilityService: AbilityService,
        parent: Player,
        attack: number,
        health: number
    ) {
        super(logService, abilityService, parent);
        this.initPet(0, health, attack, 0, undefined, 0);
    }
}

export class EstemmenosuchusAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;
    private triggered = false;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'Estemmenosuchus Ability',
            owner: owner,
            triggers: ['ThisAttacked'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private countAilments(): number {
        const owner = this.owner;
        return owner.parent.petArray.filter((pet) => {
            const eqClass = pet?.equipment?.equipmentClass;
            return !!eqClass && eqClass.startsWith('ailment');
        }).length;
    }

    private executeAbility(context: AbilityContext): void {
        if (this.triggered) {
            this.triggerTigerExecution(context);
            return;
        }

        const owner = this.owner;
        const ailmentCount = Math.max(0, this.countAilments());
        const buff = Math.max(1, ailmentCount + 1);
        const summonCount = Math.min(this.level, 3);
        const spawnIndex = owner.position ?? owner.savedPosition ?? 0;
        let summoned = 0;

        for (let i = 0; i < summonCount; i++) {
            const token = new EstemmenosuchusFriend(
                this.logService,
                this.abilityService,
                owner.parent,
                buff,
                buff
            );
            const result = owner.parent.summonPet(token, spawnIndex, false, owner);
            if (result.success) {
                summoned++;
            } else {
                break;
            }
        }

        if (summoned > 0) {
            this.logService.createLog({
                message: `${owner.name} summoned ${summoned} ally${summoned === 1 ? '' : 'ies'} with +${buff}/+${buff} after its first attack.`,
                type: 'ability',
                player: owner.parent,
                tiger: context.tiger,
                pteranodon: context.pteranodon
            });
        }

        this.triggered = true;
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): EstemmenosuchusAbility {
        return new EstemmenosuchusAbility(newOwner, this.logService, this.abilityService);
    }
}
