import {isEmpty, map, reduce, forEach, entries} from 'lodash';


const position = {
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

const positionValidationConfig: ValidationConfig = {
  name: [
    {strategy: StrategyIds.REQUIRED},
    {strategy: StrategyIds.MAX_LENGTH, criteria: 50},
    {strategy: StrategyIds.MIN_LENGTH, criteria: 1}
  ],
  reportsToName: [
    {strategy: StrategyIds.REQUIRED}
  ],
  reportsToPersonNumber: [
    {strategy: StrategyIds.REQUIRED},
    {strategy: StrategyIds.EXACT_TYPE, criteria: 'number'}
  ],
  hireDate: [
     {strategy: StrategyIds.REQUIRED},
     {strategy: StrategyIds.EXACT_TYPE, criteria: 'date'}
  ],
  seniorityRankDate: [
    {strategy: StrategyIds.EXACT_TYPE, criteria: 'date'}
  ],
  locations: {
    primaryJob: [
      {strategy: StrategyIds.REQUIRED}
    ],
    effectiveDate: [
     {strategy: StrategyIds.REQUIRED},
     {strategy: StrategyIds.EXACT_TYPE, criteria: 'date'}
    ]
  },
  jobTransferSets: {
      jobTransferSet: [
        {strategy: StrategyIds.REQUIRED}
      ],
      effectiveDate: [
        {strategy: StrategyIds.EXACT_TYPE, criteria: 'date'}
      ]
  },
  positionStatuses: {
    name: [
      {strategy: StrategyIds.REQUIRED},
    ],
    effectiveDate: [
      {strategy: StrategyIds.REQUIRED},
      {strategy: StrategyIds.EXACT_TYPE, criteria: 'date'}
    ]
  },
  positionCustomDatas: {
    value: [
      {strategy: StrategyIds.MAX_LENGTH, criteria: 80},
    ]
  },
  positionCustomDates: {
    defaultDate: [
      {strategy: StrategyIds.EXACT_TYPE, criteria: 'date'}
    ],
    actualDate: [
      {strategy: StrategyIds.EXACT_TYPE, criteria: 'date'}
    ]
  }
}



export interface ValidationStrategy {
  validate(): ValidationStrategyResult;
}

export interface ValidationStrategyResult {
  isValid: boolean;
  errorCode: string;
}


export interface ValidationError {
  code: string;
  fieldId: string;
  fieldPath: string;
}

export type ValidationErrors = ValidationError[];

export interface Validator {
  validate<T extends object | []>(data: T): Promise<ValidationErrors | void>
}

export interface ValidationRule {
  strategy: StrategyIds;
  criteria?: any;
}

export interface ValidationConfig {
  [key: string]: ValidationRule[] | ValidationConfig;
}

export class ValidationService implements Validator {

  constructor(private config: ValidationConfig) {}

  public validate(data): Promise<ValidationError[]|void> {
    // return new Promise((res, rej) => {}) 

    const errors: ValidationErrors = this.performValidation(data);

    return isEmpty(errors) ? Promise.resolve() : Promise.reject(errors);
  }

  private performValidation(data): ValidationError[] {

    const result = reduce(data, (acc, value, key) => {

      console.log(acc, value, key)

      console.log(this,'this')

      // if (isArray(value)) {
      //   return
      // }

      return 'x'

    }, [])








    return [
      {
        code: 'string',
        fieldId: 'string',
        fieldPath: 'string'
      }
    ]
  }
 
}

const vs = new ValidationService(positionValidationConfig);


vs.validate(position);