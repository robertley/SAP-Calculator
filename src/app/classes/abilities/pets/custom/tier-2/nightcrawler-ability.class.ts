import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability/ability.service";
import { Daycrawler } from "../../../../pets/hidden/daycrawler.class";

export class NightcrawlerAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'NightcrawlerAbility',
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

        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        let isPlayer = owner.parent == gameApi.player;
        let summonedAmount = isPlayer ? gameApi.playerSummonedAmount : gameApi.opponentSummonedAmount;

        if (summonedAmount == 0) {
            return;
        }

        let health = Math.min(50, this.level * summonedAmount);
        let attack = 6;

        let dayCrawler = new Daycrawler(this.logService, this.abilityService, owner.parent, health, attack, 0, 0);

        let summonResult = owner.parent.summonPet(dayCrawler, owner.savedPosition, false, owner);
        if (summonResult.success) {
            this.logService.createLog(
                {
                    message: `${owner.name} spawned Daycrawler (${attack}/${health})`,
                    type: "ability",
                    player: owner.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: summonResult.randomEvent
                }
            )
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): NightcrawlerAbility {
        return new NightcrawlerAbility(newOwner, this.logService, this.abilityService);
    }
}