import { Allow } from 'class-validator';

export class RetrieveUserQuery {

    @Allow()
    search: string;

    @Allow()
    latitude: number;

    @Allow()
    longitude: number;

    @Allow()
    radius: number;

    @Allow()
    relationType: string;

    @Allow()
    isXperMentor: boolean;
}