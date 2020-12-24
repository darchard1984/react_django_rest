import * as Yup from 'yup'

const EditCardListFormSchema = Yup.object().shape({
  listTitle: Yup.string()
    .trim()
    .required('Please enter a card title')
    .max(50, 'Title must not be more than 50 characters'),
})

export default EditCardListFormSchema
