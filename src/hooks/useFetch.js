// imports
import { useState, useEffect, useRef } from "react";

// the hook itself =>
export const useFetch = (url, _options) => {
  // states
  const [data, setData] = useState(null); // to store data.

  const [isPending, setIsPending] = useState(false); // to know if request is fulfilled or not.

  const [error, setError] = useState(null); // to store errors.

  // options data is an object (primitive type of data) so it triggers an infinite loop
  // so we use "useRef" hook to reference to the first time that options object was created
  // in order to prevent recreating the object every time & the infinite loop.

  const options = useRef(_options).current; // to store options on how to request data.

  useEffect(() => {
    console.log(options); // how the was made. you can hide it later.

    const controller = new AbortController(); // to abort the request if the "state of parent" changes.

    const fetchData = async () => {
      // initiating an async function.

      setIsPending(true); // set the isPending value to true
      // in order to show a proper message while the request is made (typically a loading message).

      try {
        // a try catch block for catching errors.
        const response = await fetch(url, { signal: controller.signal }); // fetching the data.

        if (!response.ok) throw new Error(response.statusText); // throwing an error if the
        // response was not ok.

        const json = await response.json(); // converting response to json.

        setData(json); // changing data to the response that was received.

        setError(null); // keep the error variable empty.

        //
      } catch (error) {
        // if there was an error it will be handled here.

        if (error.name === "AbortError") {
          // if the "state of parent" changes forget everything and log the error to the console.
          console.log("the fetch was aborted");
        } else {
          // showing the error message.
          setError("Could not fetch the data");
          console.log(error.message);
        }
      } finally {
        // after the request is finished "isPending" value changes to false.
        setIsPending(false);
      }
    };

    fetchData(); // run the async function.

    return () => {
      // the everything canceler (if the request was aborted).
      controller.abort();
    };
  }, [url, options]); // redo the whole process if these values change!

  return {
    // send these data upwards to the parent component.
    data,
    isPending,
    error,
  };
};
