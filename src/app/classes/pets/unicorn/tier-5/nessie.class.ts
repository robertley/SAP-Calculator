import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { NessieQ } from "../../hidden/nessie-q.class";

export class Nessie extends Pet {
    name = "Nessie";
    tier = 5;
    pack: Pack = 'Unicorn';
    attack = 3;
    health = 5;
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let isPlayer = this.parent === gameApi.player;
        let rolls = isPlayer ? gameApi.playerRollAmount : gameApi.opponentRollAmount;

        let attack = this.level * 3;
        let health = this.level * 3;
        let firstBoatMessage = '';

        if (!this.parent.summonedBoatThisBattle) {
            const bonusPerRoll = this.level;
            const bonusStats = rolls * bonusPerRoll;
            attack += bonusStats;
            health += bonusStats;
            this.parent.summonedBoatThisBattle = true;
            firstBoatMessage = ` It's the first Boat, so it gains +${bonusStats}/+${bonusStats}!`;
        }

        attack = Math.min(50, attack);
        health = Math.min(50, health);

        this.abilityService.setSpawnEvent({
            callback: () => {
                let nessieQ = new NessieQ(this.logService, this.abilityService, this.parent, health, attack, 0);
        
                this.logService.createLog(
                    {
                        message: `${this.name} spawned a Nessie? ${attack}/${health}`,
                        type: "ability",
                        player: this.parent,
                        tiger: tiger,
                        pteranodon: pteranodon
                    }
                )

                if (this.parent.summonPet(nessieQ, this.savedPosition)) {
                    this.abilityService.triggerSummonedEvents(nessieQ);
                }
            },
            priority: this.attack
        })

        super.superAfterFaint(gameApi, tiger, pteranodon);
    }
    
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
    }

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = this.level;
    }
}