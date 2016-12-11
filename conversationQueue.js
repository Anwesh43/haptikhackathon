var height = 0,weight = 0;
var request = require('request')
var localApiNames = require('./localApiName')
module.exports = function(apiParams){
  return {messages:[{
     message:'What is your weight in Kg?',
     end:false,
     end_point_callback:function(text,bot,message) {
        weight = parseInt(text)
     }},{
     message:'What is your height in cm?',
     end:false,
     end_point_callback:function(text,bot,message) {
        height = parseInt(text)/100
        if(height!=0 && weight!=0) {
            bmi = weight/(height*height)
            bmi = Math.round(bmi)
            apiParams.BMI = bmi
            bot.reply(message,`your BMI is ${bmi}`)
        }
     }},{
     message:'What is your Insulin level?',
     end:false,
     end_point_callback:function(text,bot,message) {
        apiParams.Insulin = parseInt(text)
     }},
     {
     message:'What is your Glucose level?',
     end:false,
     end_point_callback:function(text,bot,message) {
        apiParams.Glucose = parseInt(text)
     }},
     {
     message:'What is your BloodPressure?',
     end:false,
     end_point_callback:function(text,bot,message) {
        apiParams.BloodPressure = parseFloat(text)

     }},
     {
     message:'What is your Skin Thickness?',
     end:false,
     end_point_callback:function(text,bot,message) {
        apiParams.SkinThickness = parseFloat(text)
        console.log(text)

     }},
      {
     message:'What is your Age?',
     end:true,
     end_point_callback:function(text,bot,message) {
        apiParams.Age = parseInt(text)
        request(localApiNames.trainEndPoint,(err,response,body)=>{
            if(err == null) {
                console.log(body)
                var algo = body["Algo"]
                if(algo == undefined) {
                    algo = "QDA"
                }
                request(localApiNames.testEndPoint+"?Algo="+algo+"&vals="+'['+[apiParams.Pregnancies,apiParams.Glucose,apiParams.BloodPressure,apiParams.SkinThickness,apiParams.Insulin,apiParams.BMI,apiParams.DiabetesPedigreeFunction,apiParams.Age]+']',function(err,res,body){
                    if(err == null) {
                        body = JSON.parse(body)
                        var prediction = body["Prediction"]
                        var msg = "Cheers you are not diabetic :D :D"
                        console.log(prediction)
                        console.log(typeof(prediction))
                        if(prediction == "1.0") {
                           msg = "Unfortunately you are diabetic :( but don't worry as we will give you some excellent health tips"
                        }
                        bot.reply(message,msg)
                    }
                    else {
                        bot.reply(message,"I couldn't determine whether you are diabetic or not")
                    }
                })
            }

        })
     }}

  ]}
}
