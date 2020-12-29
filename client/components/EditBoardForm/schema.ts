import * as Yup from 'yup'

const EditBoardFormPanelSchema = Yup.object().shape({
  boardTitle: Yup.string()
    .trim()
    .required('Please enter a board title')
    .max(50, 'Title must not be more than 50 characters'),
})

export default EditBoardFormPanelSchema
