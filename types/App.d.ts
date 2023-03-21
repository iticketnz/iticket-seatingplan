/// <reference types="react" />
import './App.css';
declare function App({ eventid, showinguid, sessionid, showingid, priceageid, price, quantity, style }: {
    eventid: number;
    showinguid: string;
    sessionid: string;
    showingid: number;
    priceageid: number;
    price: number;
    quantity: number;
    style: any;
}): JSX.Element;
export default App;
