const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()
const port = process.env.PORT | 8888

app.use('/public', express.static(process.cwd() + '/public'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index page (static HTML)
app.get('/', (req,res) => {
    res.sendFile(process.cwd() + '/views/index.html')
  })

  function getLanguageTranslator() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;
    
    const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
    const { IamAuthenticator } = require('ibm-watson/auth');
    
    const languageTranslator = new LanguageTranslatorV3({
      version: '2018-05-01',
      authenticator: new IamAuthenticator({
        apikey: api_key,
      }),
      serviceUrl: api_url,
    });
    return languageTranslator;
  }
  function translate(textToTranslate, modelId, res) { // test
      let languageTranslator = getLanguageTranslator();
  
      const translateParams = {
          text: textToTranslate,
        //  modelId: 'en-es', 
        modelId
        };
      
      languageTranslator.translate(translateParams)
          .then(translationResult => {
              res.send(translationResult.result.translations[0].translation);
          }).catch(err => {
            res.send(err.toString());
          });
  }
  
  function getLanguages(res) {
      let languageTranslator = getLanguageTranslator();
      languageTranslator.listModels()
      .then(translationModels => {
        let models = translationModels.result.models;
        let modelNames = models.map((model)=>{
          return model.name
        });
        res.send(modelNames);
      })
      .catch(err => {
        res.send(err.toString());
      });
    
  }
  
  app.get("/translate", (req,res) => {
      let textToTranslate = req.query.textToTranslate;
      let modelId = req.query.modelId // test
      translate(textToTranslate, modelId, res); // test
  });
  
  app.get("/translators", (req,res) => {
    getLanguages(res);
  });

app.listen(port, () => {
    console.log('Server up on port: ' + port)
})
