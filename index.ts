import {get, isNil, replace, split, filter, isArray, isObject, isNumber, isString, isPlainObject, isEmpty, map, flatMap, reduce, merge, forEach, entries} from 'lodash';


const position = {
  "id": 111,
  "name": "Some hospital",
  // "isExempt":false,
  // "reportsToName":"Martin, Michael",
  // "reportsToPersonNumber":"10015",
  "locations":[
    {
      "laborCategory":"PR-1024F",
      "primaryJob":"Organization/Australia/Metropolitan Plant/Administration/Manufacturing Manager",
      "effectiveDate":"2019-11-11"
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
  // "positionCustomDates":[
  //    {
  //      "name": "name",
  //      "description": "descriptrion",
  //      "defaultDate": "2019-01-01",
  //      "actualDate": "2019-02-01"
  //    }
  // ],
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
  EXACT_TYPE = 'exact_type'
}

const positionValidationConfig: ValidationConfig = {
  name: [
    {strategy: StrategyIds.REQUIRED},
    {strategy: StrategyIds.MAX_LENGTH, criteria: 50},
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
      //{strategy: StrategyIds.EXACT_TYPE, criteria: 'date'}
    ],
    actualDate: [
      //{strategy: StrategyIds.EXACT_TYPE, criteria: 'date'}
    ]
  }
}


// const max_length = (criteria) => {

//   return {
//     valadate
//   }
// }

// const max_length_strategy: ValidationStrategy = {
//   validate(value, criteria): boolean {
//     return value.length <= criteria;
//   }
// }

const max_length_strategy: ValidationStrategy = {
  validate(value, criteria): boolean {
    return {
      isValid: value.length <= criteria,
      errorCode: 'required'
  }
}

// const required_strategy: ValidationStrategy = {
//   validate(value) {
//     return isNil(value)
//   }
// }

const required_strategy: ValidationStrategy = {
  validate(value) {
    return {
      isValid: isNil(value),
      errorCode: 'required'

  }
}

const strategies = {
  required: required_strategy,
  max_length: max_length_strategy
}

export interface ValidationStrategy {
  validate(): ValidationStrategyResult;
}

// export interface ValidationStrategyResult {
//   isValid: boolean;
//   errorCode: string;
// }

export interface ValidationStrategyResult {
  isValid: boolean;
  errorCode: string;
}


export interface ValidationError { // path (without index) + code ==> localized message by key locations.laborCategory.max_length
  code: string;
  path: string;
  //fieldPath: string;
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

  constructor(private config: ValidationConfig, private strategies) {}

  public validate(data): Promise<ValidationError[]|void> {
    // return new Promise((res, rej) => {}) 

    //const errors: ValidationErrors = this.performValidation(data);
    const errors = [];

    return isEmpty(errors) ? Promise.resolve() : Promise.reject(errors);
  }

  private traverseWithValidation(data, path = []) {
    if (!isObject(data)) {
      return [...this.validateField(data, path.join('.'))];
    } else {
      return reduce(data, (acc, value, key) => {
        console.log(key, 'key')

        return [...acc, ...this.traverseWithValidation(value, [...path, key])]
      }, [])
    }
  }

  

  private validateField(value, path, strategyPath) {
    //console.log(path, strategyPath, value, "validateField")
   // console.log(path, "PATH")
   // console.log(strategyPath, "STRATEGY_PATH")
    const fieldConfig = this.getFieldConfig(path);
    //console.log(fieldConfig, 'CONFIG')

    const res = reduce(fieldConfig, (acc, curr) => {
      const strategy = this.strategies[curr.strategy];
      //const isValid = strategy.validate(value, curr.criteria);

      const result = strategy.validate(value, curr.criteria);

    }, [])

    return [{path, value}]
  }

  private getFieldConfig(path) {
    return get(this.config, replace(path, /\d{1,}\./g, ''));
  }

}

const vs = new ValidationService(positionValidationConfig, strategies);
const res = vs.traverseWithValidation(position)

console.log(res, 'res')


//vs.iterate(position);
//vs.iterator(position);
//const r = vs.Riterator(position);
//const rr = vs.RR(position);
//console.log(rr, 'RRRRRR')

//console.log(r, 'RRR')

// const flattenKeys = (obj, path = []) =>
//     !isObject(obj)
//         ? { [path.join('.')]: validateIt(obj) }
//         : reduce(obj, (cum, next, key) => merge(cum, flattenKeys(next, [...path, key])), {});


//console.log(flattenKeys(position), 'flatten')


const flattenKeys2 = (obj, path = []) => {
  if (!isObject(obj)) {
    return { [path.join('.')]: validateIt(obj, path.join('.')) }
  } else {

    return reduce(obj, (cum, next, key) => {
      return merge(cum, flattenKeys2(next, [...path, key]))
      }, {})
  }
}

function validateIt(value, path) {
  console.log(path, 'path')
  console.log(value, 'tttttttttt')
  return value + "___VALIDATED"
}

//console.log(flattenKeys2(position), 'flatten2')

const flattenKeys3 = (data, path = []) => {
  if (!isObject(data)) {
    //return { [path.join('.')]: validateIt3(data, path.join('.')) }
    return [path.join('.'), validateIt3(data, path.join('.'))]
  } else {

    return reduce(data, (cum, next, key) => {
      //return merge(cum, flattenKeys3(next, [...path, key]))
      return [...cum, ...flattenKeys3(next, [...path, key])]
      }, [])
  }
}

function validateIt3(value, path) {
  console.log(path, 'path')
  console.log(value, 'tttttttttt')
  return value + "___VALIDATED"
}

//console.log(flattenKeys3(position), 'flatten3')
const badPath = "locations.0.laborCategory";

const goodPath = replace(badPath, /\d{1,}\./g, '')
//const goodPath = filter(split(badPath, '.'), isString)

console.log(goodPath, 'GOOD_PATH')