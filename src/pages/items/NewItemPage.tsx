import { useNavigate } from 'react-router-dom'
import ItemForm from './ItemForm'
import { createItem } from '../../services/itemService'
import PageHeader from '../../components/layout/PageHeader'

export default function NewItemPage() {
  const navigate = useNavigate()

  const handleSubmit = async (fd: FormData) => {
    await createItem(fd)
    navigate('/dashboard')
  }

  return (
    <div className="space-y-6 pb-4">
      <PageHeader
        eyebrow="New item"
        title="Create a lost/found post"
        description="Share a clear report with item details, a location, and an image so it is easy to match on smaller screens too."
      />
      <ItemForm onSubmit={handleSubmit} />
    </div>
  )
}
