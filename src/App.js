import './App.css'
import SeatingPlan from './components/SeatingPlan'

function App({
  eventid,
  showinguid,
  sessionid,
  showingid,
  priceageid,
  price,
  quantity,
}) {
  return (
    <div className="App">
      <SeatingPlan
        eventId={eventid * 1}
        showingUid={showinguid}
        sessionId={sessionid}
        showingId={showingid * 1}
        priceAgeId={priceageid * 1}
        price={price * 1}
        quantity={quantity * 1}
      />
    </div>
  )
}

export default App
