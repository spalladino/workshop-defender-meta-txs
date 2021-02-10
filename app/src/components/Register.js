import { useRef, useState, useContext } from 'react';
import { registerName } from '../eth/register';
import { EthereumContext } from "../eth/context";
import { toast } from 'react-toastify';

function Register() {
  const nameInput = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const { registry, provider } = useContext(EthereumContext);

  const sendTx = async (event) => {
    event.preventDefault();
    const name = nameInput.current.value;
    setSubmitting(true);
    
    try {
      const response = await registerName(registry, provider, name);
      toast('Transaction sent!', { type: 'info' });
      nameInput.current.value = '';
    } catch(err) {
      toast(err.message || err, { type: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  return <div>
    <h2>Register your name</h2>
    <form onSubmit={sendTx}>
      <input required={true} placeholder="Your name here" ref={nameInput}></input>
      <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
    </form>
  </div>
}

export default Register;