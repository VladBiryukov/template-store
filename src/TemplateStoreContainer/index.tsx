import React, { useState } from 'react'
import { TextareaAutosize, Grid } from '@material-ui/core';
import { useStyles } from './styles';

const placeholder = 'api'

const ecamplaString = ` 
id: number,
date: string,
field_field: number | null,
arr_ids: number[],
`;

export type ObjWithString = { [key: string]: string };

// deleted_at: null | string => {deleted_at, type}
function getObjKeySnakeCaseAndType(rawString: string): ObjWithString {
  const [fieldSnakeCase, type] = rawString.split(':');
  const result = { fieldSnakeCase: fieldSnakeCase?.trim() || '', type: type?.trim() || '' }
  return result
}
// deleted_at => deletedAt
const toCamel = (s: string): string => {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};
// @observable
export function getStringObservableFieldWithType(field: string, type: string): string {
  return `@observable ${field}: ${type};`
}
// {deleted_at, type}[]
function parseStringToArrayObjKeyAndValue(rawString: string): ObjWithString[] {
  const arrayRawStrings: string[] = rawString.split(',');
  const arrayObjWithKeySnakeCaseAndType = arrayRawStrings.map(getObjKeySnakeCaseAndType).filter(item => !!item.type);
  return arrayObjWithKeySnakeCaseAndType;
}

export function getStrFieldItemForFromApi(strSnakeCase: string, type: string): string {
  return `this.${toCamel(strSnakeCase)} = api.${strSnakeCase};`
}

export function renderMethodFromApi(arrayFieldWithTypes: ObjWithString[]): JSX.Element {
  return (
    <Grid container direction='column'>
      <Grid item>{`@action fromAPI(api) {`}</Grid>
      {arrayFieldWithTypes.map(({ fieldSnakeCase, type }, index) => (
        <Grid item key={index}>{getStrFieldItemForFromApi(fieldSnakeCase, type)}</Grid>
      ))}
      <Grid item>{`return this;`}</Grid>
      <Grid item>{`}`}</Grid>
    </Grid>
  )
}

export function getStrFieldItemForToApi(strSnakeCase: string): string {
  return `${strSnakeCase}: this.${toCamel(strSnakeCase)},`
}

export function renderMethodToApi(arrayFieldWithTypes: ObjWithString[]): JSX.Element {
  return (
    <Grid container direction='column'>
      <Grid item>{`@action toApi() {`}</Grid>
      <Grid item>{`return ({`}</Grid>
      {arrayFieldWithTypes.map(({ fieldSnakeCase }, index) => (
        <Grid item key={index}>{getStrFieldItemForToApi(fieldSnakeCase)}</Grid>
      ))}
      <Grid item>{`});`}</Grid>
      <Grid item>{`}`}</Grid>
    </Grid>
  )
}


const TemplateStoreContainer = () => {
  const [selectValue, setSelectValue] = useState<string>('')
  const classes = useStyles();
  const arrayFieldAsSnakeCaseWithType = parseStringToArrayObjKeyAndValue(selectValue)

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid container>
          <Grid item xs={6}>
            <TextareaAutosize
              placeholder={placeholder}
              className={classes.textField}
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>

            <Grid container direction='column'>
              <Grid item style={{ userSelect: 'none' }}>Пример</Grid>
              <Grid item style={{ whiteSpace: 'pre' }}>{ecamplaString}</Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container direction='column' justify='flex-start'>
          <Grid item className={classes.padded}>
            {arrayFieldAsSnakeCaseWithType.map(({ fieldSnakeCase, type }, index) => (
              <Grid container key={index}>
                <Grid item>{getStringObservableFieldWithType(toCamel(fieldSnakeCase), type)}</Grid>
              </Grid>
            ))}
          </Grid>
          <Grid item className={classes.padded}>
            {renderMethodFromApi(arrayFieldAsSnakeCaseWithType)}
          </Grid>
          <Grid item className={classes.padded}>
            {renderMethodToApi(arrayFieldAsSnakeCaseWithType)}
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default TemplateStoreContainer