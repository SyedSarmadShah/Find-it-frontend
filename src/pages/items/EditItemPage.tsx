import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ItemForm from './ItemForm'
import { getItem, updateItem } from '../../services/itemService'
import PageHeader from '../../components/layout/PageHeader'

export default function EditItemPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [initial, setInitial] = useState<any | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    const load = async () => {
      const data = await getItem(Number(id))
      if (!cancelled) setInitial(data)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [id])

  const handleSubmit = async (fd: FormData) => {
    if (!id) return
    await updateItem(Number(id), fd)
    navigate('/dashboard')
  }

  if (!initial) return <div className="rounded-2xl bg-white/70 p-6 dark:bg-white/5">Loading...</div>

  return (
    <div className="space-y-6 pb-4">
      <PageHeader
        eyebrow="Edit item"
        title="Update your post"
        description="Refine the report details, swap the image, or correct the item type before it is shared again."
      />
      <ItemForm initial={initial} onSubmit={handleSubmit} />
    </div>
  )
}
