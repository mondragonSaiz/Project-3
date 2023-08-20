import React from "react";

export default function MonthLeader({compTask}) {
 let flattened = compTask.flat()
    let monday = 0
    let tuesday = 0
    let wednesday = 0
    let thursday = 0
    let friday = 0
    let saturday = 0
    let sunday = 0

    let birth = new Date ()
    console.log(birth.getDay())

    flattened.map(task=>{
        switch (task){
            case 0: 
                sunday++
                break;
            case 1: 
                monday++
                break;
            case 2: 
                tuesday++
                break;
            case 3: 
                wednesday++
                break;
            case 4: 
                thursday++
                break;
            case 5: 
                friday++
                break;
            case 6: 
                saturday++
                break;
            default:
                console.log('none')
        }
    })

    console.log(monday,tuesday,wednesday,thursday,friday,saturday,sunday)
   


    
    return (
      <div>
       
        <div className="flex flex-row w-full mt-2 justify-around rotate-180">
           
            <div className={`relative progress-bar bg-slate-200 w-5 h-${sunday} mb-1 rounded-lg`}>
                <div className="progress-bar-fill"></div>
            </div>
            <div className={`relative progress-bar bg-slate-200 w-5 h-${saturday} mb-1 rounded-lg`}>
                <div className="progress-bar-fill"></div>
            </div>
            <div className={`relative progress-bar bg-slate-200 w-5 h-${friday} mb-1 rounded-lg`}>
                <div className="progress-bar-fill"></div>
            </div>
            <div className={`relative progress-bar bg-slate-200 w-5 h-${thursday} mb-1 rounded-lg`}>
                <div className="progress-bar-fill"></div>
            </div>
            <div className={`relative progress-bar bg-slate-200 w-5 h-${wednesday} mb-1 rounded-lg`}>
                <div className="progress-bar-fill"></div>
            </div>
            <div className={`relative progress-bar bg-slate-200 w-5 h-${tuesday} mb-1 rounded-lg`}>
                <div className="progress-bar-fill"></div>
            </div>
            <div className={`relative progress-bar bg-slate-200 w-5 h-${monday} mb-1 rounded-lg`}>
                <div className="progress-bar-fill"></div>
            </div>
            
            </div>
               <div className="flex flex-row pt-2 justify-around font-poppins">
               <p className="text-slate-200 font-normal text-xs">M</p>
               <p className="text-slate-200 font-normal text-xs">T</p>
               <p className="text-slate-200 font-normal text-xs">W</p>
               <p className="text-slate-200 font-normal text-xs">T</p>
               <p className="text-slate-200 font-normal text-xs">F</p>
               <p className="text-slate-200 font-normal text-xs">S</p>
               <p className="text-slate-200 font-normal text-xs">S</p>
              
           </div>
         </div>    
    )
}