import * as Yup from 'yup'

const AddBoardPanelSchema = Yup.object().shape({
  boardTitle: Yup.string().trim().required(),
})

export default AddBoardPanelSchema
