import * as Yup from 'yup'

const EditCardFormSchema = Yup.object().shape({
  cardTitle: Yup.string()
    .trim()
    .required('Please enter a card title')
    .max(50, 'Card title must not be more than 50 characters'),
  cardDescription: Yup.string()
    .trim()
    .required('Please enter a card title')
    .max(500, 'Description should be 500 characters or less'),
})

export default EditCardFormSchema
