import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class SeaAnemoneAbility extends Ability {
    private logService: LogService;
    private usesThisTurn = 0;
    private readonly maxUsesPerTurn = 3;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Sea Anemone Ability',
            owner: owner,
            triggers: ['FriendSold', 'StartTurn'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;

        if (context.trigger === 'StartTurn') {
            this.usesThisTurn = 0;
            this.triggerTigerExecution(context);
            return;
        }

        if (this.usesThisTurn >= this.maxUsesPerTurn) {
            this.triggerTigerExecution(context);
            return;
        }

        const soldPet = context.triggerPet;
        if (!soldPet || !soldPet.isSellPet()) {
            this.triggerTigerExecution(context);
            return;
        }

        const friends = owner.parent.petArray.filter((friend) => friend && friend !== owner && friend.alive);
        if (friends.length === 0) {
            this.triggerTigerExecution(context);
            return;
        }

        const target = friends[Math.floor(Math.random() * friends.length)];
        const buffAmount = Math.min(Math.max(this.level, 1), 3);

        target.increaseAttack(buffAmount);
        target.increaseHealth(buffAmount);
        this.usesThisTurn++;

        this.logService.createLog({
            message: `${owner.name} gave ${target.name} +${buffAmount}/+${buffAmount} after ${soldPet.name} was sold.`,
            type: 'ability',
            player: owner.parent,
            tiger: context.tiger,
            pteranodon: context.pteranodon
        });

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): SeaAnemoneAbility {
        return new SeaAnemoneAbility(newOwner, this.logService);
    }
}
