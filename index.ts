import {map, reduce, forEach, entries} from 'lodash';


const data = {
  "id": 111,
  "name": "position name",
  "isExempt":false,
  "reportsToName":"Martin, Michael",
  "reportsToPersonNumber":"10015",
  "locations":[
    {
      "laborCategory":"PR-1024F",
      "primaryJob":"Organization/Australia/Metropolitan Plant/Administration/Manufacturing Manager",
      "effectiveDate":"2019-11-11"
    }
  ],
  "positionStatuses":[ 
    { 
      "name":"active",
      "effectiveDate":"2019-01-01"
    }
  ],
  "positionCustomDatas":[
     {
       "name": "field name",
       "value": "value"  
     }
  ],
  "hireDate": "2019-01-01",
  "seniorityRankDate": "2019-01-01",
  "positionCustomDates":[
     {
       "name": "name",
       "description": "descriptrion",
       "defaultDate": "2019-01-01",
       "actualDate": "2019-02-01"
     }
  ],
  "jobTransferSets":[
    {
      "jobTransferSet": "Grocery Frontend Emp",
      "managerAdditions": "text",
      "effectiveDate": "2019-01-01"
    }
  ]
}

export enum StrategyIds {
  REQUIRED = 'required',
  MAX_LENGTH = 'max_length',
  MIN_LENGTH = 'min_length',
  EXACT_TYPE = 'exact_type'
}


const positionValidationConfig = {
  name: [
    {strategy: 'required'},
    {strategy: 'max_length', criteria: 50},
    {strategy: 'min_length', criteria: 1}
  ],
  reportsToName: [
    {strategy: 'required'}
  ],
  reportsToPersonNumber: [
    {strategy: 'required'}
  ],
  hireDate: [
     {strategy: 'required'},
     {strategy: 'exact_type', criteria: 'date'}
  ],
  seniorityRankDate: [
    {strategy: 'exact_type', criteria: 'date'}
  ],
  locations: {
    primaryJob: [
      {strategy: 'required'}
    ],
    effectiveDate: [
      {strategy: 'required'},
      {strategy: 'exact_type', criteria: 'date'},
    ]
  },
  jobTransferSets: {
      jobTransferSet: [{strategy: 'required'}],
      effectiveDate: [{strategy: 'exact_type', criteria: 'date'}]
  },
  positionStatuses: {
    name: [{strategy: 'required'}],
    effectiveDate: [
      {strategy: 'required'},
      {strategy: 'exact_type', criteria: 'date'},
    ]
  },
  positionCustomDatas: {
    value: [{strategy: 'max_length', criteria: 80}]
  },
  positionCustomDates: {
    defaultDate: [{strategy: 'exact_type', criteria: 'date'}],
    actualDate: [{strategy: 'exact_type', criteria: 'date'}]
  }
}

export enum ValidationStrategyIds {
  REQUIRED = 'required',
  MAX_LENGTH = 'max_length',
  MIN_LENGTH = 'min_length',
  EXACT_TYPE = 'exact_type'
}

export interface ValidationStrategyResult {
  isValid: boolean;
  errorCode: string;
}

export interface ValidationStrategy {
  validate(): ValidationStrategyResult;
}

export interface ValidationError {
  code: string;
  fieldId: string;
  fieldPath: string;
}

export interface Validator {
  validate(data: any, config: any): Promise<'Success' | ValidationError[]>
}

export interface ValidationRule {
  strategy: 
}

export interface ValidationConfig {
  [key: string]: ValidationConfig | 
}

export class ValidationService {

  constructor(config: ValidationConfig)

}