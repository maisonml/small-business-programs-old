// @ts-nocheck

import React, { createContext, useContext, useState, useEffect } from 'react'
import { initializeForm } from "../forms";
import { Form } from '~/forms/types'
import { useTranslation } from '~/contexts/language'
import { FirebaseContext } from "../services/firebase";

interface FormState {
  setValue: (id: string, value: Value) => void
  setError: (id: string, value: string) => void
  values: Values
  errors: Errors
  form: Form
}

export interface Values {
  [key: string]: Value
}

export interface Errors {
  [key: string]: string
}

export type Value = string | string[] | Date

export const FormContext = createContext<FormState | undefined>(undefined)

// Just hardcoding this here for now, if we want to support multiple forms in the future just need to hoist it outside
// and pass it into the provider as a prop
// const form = initializeForm();

// console.log('form old', form)

export const FormProvider:React.FC<{children: React.ReactNode}> = ({ children }) => { 
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [formValues, setFormValues] = useState<Values>({});
  const [formErrors, setFormErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [rawForm, setRawForm] = useState({});

  // console.log('raw form in state', rawForm)

  const setFormValue = (key: string, value: Value) => setFormValues({ ...formValues, [key]: value });
  const setFormError = (key: string, value: string) => setFormErrors({ ...formErrors, [key]: value });

  const firebase = useContext(FirebaseContext)
  
  const fetchFirebaseData = async () => {
    setLoading(true);
    const db = firebase.database();
    await db.ref('/').once('value').then((snapshot) => {
      setRawForm(snapshot.val())
      setLoading(false);
    })
  }

  useEffect(() => {
    fetchFirebaseData();
  }, [firebase])

  return (
    <FormContext.Provider
      value={{
        setError: setFormError,
        setValue: setFormValue,
        values: formValues,
        errors: formErrors,
        form: useTranslation(rawForm)
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

export function useForm() {
  const formCtx = useContext(FormContext)
  if(formCtx === undefined) {
    throw Error('No surrounding FormProvider found')
  }
  return formCtx
}

export function useFormDictionary(...keys: string[]): string[] {
  const foo = useForm()
  console.log('DICTIONARRRRY form', foo)
  if (!foo) return;
  const { form: {instructions: dictionary} } = foo
  
  return keys.map(key => {
    if (!dictionary) return '';
    return dictionary[key]
  })
}

export function useFormField(id: string): [Value, (val: Value) => void] {
  const { values, setValue } = useForm()
  return [values[id], (val: Value) => setValue(id, val)];
}