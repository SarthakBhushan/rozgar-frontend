import { Link } from 'react-router-dom'
import { useMyThreads } from '../hooks/useApi'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import { formatDateTime } from '../lib/utils'
import { MessageSquare } from 'lucide-react'

function ThreadCard({ thread, userId }) {
  const isBuyer = thread.buyerUserId === userId
  return (
    <Link
      to={`/chat/${thread.id}`}
      className="card flex items-center gap-4 hover:border-navy-700 hover:shadow-sm transition-all group"
    >
      <div className="w-10 h-10 bg-navy-50 rounded-full flex items-center justify-center flex-shrink-0">
        <MessageSquare className="w-4 h-4 text-navy-700" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-gray-900 group-hover:text-navy-700">
            RFQ #{thread.rfqId}
          </span>
          <span className={`text-2xs px-1.5 py-0.5 rounded-full font-medium ${isBuyer ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
            {isBuyer ? 'You are buyer' : 'You are seller'}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {isBuyer
            ? `Seller business #${thread.sellerBusinessId}`
            : `Buyer business #${thread.buyerBusinessId || 'Individual'}`}
          {' · '}Started {formatDateTime(thread.createdAt)}
        </div>
      </div>
      <span className="text-xs text-ember-500 group-hover:text-ember-600 font-medium whitespace-nowrap">
        Open →
      </span>
    </Link>
  )
}

export default function ChatListPage() {
  const { data: threads, isLoading } = useMyThreads()
  const { user } = useAuth()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-7">
        <h1 className="text-xl font-bold text-gray-900">Conversations</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your active negotiation threads</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : !threads?.length ? (
        <EmptyState
          icon="💬"
          title="No conversations yet"
          description="Conversations start when you submit a quote or a seller responds to your RFQ."
          action={
            <Link to="/rfq/open" className="btn-primary mt-2">Browse open RFQs</Link>
          }
        />
      ) : (
        <div className="space-y-2">
          {threads.map(t => (
            <ThreadCard key={t.id} thread={t} userId={user?.userId} />
          ))}
        </div>
      )}
    </div>
  )
}
