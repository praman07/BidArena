import BidHistoryTable from '@/features/auction/components/BidHistory'

export default function BidHistory({ bids = [] }) {
  return (
    <section className="space-y-3" aria-labelledby="live-bid-history-heading">
      <h2 id="live-bid-history-heading" className="text-lg font-semibold tracking-tight">
        Recent Bids
      </h2>
      <BidHistoryTable bids={bids} />
    </section>
  )
}
