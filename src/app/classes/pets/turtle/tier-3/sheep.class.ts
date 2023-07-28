import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Ram } from "../../hidden/ram.class";

export class Sheep extends Pet {
    name = "Sheep";
    tier = 3;
    pack: Pack = 'Turtle';
    attack = 2;
    health = 2;
    faint = () => {

        for (let i = 0; i < 2; i++) {
            this.abilityService.setSpawnEvent({
                callback: () => {
                    let ram = new Ram(this.logService, this.abilityService, this.parent, null, null, this.minExpForLevel);
            
                    this.logService.createLog(
                        {
                            message: `Sheep spawned Ram (${ram.attack}/${ram.health}).`,
                            type: "ability",
                            player: this.parent
                        }
                    )

                    if (this.parent.spawnPet(ram, this.savedPosition)) {
                        this.abilityService.triggerSummonedEvents(ram);
                    }
                },
                priority: this.attack
            })
        }
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.health = health ?? this.health;
        this.attack = attack ?? this.attack;
        this.exp = exp ?? this.exp;
        this.originalHealth = this.health;
        this.originalAttack = this.attack;
        this.equipment = equipment;
        this.originalEquipment = equipment;
    }
}