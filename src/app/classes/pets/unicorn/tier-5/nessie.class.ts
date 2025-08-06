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
    attack = 2;
    health = 4;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let isPlayer = this.parent === gameApi.player;
        let rolls = isPlayer ? gameApi.playerRollAmount : gameApi.opponentRollAmount;
        rolls = Math.min(rolls, 7);
        let attack = Math.min(50, rolls * this.level);
        let health = Math.min(50, rolls * this.level * 2);

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

        super.superFaint(gameApi, tiger);
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