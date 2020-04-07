import {get, eq, find, isNil, replace, split, filter, isArray, isObject, isNumber, isString, isPlainObject, isEmpty, map, flatMap, reduce, merge, forEach, entries, invoke} from 'lodash';


const position = {
  "id": 111,
  "name": "ddddddddd",
  "isExempt":false,
  "reportsToName":"Martin, Michael",
  "reportsToPersonNumber":"10015",
  "locations":[
    {
      "laborCategory":"PR-1024F",
      "primaryJob":"Organization/Australia/Metropolitan Plant/Administration/Manufacturing Manager",
      "effectiveDate":""
    },
    {
      "laborCategory":"2",
      "primaryJob":"22 Manager",
      "effectiveDate":"222"
    }
  ],
  // "positionStatuses":[ 
  //   { 
  //     "name":"active",
  //     "effectiveDate":"2019-01-01"
  //   }
  // ],
  // "positionCustomDatas":[
  //    {
  //      "name": "field name",
  //      "value": "value"  
  //    }
  // ],
  // "hireDate": "2019-01-01",
  // "seniorityRankDate": "2019-01-01",
  "positionCustomDates":[
     {
       "name": "name",
       "description": "descriptrion",
       "defaultDate": "2019-01-01",
       "actualDate": "2019-02-01"
     }
  ],
  // "jobTransferSets":[
  //   {
  //     "jobTransferSet": "Grocery Frontend Emp",
  //     "managerAdditions": "text",
  //     "effectiveDate": "2019-01-01"
  //   }
  // ]
}


export enum StrategyIds {
  REQUIRED = 'required',
  MAX_LENGTH = 'max_length',
  MIN_LENGTH = 'min_length',
  REG_EXP = 'reg_exp',
  DATE = 'date'
}

const positionValidationConfig: ValidationConfig = {
  name: [
    {strategy: StrategyIds.REQUIRED},
    {strategy: StrategyIds.MAX_LENGTH, criteria: 5},
    //{strategy: StrategyIds.MIN_LENGTH, criteria: 1}
  ],
  reportsToName: [
    {strategy: StrategyIds.REQUIRED}
  ],
  reportsToPersonNumber: [
    {strategy: StrategyIds.REQUIRED},
   // {strategy: StrategyIds.EXACT_TYPE, criteria: 'number'}
  ],
  hireDate: [
     {strategy: StrategyIds.REQUIRED},
     //{strategy: StrategyIds.EXACT_TYPE, criteria: 'date'}
  ],
  seniorityRankDate: [
    //{strategy: StrategyIds.EXACT_TYPE, criteria: 'date'}
  ],
  locations: {
    primaryJob: [
      {strategy: StrategyIds.REQUIRED}
    ],
    effectiveDate: [
     {strategy: StrategyIds.REQUIRED},
    // {strategy: StrategyIds.EXACT_TYPE, criteria: 'date'}
    ]
  },
  jobTransferSets: {
      jobTransferSet: [
        {strategy: StrategyIds.REQUIRED}
      ],
      effectiveDate: [
        //{strategy: StrategyIds.EXACT_TYPE, criteria: 'date'}
      ]
  },
  positionStatuses: {
    name: [
      {strategy: StrategyIds.REQUIRED},
    ],
    effectiveDate: [
      {strategy: StrategyIds.REQUIRED},
      //{strategy: StrategyIds.EXACT_TYPE, criteria: 'date'}
    ]
  },
  positionCustomDatas: {
    value: [
      {strategy: StrategyIds.MAX_LENGTH, criteria: 80},
    ]
  },
  positionCustomDates: {
    defaultDate: [
      {strategy: StrategyIds.REQUIRED},
      //{strategy: StrategyIds.EXACT_TYPE, criteria: 'date'}
    ],
    actualDate: [
      {strategy: StrategyIds.REQUIRED},
      //{strategy: StrategyIds.EXACT_TYPE, criteria: 'date'}
    ]
  }
}

const date_strategy: ValidationStrategy = {
  validate(value, path, criteria): ValidationStrategyResult {
    return {
      path,
      id: StrategyIds.MAX_LENGTH,
      invalid: !new RegExp(criteria).test(value),
    }
  }
}


const reg_exp_strategy: ValidationStrategy = {
  validate(value, path, criteria): ValidationStrategyResult {
    return {
      path,
      id: StrategyIds.MAX_LENGTH,
      invalid: !new RegExp(criteria).test(value),
    }
  }
}

const max_length_strategy: ValidationStrategy = {
  validate(value = '', path, criteria): ValidationStrategyResult {
    return {
      path,
      id: StrategyIds.MAX_LENGTH,
      invalid: value.length > criteria,
    }
  }
}

const required_strategy: ValidationStrategy = {
  validate(value, path): ValidationStrategyResult {
    return {
      path,
      id: StrategyIds.REQUIRED,
      invalid: isEmpty(value),
    }
  }
}

const strategies = {
  [StrategyIds.REQUIRED]: required_strategy,
  [StrategyIds.MAX_LENGTH]: max_length_strategy
}

export interface ValidationStrategy {
  validate(value: any, path: string, criteria?: any): ValidationStrategyResult;
}

export interface ValidationStrategyResult {
  id: StrategyIds;
  path: string;
  invalid: boolean;
}


export interface ValidationError { // path (without index) + code ==> localized message by key locations.laborCategory.max_length
  code: string;
  path: string;
}

export type ValidationErrors = ValidationError[];
export type ValidationRules = ValidationRule[];

export interface Validator {
  validate<T extends object>(data: T): Promise<ValidationErrors | void>
}

export interface ValidationRule {
  strategy: StrategyIds;
  criteria?: any;
}

export interface ValidationConfig {
  [key: string]: ValidationRules | ValidationConfig;
}


export class ValidationService implements Validator {

  constructor(private config: ValidationConfig, private strategies) {}

  public validate<T extends object>(data: T): Promise<ValidationError[] | void> {

    const errors: ValidationErrors = this.traverseWithValidation(data);

    return isEmpty(errors) ? Promise.resolve() : Promise.reject(errors);
  }

  private traverseWithValidation(data, path = []) {
    return reduce(data, (acc, value, key) => (
      isObject(value)
        ? [...acc, ...this.traverseWithValidation(value, [...path, key])]
        : [...acc, ...this.validateField(value, [...path, key].join('.'))]
    ), []);
  }

  private validateField(value, path): ValidationStrategyResult[] {

    let errors = [];
    const fieldRules = this.getFieldRules(path);

    if (isEmpty(fieldRules)) {
      return errors;
    }

    for (const fieldRule of fieldRules) {
      const strategy = this.strategies[fieldRule.strategy];
      const result = strategy.validate(value, path, fieldRule.criteria);

      if (result.invalid) {
        errors = [...errors, result];
      }

      if (this.shouldSkipRestRules(result)) {
        return;
      }
    }

    return errors;
  }

  private shouldSkipRestRules(result): boolean {
    return eq(result.strategy, StrategyIds.REQUIRED) && result.invalid;
  }

  private getFieldRules(path): ValidationRules {
    return get(this.config, replace(path, /\d{1,}\./g, ''));
  }
}

const vs = new ValidationService(positionValidationConfig, strategies);
async function thunk() {
  try {
    await vs.validate(position);
  } catch (errors) {
    console.log(errors, 'final errors output')
  }
} 

thunk();


/*
  private traverseWithValidation(data, path = []) {
    // return reduce(data, (acc, value, key) => {
    //   if (isObject(value)) {
    //     return [...acc, ...this.traverseWithValidation(value, [...path, key])];
    //   } else {
    //     return [...acc, ...this.validateField5(value, [...path, key].join('.'))];
    //   }
    // }, []);

    return reduce(data, (acc, value, key) => (
      isObject(value)
        ? [...acc, ...this.traverseWithValidation(value, [...path, key])]
        : [...acc, ...this.validateField5(value, [...path, key].join('.'))]
    ), []);
  }
*/