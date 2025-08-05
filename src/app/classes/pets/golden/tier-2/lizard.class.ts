import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { LizardTail } from "../../hidden/lizard-tail.class";

export class Lizard extends Pet {
    name = "Lizard";
    tier = 2;
    pack: Pack = 'Golden';
    attack = 1;
    health = 3;
    maxAbilityUses: number = 2;
    hurt(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        this.abilityService.setSpawnEvent({
            callback: () => {
                let lizardTail = new LizardTail(this.logService, this.abilityService, this.parent, null, null, 0, this.minExpForLevel);
        
                this.logService.createLog(
                    {
                        message: `${this.name} spawned Liazrd Tail Level ${this.level}`,
                        type: "ability",
                        player: this.parent,
                        tiger: tiger
                    }
                )

                if (this.parent.summonPet(lizardTail, this.savedPosition)) {
                    this.abilityService.triggerSummonedEvents(lizardTail);
                }
            },
            priority: this.attack
        })
        this.abilityUses++;

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
}