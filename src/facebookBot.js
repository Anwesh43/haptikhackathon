var Botkit = require('botkit')
var config = require('./config')
var controller = Botkit.facebookbot(config.tokens)
var bot = controller.spawn({})
controller.setupWebserver(config.port,(err,webserver)=>{
    if(err == null) {
      controller.createWebhookEndpoints(controller.webserver,bot,()=>{
          console.log("server is online")
      })
    }
})
controller.on('facebook_option',(message,bot)=>{
   bot.reply(message,"Hey!! to get started checking type START")
})
controller.hears(['hello','hi','hey'],'message_received',(bot,message)=>{
  bot.startTyping(message,()=>{

  })
    bot.reply(message,"Hey!! to get started checking type Help")
})

controller.hears(['Help'],'message_received',(bot,message)=>{
    bot.startTyping(message,()=>{

    })
    bot.startConversation(message,(err,convo)=>{

        console.log(convo)
        if(err == null) {
           convo.say("Let's check how fit you are")
           convo.ask('what is your weight?',(response,convo)=>{
              bot.startTyping(message,()=>{

              })
              console.log(response.text)
              convo.next()
           })
           convo.ask('what is your height?',(response,convo)=>{
              bot.startTyping(message,()=>{

              })
              console.log(response.text)
              convo.next()
           })
           convo.ask('what is your BMI?',(response,convo)=>{
              bot.startTyping(message,()=>{

              })
              console.log(response.text)
              convo.task.endImmediately()



           })
        }
    })
})
