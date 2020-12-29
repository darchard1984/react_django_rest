import * as Yup from 'yup'

const AddListSchema = Yup.object().shape({
  listTitle: Yup.string().trim().required('Please enter a list title'),
})

export default AddListSchema
