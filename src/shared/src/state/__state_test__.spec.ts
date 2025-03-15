import UserContent from "./state";

describe("UserContent methods", () => {

    describe("init()", ()=>{
        it("Should subscribe 'fetch' event", () => {
            const eventEmitter = UserContent.events;
        
            // Check that event emitter object is returned
            expect(eventEmitter).not.toBe(null);
        
            const events = eventEmitter.events;
        
            // Check that fetch event is stored with async function
            expect(Object.keys(events)).toContain('fetch')
        
            // Check that a function is stored in the subscription
            expect(typeof events["fetch"]).toBe('function')
          });
        
        it("Emit fetch event should return promise and user content model", async ()=>{

            const eventEmitter = UserContent.events;

            const fetchPromise = eventEmitter.emit("fetch", null);

            expect(fetchPromise).not.toBe(null);
            expect(typeof fetchPromise.then).toBe('function');


            // Check user content model
            const userContentModelDummy = UserContent.testData
            const userContentModel = await fetchPromise
            
            expect(userContentModel).toEqual(userContentModelDummy)

        })
    })
});
