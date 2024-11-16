import { Location } from "./location.model"
import { EncounterStatus } from "../enum/encounter-status.enum"
import { EncounterType } from "../enum/encounter-type.enum"

export interface Encounter {
    id: number,
    name: string,
    description: string,
    location: Location,
    xp: number,
    EncounterStatus: EncounterStatus,
    EncounterType: EncounterType,
    creatorId: number
}