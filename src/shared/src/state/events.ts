/**
 * Custom event emitter class
 *
 * Ony supports one function per event type
 */

type EventList = {
  // Event name and list of functions to be executed when event occurs
  [key: string]: Function;
};
export class EventEmitter {
  private _events: EventList;

  constructor() {
    this._events = {};
  }

  // Subscribe an event and associated functions to the events
  public subscribe(event: string, fn: Function) {
    if (!this._events[event]) {
      this._events[event] = fn;
    } else {
      throw Error("Listener already attached");
    }

    // Return unsubscribe function
    return () => {
      // Function reference and event name enclosed in callback
      delete this._events[event];
    };
  }

  // Emit an event
  public emit(event: string, data: any): Promise<any> {
    const storedFunction = this._events[event];

    // Cretae new data object local to this function call
    const newDataRef = JSON.parse(JSON.stringify(data));

    return new Promise((resolve, reject) => {
      if (storedFunction) {
        // Functions may or may no return promises, so emit returns a promise
        let potentialPromise = null
        try{
            potentialPromise = storedFunction.call(null, newDataRef);
        }catch(e){
            reject(e)
        }
        
        if (!potentialPromise) {
          resolve(potentialPromise);
          return;
        }

        // Handle promise
        if (typeof potentialPromise.then === "function") {
          potentialPromise.then((result) => {
            resolve(result);
          }).catch((error)=>{
            reject(error)
          });
        } else {
            resolve(potentialPromise); // Whatever the result was of this function
        }

      } else {
        // No function, cancel execution
        resolve(null);
        return;
      }
    });
  }

  public get events() {
    return this._events;
  }
}
