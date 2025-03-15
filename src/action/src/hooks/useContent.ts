/**
 * 
Provides the only means of interacting with the user content state object
held within the UserContent class. 

The rationale behind this is the following:

    import imports a live binding to the UserContent class.

    useContent hook is created anew whenever it is used in a new component
    and is called on each render. The useContent hook does not store directly
    any content in the UserContent state, and merely acts as a broker for components
    which want access to it.

    with use

    the hook returns a function which allows us to make
 */
import UserContent from "../state/state";
import { EventEmitter } from "../state/events";
import { useEffect, useRef } from "react";

// IMPLEMENT: define discrete set of actions and options 
export default function useContent() {

    // Checks whether this hook has already been called once
    const initialisedBeforeRef = useRef(false)
    const eventsRef = useRef<EventEmitter | null>(null)

    useEffect(()=>{

        initialisedBeforeRef.current = true;

        //IMPLEMENT: Remove listener when unmounted        
        
    }, [])

    // IMPLEMENT: Attach listener to UserContent class which corresponds to this hook instance
    // We return a function which enables us to send events to the listener
    // and thereby trigger events on the UserContent class.

    if(!initialisedBeforeRef.current){
        eventsRef.current = UserContent.events
        return UserContent.events
    }

    

    
    return eventsRef.current
}