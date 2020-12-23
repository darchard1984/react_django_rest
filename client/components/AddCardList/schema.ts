import * as Yup from 'yup'

const AddListSchema = Yup.object().shape({
  listTitle: Yup.string().trim().required(),
})

export default AddListSchema
