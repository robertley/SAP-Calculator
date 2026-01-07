import { Toy } from "../../toy.class";
import { LogService } from "../../../services/log.service";
import { PetService } from "../../../services/pet.service";

export class CashRegister extends Toy {
    name = 'Cash Register';
    tier = 4;

    constructor(protected logService: LogService, protected toyService: any, parent: any, level: number, private petService?: PetService) {
        super(logService, toyService, parent, level);
    }
}
