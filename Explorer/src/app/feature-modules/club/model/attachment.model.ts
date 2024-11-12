import { ResourceType } from '../enum/resource-type.enum';

export interface Attachment {
    resourceId: number;
    resourceType: ResourceType;
}