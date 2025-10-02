import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { NessieQ } from "../../../../pets/hidden/nessie-q.class";

export class NessieAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'NessieAbility',
            owner: owner,
            triggers: ['ThisDied'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let isPlayer = owner.parent === gameApi.player;
        let rolls = isPlayer ? gameApi.playerRollAmount : gameApi.opponentRollAmount;

        let attack = this.level * 3;
        let health = this.level * 3;
        let firstBoatMessage = '';

        if (!owner.parent.summonedBoatThisBattle) {
            const bonusPerRoll = this.level;
            const bonusStats = rolls * bonusPerRoll;
            attack += bonusStats;
            health += bonusStats;
            owner.parent.summonedBoatThisBattle = true;
            firstBoatMessage = ` It's the first Boat, so it gains +${bonusStats}/+${bonusStats}!`;
        }

        attack = Math.min(50, attack);
        health = Math.min(50, health);

        let nessieQ = new NessieQ(this.logService, this.abilityService, owner.parent, health, attack, 0);

        let summonResult = owner.parent.summonPet(nessieQ, owner.savedPosition, false, owner);
        if (summonResult.success) {
            this.logService.createLog({
                message: `${owner.name} spawned a Nessie? ${attack}/${health}${firstBoatMessage}`,
                type: "ability",
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: summonResult.randomEvent
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): NessieAbility {
        return new NessieAbility(newOwner, this.logService, this.abilityService);
    }
}