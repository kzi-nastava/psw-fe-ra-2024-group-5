export enum EncounterType {
    MISC = 0,
    SOCIAL = 1,
    LOCATION = 2,
    RIDDLE = 3
}

export function encounterTypeToString(type: EncounterType) {
    switch (type) {
        case EncounterType.MISC: return "MISC";
        case EncounterType.SOCIAL: return "SOCIAL";
        case EncounterType.LOCATION: return "LOCATION";
        case EncounterType.RIDDLE: return "RIDDLE";
    }
}