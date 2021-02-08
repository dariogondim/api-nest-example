import { Allow } from 'class-validator';
import { RelationType } from '../../relation-type/relation-type.enum';

export class RetrieveBtModelQuery {

    @Allow()
    search: string;

    @Allow()
    relationType: RelationType;

    @Allow()
    isXperMentor: boolean;

    @Allow()
    latitude: number;

    @Allow()
    longitude: number;

    @Allow()
    radius: number;

    @Allow()
    byName: boolean = false;

    @Allow()
    byCompany: boolean = false;
    
    @Allow()
    byPurpose: boolean = false;

    @Allow()
    byValueOffer: boolean = false;

    @Allow()
    byProblemsOpportunities: boolean = false;

    @Allow()
    byChannels: boolean = false;

    @Allow()
    byJourney: boolean = false;

    @Allow()
    byClients: boolean = false;

    @Allow()
    byEcosystem: boolean = false;

    @Allow()
    byProcesses: boolean = false;

    @Allow()
    byAssets: boolean = false;

    @Allow()
    byRevenue: boolean = false;

    @Allow()
    byPositiveImpacts: boolean = false;

    @Allow()
    byCosts: boolean = false;

    @Allow()
    byNegativeExternalities: boolean = false;

    @Allow()
    byInsights: boolean = false;
}