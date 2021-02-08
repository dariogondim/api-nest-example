import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class RetrieveSearchUserDto {

    constructor(id?:number, userId?:number, name?:string, xperMentor?:boolean, company?:string,
        country?:string, city?:string, purpose?:string, valueOffer?:string, problemsOpportunities?:string,
        channels?:string, journey?:string, clients?:string, ecosystem?:string, processes?:string,
        assets?:string, revenue?:string, positiveImpacts?:string, costs?:string,
        negativeExternalities?:string, insights?:string, distance?:number) {

        this.id = id;
        this.userId = userId;
        this.name = name;
        this.xperMentor = xperMentor;
        this.company = company;
        this.country = country;
        this.city = city;
        this.distance = distance;
        this.purpose = purpose;
        if(valueOffer && valueOffer.length > 0) this.hasValueOffer = true;
        if(problemsOpportunities && problemsOpportunities.length > 0) this.hasProblemsOpportunities = true;
        if(channels && channels.length > 0) this.hasChannels = true;
        if(journey && journey.length > 0) this.hasJourney = true;
        if(clients && clients.length > 0) this.hasClients = true;
        if(ecosystem && ecosystem.length > 0) this.hasEcosystem = true;
        if(processes && processes.length > 0) this.hasProcesses = true;
        if(assets && assets.length > 0) this.hasAssets = true;
        if(revenue && revenue.length > 0) this.hasRevenue = true;
        if(positiveImpacts && positiveImpacts.length > 0) this.hasPositiveImpacts = true;
        if(costs && costs.length > 0) this.hasCosts = true;
        if(negativeExternalities && negativeExternalities.length > 0) this.hasNegativeExternalities = true;
        if(insights && insights.length > 0) this.hasInsights = true;
    }

    @ApiModelProperty()
    id: number;

    @ApiModelProperty()
    userId: number;

    @ApiModelProperty()
    name: string;

    @ApiModelProperty()
    xperMentor: boolean;

    @ApiModelProperty()
    company: string;

    @ApiModelProperty()
    country: string;

    @ApiModelProperty()
    city: string;

    @ApiModelProperty()
    distance: number;

    @ApiModelProperty()
    purpose: string;

    @ApiModelProperty()
    hasValueOffer: boolean = false;

    @ApiModelProperty()
    hasProblemsOpportunities: boolean = false;

    @ApiModelProperty()
    hasChannels: boolean = false;

    @ApiModelProperty()
    hasJourney: boolean = false;

    @ApiModelProperty()
    hasClients: boolean = false;

    @ApiModelProperty()
    hasEcosystem: boolean = false;

    @ApiModelProperty()
    hasProcesses: boolean = false;

    @ApiModelProperty()
    hasAssets: boolean = false;

    @ApiModelProperty()
    hasRevenue: boolean = false;

    @ApiModelProperty()
    hasPositiveImpacts: boolean = false;

    @ApiModelProperty()
    hasCosts: boolean = false;

    @ApiModelProperty()
    hasNegativeExternalities: boolean = false;

    @ApiModelProperty()
    hasInsights: boolean = false;
}