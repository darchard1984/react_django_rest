import * as Yup from 'yup'

const AddListSchema = Yup.object().shape({
  listTitle: Yup.string().trim(),
})

export default AddListSchema
