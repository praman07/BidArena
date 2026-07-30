import AuctionCard from './AuctionCard'

export default function AuctionGrid({ auctions }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {auctions.map((auction, index) => (
        <AuctionCard key={auction.id} auction={auction} index={index} />
      ))}
    </div>
  )
}
