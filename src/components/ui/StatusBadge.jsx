import { getStatusClass } from '../../lib/utils'

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center border text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusClass(status)}`}>
      {status}
    </span>
  )
}
