import { Relationship } from './relationship.entity';

export const relationshipProvider = [
    {
        provide: 'RelationshipRepository',
        useValue: Relationship,
    },
];