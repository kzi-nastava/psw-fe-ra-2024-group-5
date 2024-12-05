import { Location } from "./location.model"
import { EncounterStatus } from "../enum/encounter-status.enum"
import { EncounterType } from "../enum/encounter-type.enum"

export interface Encounter {
    type: EncounterType,
    id: number,
    name: string,
    description: string,
    location: Location,
    xp: number,
    status: EncounterStatus,
    creatorId: number
}

export interface SocialEncounter extends Encounter {
    radius: number,
    peopleCount: number,
    currentPeopleCount: number,
}

export function isSocialEncounter(encounter: Encounter): encounter is SocialEncounter {
    return encounter.type === EncounterType.SOCIAL;
}