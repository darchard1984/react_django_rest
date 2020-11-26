import * as Yup from 'yup'

const AddBoardPanelFormSchema = Yup.object().shape({
  boardTitle: Yup.string()
    .trim()
    .required('Please add a board title')
    .max(50, 'Your board title is too long'),
})

export default AddBoardPanelFormSchema