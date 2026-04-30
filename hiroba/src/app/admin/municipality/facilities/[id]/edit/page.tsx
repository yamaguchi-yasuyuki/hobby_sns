import { notFound } from "next/navigation"
import FacilityStaffForm from "@/components/admin/municipality/FacilityStaffForm"
import { getMockFacilityById } from "@/lib/mock-data"

type Props = { params: Promise<{ id: string }> }

export default async function MunicipalityFacilityEditPage({ params }: Props) {
  const { id } = await params
  const facility = getMockFacilityById(id)
  if (!facility) notFound()

  return <FacilityStaffForm mode="edit" initialFacility={facility} />
}
