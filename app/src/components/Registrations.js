import { useContext, useState, useEffect } from "react";
import { EthereumContext } from "../eth/context";
import './Registrations.css';

const mapEvent = (event) => ({
  blockNumber: event.blockNumber,
  who: event.args.who,
  name: event.args.name,
  id: `${event.blockHash}/${event.transactionIndex}/${event.logIndex}`,
})

function Registrations() {
  const { registry } = useContext(EthereumContext);
  const [registrations, setRegistrations] = useState(undefined);

  useEffect(() => {
    const filter = registry.filters.Registered();

    const listener = (...args) => {
      const event = args[args.length-1];
      setRegistrations(rs => [mapEvent(event), ...rs || []]);
    };
    
    const subscribe = async() => {  
      const past = await registry.queryFilter(filter);
      setRegistrations((past.reverse() || []).map(mapEvent));
      registry.on(filter, listener);  
    }
    
    subscribe();
    return () => registry.off(filter, listener);
  }, []);

  return <div>
    <h2>Last registrations</h2>
    {registrations === undefined && (
      <span>Loading..</span>
    )}
    {registrations && (
      <ul>
        {registrations.map(r => (
          <li key={r.id}>{r.who}: {r.name}</li>
        ))}
      </ul>
    )}
  </div>
}

export default Registrations;