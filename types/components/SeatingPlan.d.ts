/// <reference types="react" />
declare const SeatingPlan: ({ eventId, showingUid, sessionId, showingId, priceAgeId, price, quantity, }: {
    eventId: number;
    showingUid: string;
    sessionId: string;
    showingId: number;
    priceAgeId: number;
    price: number;
    quantity: number;
}) => JSX.Element;
export default SeatingPlan;
