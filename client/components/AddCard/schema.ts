import * as Yup from 'yup'

const AddCardSchema = Yup.object().shape({
  cardTitle: Yup.string()
    .trim()
    .required('This field is required')
    .max(50, 'Title should be 50 characters or less'),
  cardDescription: Yup.string()
    .trim()
    .required('This field is required')
    .max(500, 'Description should be 500 characters or less'),
})

export default AddCardSchema
