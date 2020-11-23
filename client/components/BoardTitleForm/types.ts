import { User } from '../../pages/index'

export type BoardTitleFormState = {
  boardTitle: string
}

export type BoardTitleFormProps = {
  user: User
  setState: () => Promise<void>
}
