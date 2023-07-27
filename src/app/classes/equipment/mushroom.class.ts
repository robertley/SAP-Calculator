import { FaintService } from "../../services/faint.service";
import { LogService } from "../../services/log.servicee";
import { SummonedService } from "../../services/summoned.service";
import { Equipment, EquipmentClass } from "../equipment.class";
import { Pet } from "../pet.class";
import { Ant } from "../pets/ant.class";
import { Bee } from "../pets/bee.class";
import { Cricket } from "../pets/cricket.class";
import { Fish } from "../pets/fish.class";
import { Horse } from "../pets/horse.class";
import { Mosquito } from "../pets/mosquito.class";
import { ZombieCricket } from "../pets/zombie-cricket.class";

export class Mushroom extends Equipment {
    name = 'Mushroom';
    equipmentClass = 'faint' as EquipmentClass;
    callback = (pet: Pet) => {
        let newPet;
        if (pet instanceof Ant) {
            newPet = new Ant(this.logService, this.faintService, this.summonedService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Bee) {
            newPet = new Bee(this.logService, this.faintService, this.summonedService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Cricket) {
            newPet = new Cricket(this.logService, this.faintService, this.summonedService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Fish) {
            newPet = new Fish(this.logService, this.faintService, this.summonedService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Horse) {
            newPet = new Horse(this.logService, this.faintService, this.summonedService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Mosquito) {
            newPet = new Mosquito(this.logService, this.faintService, this.summonedService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof ZombieCricket) {
            newPet = new ZombieCricket(this.logService, this.faintService, this.summonedService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        pet.parent.spawnPet(newPet, pet);

        this.logService.createLog(
            {
                message: `${pet.name} Spawned ${newPet.name} (${newPet.level}) (Mushroom)`,
                type: "ability",
                player: pet.parent
            }
        )
        this.summonedService.triggerSummonedEvents(newPet);
    }

    constructor(
        protected logService: LogService,
        protected faintService: FaintService,
        protected summonedService: SummonedService
    ) {
        super()
    }
}

function levelToExp(level: number) {
    return level == 1 ? 0 : level == 2 ? 2 : 5;
}