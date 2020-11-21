export type HomeState = {
  currentUser: {
    uid: string
    idToken: string
    pk: number | null
  }
  boardTitle: string
}
