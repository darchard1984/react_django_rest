import * as Yup from 'yup'

const FirstBoardFormSchema = Yup.object().shape({
  boardTitle: Yup.string()
    .trim()
    .required('Please add a board title')
    .max(50, 'Your board title is too long'),
})

export default FirstBoardFormSchema
