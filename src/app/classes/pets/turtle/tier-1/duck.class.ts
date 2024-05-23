import { Pack, Pet } from "../../../pet.class";

export class Duck extends Pet {
    name = "Duck";
    tier = 1;
    pack: Pack = 'Turtle';
    health = 3;
    attack = 2;
}