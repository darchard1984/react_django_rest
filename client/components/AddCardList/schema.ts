import * as Yup from 'yup'

const AddCardListSchema = Yup.object().shape({
  listTitle: Yup.string().trim().required('Please enter a list title'),
})

export default AddCardListSchema
