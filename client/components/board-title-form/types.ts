export type BoardTitleFormState {
  boardTitle: string
}

export type BoardTitleFormProps = {
  boardTitle: string
  setState: (values: BoardTitleFormState) => void
  currentUser: {
    uid: string
    idToken: string
    pk: number
  }
}
