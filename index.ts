import {isArray, isObject, isPlainObject, isEmpty, map, reduce, forEach, entries} from 'lodash';


const position = {
  "id": 111,
  "name": "Some hospital",
  "isExempt":false,
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

    //const errors: ValidationErrors = this.performValidation(data);
    const errors = [];

    return isEmpty(errors) ? Promise.resolve() : Promise.reject(errors);
  }

  public traverse(data) {

    if (isArray(data)) {
      this.traverseArray(data);
    }

    if (isPlainObject(data)) {
      this.traverseObject(data)
    }
  }

  private traverseArray(data) {
    forEach(data, (value, index)=> {
      console.log(value, 'array traversing')
      this.traverse(value);
    })

  }

  private traverseObject(data) {
    forEach(data, (value, key) => {
      console.log(value, 'object traversing')
      this.traverse(value);
    }) 
  }

  public iterate = (obj) => {
    Object.keys(obj).forEach(key => {

    console.log('key: '+ key + ', value: '+obj[key]);

    if (typeof obj[key] === 'object') {
      this.iterate(obj[key])
      }
    })
  }

  public iterator(data, parentKey) { // parentkey from recursive case

    forEach(data, (value, key) => {
     // console.log(`key: ${key} -> value: ${value}`);

      if (isObject(value)) {
        this.iterator(value, key)
      } else {
        console.log(`key: ${key} -> value: ${value}`);
      }
    })
  }

  public Riterator(data) {
  
   return reduce(data, (acc, value, key) => {
     //console.log(`key: ${key} -> value: ${value}`);

      if (isObject(value)) {
        return [...acc, ...this.Riterator(value)]
      } else {
        console.log(`key: ${key} -> value: ${value}`);
        return [...acc, `key: ${key} -> value: ${value} ->VALIDATED \n`]
      }
      //return [...acc, `key: ${key} -> value: ${value}`]
    }, [])


  }

}

const vs = new ValidationService(positionValidationConfig);


//vs.iterate(position);
//vs.iterator(position);
const r = vs.Riterator(position);

console.log(r, 'RRR')