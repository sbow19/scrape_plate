import { BrowserRouter, Routes, Route } from "react-router";
import { useEffect, useState } from "react";
/* CUSTOM HOOKS */

/* CUSTOM COMPONENT */

/* CUSTOM UTILS */
import UserContent from "./state/state"


function App() {
  // IMPLEMENT: Run initialisation logic here

  const [appLoaded, setIsAppLoaded] = useState(false);
  
  useEffect(()=>{

    if(!appLoaded){
      UserContent.init()
      
      // Initialise UserContent class
      UserContent.events.emit("fetch", null)
        .then((result: UserContentModel)=>{

          // Has user  used app before
          

        })
        .finally(()=>{
          setIsAppLoaded(true)
        })
    }

    
  }, []) // Execute once on first render 


  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* All paths come from the home screen */}
          <Route path="/" element={<></>}></Route>
        </Routes>
      </BrowserRouter>

      {/* Wrap route around */}
    </>
  );
}

export default App;
