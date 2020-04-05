import {isArray, isObject, isString, isPlainObject, isEmpty, map, flatMap, reduce, merge, forEach, entries} from 'lodash';


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


let PK = null;

export class ValidationService implements Validator {

  constructor(private config: ValidationConfig) {}

  public validate(data): Promise<ValidationError[]|void> {
    // return new Promise((res, rej) => {}) 

    //const errors: ValidationErrors = this.performValidation(data);
    const errors = [];

    return isEmpty(errors) ? Promise.resolve() : Promise.reject(errors);
  }

  public iterator(data, parentKey) { // parentkey from recursive case

    forEach(data, (value, key) => {
     // console.log(`key: ${key} -> value: ${value}`);

      if (isObject(value)) {
        console.log(parentKey, 'parentKey')
        this.iterator(value, key)
      } else {
        console.log(`key: ${key} -> value: ${value}`);
      }
    })
  }

  public Riterator(data, parent_key) {

    console.log('calls')

    //let PPK;

   //console.log(parent_key, 'PK')
    if (isString(parent_key)) {
      this.PK = parent_key;
      //PPK = parent_key;
    }

   //this.parent_key = parent_key;


    // if (typeof parentKey === 'string') {
    //   this.pk = parentKey;
    // }
    //var t = 'aaaa'
  
   return reduce(data, (acc, value, key) => {
      if (isArray(value) || isPlainObject(value)) {
        //console.log(value, 'VALUE')
        return [...acc, ...this.Riterator(value, key)]
      } else {
        //console.log(`key: ${key} -> value: ${value}`);
        //console.log(t, 'PK')
        //console.log(parent_key, 'PKK1')
        //console.log(data, 'DATA')
        //this.validateField(key, value);
        return [...acc, `key: ${key} -> value: ${value} ->VALIDATED \n`]
      }
      //return [...acc, `key: ${key} -> value: ${value}`]
    }, [])

  }

  private validateFields(data, currentPath) {
    return reduce(data, (value, key) => {
      return isObject(value) ? this.validateFields(value, key) : this.validateField(key, value);
    })
  }

  private validateField(key, value) {
  

  }

  private getStrategies() {

  }

  private RR(data, parent_key) {
      const r =  reduce(data, (acc, value, key) => {

        if (!isObject(value)) {
          return [...acc, `key: ${key} -> value: ${value} -> VALIDATED \n`];
        } else {
          console.log(parent_key, 'parent_key')
          return [...acc, ...this.RR(value, key)]
        }
    }, [])

      //console.log(parent_key, 'parent_key')

      return r;


  }

  private validateField(p_key, key, value) {
    //console.log(this.PK, "PK VALIDATION")
   // console.log(key, "KEY VALIDATION")
    //console.log(value, "VALUE VALIDATION")
    //console.log(this.PK, "PK VALIDATION")
   //console.log(value, 'in validation')
    //console.log(currentKey, 'currentKey')
   //console.log(value, 'value')

  }

}

const vs = new ValidationService(positionValidationConfig);


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

console.log(flattenKeys3(position), 'flatten3')