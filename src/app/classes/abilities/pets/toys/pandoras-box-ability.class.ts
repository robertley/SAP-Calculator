import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { EquipmentService } from "app/services/equipment.service";
import { getOpponent } from "../../../../util/helper-functions";
import { cloneEquipment } from "app/util/equipment-utils";

export class PandorasBoxAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;
    private equipmentService: EquipmentService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService, equipmentService: EquipmentService) {
        super({
            name: 'PandorasBoxAbility',
            owner: owner,
            triggers: ['StartBattle'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
        this.equipmentService = equipmentService;
    }

    private executeAbility(context: AbilityContext): void {
        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        const equipmentMap = this.equipmentService.getInstanceOfAllEquipment();
        const ailments = Array.from(this.equipmentService.getInstanceOfAllAilments().values());
        const excludedPerks = new Set([
            'Cake Slice',
            'Carrot',
            'Cherry',
            'Chocolate Cake',
            'Coconut',
            'Croissant',
            'Cucumber',
            'Eggplant',
            'Fig',
            'Gingerbread Man',
            'Grapes',
            'Golden Egg',
            'Health Potion',
            'Love Potion',
            'Magic Beans',
            'Peanut',
            'Pie',
            'Rambutan',
            'Rice',
            'Skewer'
        ]);
        const perks = Array.from(equipmentMap.values()).filter((equipment) => equipment && !excludedPerks.has(equipment.name));
        const opponent = getOpponent(gameApi, owner.parent);
        const pets = [...owner.parent.petArray, ...opponent.petArray].filter((pet) => pet?.alive);
        for (const pet of pets) {
            const useAilment = Math.random() < 0.5;
            const pool = useAilment ? ailments : perks;
            if (!pool.length) {
                continue;
            }
            const baseEquipment = pool[Math.floor(Math.random() * pool.length)];
            if (!baseEquipment) {
                continue;
            }
            const perkClone = cloneEquipment(baseEquipment);
            if (!perkClone) {
                continue;
            }
            pet.givePetEquipment(perkClone, this.level);
            this.logService.createLog({
                message: `Pandoras Box Ability gave ${pet.name} ${perkClone.name}`,
                type: "ability",
                player: owner.parent,
                tiger,
                pteranodon,
                randomEvent: true,
            });
        }

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): PandorasBoxAbility {
        return new PandorasBoxAbility(newOwner, this.logService, this.abilityService, this.equipmentService);
    }
}
