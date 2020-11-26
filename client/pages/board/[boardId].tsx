import React from 'react'
import { useRouter } from 'next/router'

const Board = () => {
  const router = useRouter()

  const { boardId } = router.query

  return <p>Board: {boardId}</p>
}

export default Board
