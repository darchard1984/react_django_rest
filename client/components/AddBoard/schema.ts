import * as Yup from 'yup'

const AddBoardPanelSchema = Yup.object().shape({
  boardTitle: Yup.string().trim().required('Please add a board title'),
})

export default AddBoardPanelSchema
