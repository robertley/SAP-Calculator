import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Crisp } from "../../../equipment/ailments/crisp.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { FirePup } from "../../hidden/fire-pup.class";

// TODO fix bug where cerberus spawns 2 fire pups at start of battle when there is an empty slot
export class Cerberus extends Pet {
    name = "Cerberus";
    tier = 6;
    pack: Pack = 'Unicorn';
    attack = 8;
    health = 8;
    emptyFrontSpace(gameApi: GameAPI, tiger?: boolean): void {
        if (this.parent.pet0 != null) {
            return;
        }

        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }

        this.abilityService.setSpawnEvent({
            callback: () => {
                let firePup = new FirePup(this.logService, this.abilityService, this.parent, null, null, 0);
        
                this.logService.createLog(
                    {
                        message: `${this.name} spawned Fire Pup (8/8).`,
                        type: "ability",
                        player: this.parent,
                        tiger: tiger
                    }
                )

                if (this.parent.summonPet(firePup, 0)) {
                    this.abilityService.triggerSummonedEvents(firePup);
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

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = this.level;
    }
}