export type BoardTitleFormState = {
  boardTitle: string
}

export type BoardTitleFormProps = {
  currentUser: {
    uid: string
    idToken: string
    pk: number
  }
  setState: () => Promise<void>
}
