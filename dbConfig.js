const mongoose = require('mongoose')

const Schema = mongoose.Schema;

//SUB DOCUMENT
const historySchema = new Schema({ //to store key historical data
  date:{
    type:String, // may be better than date
    required:true
  },
  
  nomoiScore:{
    type: Number,
    required:true,
  },

  ergonomicScore:{
    type: Number,
    required:true,
  },

  covid19Score:{
    type: Number,
    required:true,
  },

  postureTrackerScore:{
    type: Number,
    required:true,
  },
  screenDistanceScore:{
    type: Number,
    required:true,
  },
  hydrationTrackerScore:{
    type: Number,
    required:true,
  },
  screenTimerScore:{
    type: Number,
    required:true,
  },

  faceTouchScore:{
    type: Number,
    required:true,
  },
  faceMaskScore:{
    type: Number,
    required:true,
  },

});

//MAIN DOCUMENT
const UserDetail = new Schema({
    username: {
        type:String,
        required: true,
        trim:true},

    password: String,
    
    premium:{
      type:Boolean,
      default:false},
      
    expired:{
      type:Boolean,
      default:false},

    //personal Details  
    firstname: {
        type:String},
    
    surname: {
      type:String},
    
    height:{
      type:Number,
      default:172,
    },
     
    company:{
        type:String,
        required:false},

    DoB:{
      type:Date,
      required:false}, 
    

    //Overall Usage -- sub documented to see if this is a nice way of doing it 
    covid19_AvgScore:{
      type:Number,
      default:50,
    },

    ergonomic_AvgScore:{
      type:Number,
      default:50,
    },
    
    noOfLogins:{
      type:Number,
      default:0,
    },
    
    //total usages will be in minutes apart from Screen Distance
    totalMinutes:{
      type:Number,
      default:0
    },

    faceTouch_totalUse:{
      type:Number,
      default:0
    },

    faceMask_totalUse:{
      type:Number,
      default:0
    },

    postureTracker_totalUse:{
      type:Number,
      default:0
    },

    screenDistance_avgWarnings:{ // hour 
      type:Number,
      default:0
    },

    hydrationTracker_totalUse:{ // i.e no of times turned on 
      type:Number,
      default:0
    },

    screenTimer_totalUse:{
      type:Number,
      default:0 
    },

    //Nomoi History
    history: [historySchema],

    
    //Covid19 Averages -- not subdocumented for now

    faceTouch_AvgScore:{
        type:Number,
        default:50,
    },

    faceMask_AvgScore:{
        type:Number,
        default:50,
    },

    //Ergonomic Averages

    postureTrackerScore_AvgScore:{
      type:Number,
      default:50,
    },

    screenDistance_AvgScore:{
      type:Number,
      default:50,
    },

    hydrationTracker_AvgScore:{
      type:Number,
      default:50,
    },

    screenTimer_AvgScore:{
      type:Number,
      default:50,
    }
    

    //end of schema
},{timestamps:{createdAt:'created_at'},currentTime:new Date("<YYYY-mm-dd>")}); // cut down precision 

exports.UserDetail = UserDetail