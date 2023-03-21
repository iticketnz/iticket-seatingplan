import axios from 'axios'
import { useEffect, useState } from 'react'
import {
  MapContainer,
  Circle,
  ImageOverlay,
  Tooltip,
  GeoJSON,
} from 'react-leaflet'

const wheelchairSeat = require('../assets/wheelchair.png')

const SeatingPlan = ({
  eventId,
  showingUid,
  sessionId,
  showingId,
  priceAgeId,
  price,
  quantity,
} : {
  eventId: number,
  showingUid: string,
  sessionId: string,
  showingId: number,
  priceAgeId: number,
  price: number,
  quantity: number,
}) => {
  const [position, setPosition] = useState<any>(null)
  const [height, setHeight] = useState<number>(0)
  const [width, setWidth] = useState<number>(0)
  const [seats, setSeats] = useState<any>([])
  const [error, setError] = useState<any>(null)
  const [processing, setProcessing] = useState(false)
  const [bookedSeats, setBookedSeats] = useState<any>([])
  const [chosenSeat, setChosenSeat] = useState<{circle: any, seat: any} | null>(null)

  const statusColors = {
    unknown: '#95a5a6',
    available: '#2ecc71',
    sold: '#95a5a6',
    reserved: '#95a5a6',
    pending: '#e74c3c',
    booked: '#e74c3c',
  }

  const setInitialColor = (s: any) => {
    return {
      fillColor:
        s.status === 1
          ? statusColors.available
          : s.status === 4
          ? statusColors.booked
          : statusColors.sold,
      color: 'none',
      fillOpacity: 100,
    }
  }

  const handleClick = (e: any, s: any) => {
    if (
      (s.status !== 1 && s.status !== 4) ||
      processing ||
      (bookedSeats.length >= quantity && s.status === 1)
    )
      return

    setChosenSeat({ circle: e, seat: s })
    setProcessing(true)

    if (s.status === 1) {
      axios
        .post(
          `https://apim.iticket.co.nz/seatingplan/addseat`,
          {
            basketKey: '',
            eventId: eventId,
            showingId: showingId,
            priceAgeId: priceAgeId,
            seatId: s.showingSeatId,
            status: s.status,
            price: price,
          },
          {
            headers: {
              'session-id': `ASP.NET_SessionId=${sessionId}`,
              'showingseat-id': s.showingSeatId,
            },
          }
        )
        .then((response) => {
          s.status = 4
          e.target.setStyle({ fillColor: statusColors.booked })
          setProcessing(false)
          setBookedSeats([...bookedSeats, s])
        })
        .catch((error) => {
          e.target.setStyle({ fillColor: statusColors.available })

          const event = new CustomEvent('error', {
            detail:
              s.priceMinimum &&
              s.priceMaximum &&
              (price < s.priceMinimum || price > s.priceMaximum)
                ? {
                    error: {
                      code: 403,
                      message: 'Price specified not allowed.',
                    },
                  }
                : {
                    error: {
                      code: 500,
                      message: 'Oops! Something went wrong. Please try again.',
                    },
                  },
          })
          document.dispatchEvent(event)
          setProcessing(false)
        })
    } else {
      axios
        .post(
          `https://apim.iticket.co.nz/seatingplan/removeseat`,
          {
            basketKey: '',
            seatId: s.showingSeatId,
          },
          {
            headers: {
              'session-id': `ASP.NET_SessionId=${sessionId}`,
              'showingseat-id': s.showingSeatId,
            },
          }
        )
        .then((response) => {
          s.status = 1
          e.target.setStyle({ fillColor: statusColors.available })
          setBookedSeats(
            bookedSeats.filter((bs: any) => bs.showingSeatId !== s.showingSeatId)
          )
          setProcessing(false)
        })
        .catch((error) => {
          e.target.setStyle({ fillColor: statusColors.booked })

          const event = new CustomEvent('error', {
            detail: {
              error: {
                code: 500,
                message: 'Oops! Something went wrong. Please try again.',
              },
            },
          })
          document.dispatchEvent(event)
          setProcessing(false)
        })
    }
  }

  useEffect(() => {
    if (!position && !error) {
      axios
        .get(
          ` 
          https://api-iticket-ecommerce.azurewebsites.net/whitelabel/events/${eventId}/showings/${showingUid}/seats?priceage=${priceAgeId}`,
          { headers: { 'session-id': sessionId } }
        )
        .then(({ data }) => {
          const img = new Image()
          img.src = data.background

          setBookedSeats(data.seats.filter((s: any) => s.status === 4))

          img.onload = () => {
            setHeight(img.height)
            setWidth(img.width)
            setPosition([(img.height * 0.03) / 2, (img.width * 0.03) / 2])
            setSeats(data)
          }
        })
        .catch((error) => {
          setError(error)
        })
    }
  }, [position])

  useEffect(() => {
    if (bookedSeats && position && chosenSeat) {
      const event = new CustomEvent('cart-change', { detail: bookedSeats })
      document.dispatchEvent(event)
    }
  }, [bookedSeats])

  useEffect(() => {
    if (processing) {
      chosenSeat?.circle.target.setStyle({ fillOpacity: 0 })
    }
  }, [chosenSeat])

  // return seating plan
  return (
    <div style={{ height: '100%' }}>
      {error ? (
        <div className="loading">
          <h1>OOPS!</h1>
          <div>{error.response.data.message}</div>
        </div>
      ) : position ? (
        <MapContainer
          center={position}
          zoom={5}
          scrollWheelZoom={true}
          style={{ minHeight: '500px', height: '100%', minWidth: '500px' }}
          // onClick={handleClick}
        >
          <ImageOverlay
            url={seats.background}
            bounds={[
              [0, 0],
              [height * 0.03, width * 0.03],
            ]}
            zIndex={10}
          />
          {seats.seats.map((s: any, i: number) => (
            <div key={i}>
              <ImageOverlay
                url={`https://iticketseatingplan.blob.core.windows.net/embed/static/media/rippleload.08e6a08dd832819226ef.gif`}
                bounds={[
                  [height * 0.03 - s.raw_y * 0.61 - 0.2, s.raw_x * 0.615 - 0.2],
                  [height * 0.03 - s.raw_y * 0.61 + 0.2, s.raw_x * 0.615 + 0.2],
                ]}
                opacity={
                  chosenSeat &&
                  chosenSeat.seat.showingSeatId === s.showingSeatId
                    ? 100
                    : 0
                }
                zIndex={10}
              />
              {s.status === 6 ? (
                <ImageOverlay
                  url={wheelchairSeat}
                  bounds={[
                    [
                      height * 0.03 - s.raw_y * 0.61 - 0.17,
                      s.raw_x * 0.615 - 0.17,
                    ],
                    [
                      height * 0.03 - s.raw_y * 0.61 + 0.17,
                      s.raw_x * 0.615 + 0.17,
                    ],
                  ]}
                  zIndex={10}
                />
              ) : (
                <Circle
                  center={[
                    // (width * 0.03 - (s.raw_y - 11.5)) * 0.65,
                    // s.raw_x * 0.64,
                    height * 0.03 - s.raw_y * 0.61,
                    s.raw_x * 0.615,
                  ]}
                  pathOptions={setInitialColor(s)}
                  radius={20000}
                  eventHandlers={{ click: (e: any) => handleClick(e, s) }}
                  // value={s}
                >
                  <Tooltip direction={'top'} offset={[0, height * 0.03 + -30]}>
                    {s.rowName + '-' + s.columnName}
                  </Tooltip>
                </Circle>
              )}
            </div>
          ))}
          {/* <GeoJSON attribution="powered by &copy; iTICKET" data={}/> */}
        </MapContainer>
      ) : (
        <div className="loading">
          <div>
            <img
              src="https://iticketseatingplan.blob.core.windows.net/embed/static/media/spinner.gif"
              alt="loading"
            />
          </div>
          <div>Initialising SeatingPlan...</div>
        </div>
      )}
    </div>
  )
}

export default SeatingPlan
