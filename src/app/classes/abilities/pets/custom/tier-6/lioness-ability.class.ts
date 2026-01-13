import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class LionessAbility extends Ability {
    private logService: LogService;
    private usesThisTurn: number = 0;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'LionessAbility',
            owner: owner,
            triggers: ['StartTurn', 'FriendSold'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;
        const { trigger, triggerPet, tiger, pteranodon } = context;

        if (trigger === 'StartTurn') {
            this.usesThisTurn = 0;
            this.triggerTigerExecution(context);
            return;
        }

        if (trigger !== 'FriendSold') {
            this.triggerTigerExecution(context);
            return;
        }

        if (this.usesThisTurn >= 2) {
            this.triggerTigerExecution(context);
            return;
        }

        this.usesThisTurn++;
        const tier = triggerPet?.tier ?? owner.tier;
        const futureShopKey = 'futureShopBuffs';
        const futureShopBuffs: Map<number, { attack: number, health: number }> =
            (owner.parent as any)[futureShopKey] ?? new Map();

        const buff = futureShopBuffs.get(tier) ?? { attack: 0, health: 0 };
        buff.attack += this.level;
        buff.health += this.level;
        futureShopBuffs.set(tier, buff);
        (owner.parent as any)[futureShopKey] = futureShopBuffs;

        this.logService.createLog({
            message: `${owner.name} gave future tier ${tier} shop pets +${this.level}/+${this.level} (uses ${this.usesThisTurn}/2 this turn).`,
            type: 'ability',
            player: owner.parent,
            tiger,
            pteranodon
        });

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): LionessAbility {
        return new LionessAbility(newOwner, this.logService);
    }
}
