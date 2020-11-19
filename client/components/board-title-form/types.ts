export type BoardTitleFormState = {
  boardTitle: string
}

export type BoardTitleFormProps = {
  boardTitle: string
  setState: (values: BoardTitleFormState) => void
}
